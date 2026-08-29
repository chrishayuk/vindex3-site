import { NextRequest, NextResponse } from "next/server";
import { resolveForSynthesis, type ExplanationResponse } from "@/data/explain";
import { searchCorpus, strongHit, CORPUS_META } from "@/data/corpus";

/**
 * THE SYNTHESIS TIER — POST /api/explain.
 *
 * Called only when the deterministic layers (canonical cache, entity
 * resolution, status derivation) could not answer. The resolver runs
 * HERE, server-side, so every backend narrates the same facts and the
 * client is never trusted to supply them. The model is a small
 * semantic compiler, not the VINDEX3 expert:
 *
 *   answerable facts  = the resolved graph, only
 *   language          = the model's
 *   external knowledge = not evidence
 *
 * It emits only the constrained schema (structured outputs) — never
 * markup, never free chat — and when the facts don't establish an
 * answer it must refuse with the graph's own sentence. Protection is
 * layered and boring: per-IP rate limit, bounded question, bounded
 * facts, capped output tokens, an in-memory cache keyed on the
 * normalised question, a daily budget, no conversation history. The
 * key lives only in the server environment; with no key configured
 * the tier reports itself unavailable and the deterministic refusal
 * stands — the site never degrades below honest.
 *
 * The backend is replaceable behind this contract: today a small
 * hosted model; later a LARQL-served model, at which point the site
 * explains itself through the stack it documents.
 *
 * THE WALLET GATE: every uncached request must carry a Turnstile token
 * (widget vindex3-ask, managed mode), verified server-side via
 * canonical siteverify BEFORE any model call. Rate limits and budgets
 * are speed bumps — in-memory, per-machine, reset on restart; the
 * Turnstile verification is the lock, because a token is single-use,
 * short-lived, bound to the widget's domains, and issued only to a
 * real browser session. No TURNSTILE_SECRET configured → the tier
 * fails closed. Cached answers are served without a token: they cost
 * nothing and contain only public graph facts.
 */

const MODEL = process.env.OPENAI_MODEL ?? "gpt-5.6-luna";
const DAILY_BUDGET = Number(process.env.ASK_DAILY_BUDGET ?? 500);
const RATE_PER_MIN = 10;
const MAX_QUESTION_CHARS = 300;
const MAX_OUTPUT_TOKENS = 500;

/* ── In-memory protection state (single instance; resets on deploy) ── */
const cache = new Map<string, ExplanationResponse>();
const rate = new Map<string, { count: number; windowStart: number }>();
let day = new Date().toISOString().slice(0, 10);
let spentToday = 0;

function rateLimited(ip: string): boolean {
	const now = Date.now();
	const r = rate.get(ip);
	if (!r || now - r.windowStart > 60_000) {
		rate.set(ip, { count: 1, windowStart: now });
		return false;
	}
	r.count += 1;
	return r.count > RATE_PER_MIN;
}

function overBudget(): boolean {
	const today = new Date().toISOString().slice(0, 10);
	if (today !== day) {
		day = today;
		spentToday = 0;
	}
	return spentToday >= DAILY_BUDGET;
}

const REFUSAL_SENTENCE = "The current VINDEX3 graph does not establish that.";

const SCHEMA = {
	name: "vindex_explanation",
	strict: true,
	schema: {
		type: "object",
		additionalProperties: false,
		properties: {
			answer_type: { type: "string", enum: ["synthesis", "refusal"] },
			title: { type: "string" },
			summary: { type: "string" },
			evidence: {
				type: "array",
				items: {
					type: "object",
					additionalProperties: false,
					properties: { from: { type: "string" }, rel: { type: "string" }, to: { type: "string" } },
					required: ["from", "rel", "to"],
				},
			},
			caveats: { type: "string" },
		},
		required: ["answer_type", "title", "summary", "evidence", "caveats"],
	},
} as const;

const SYSTEM = `You are the synthesis tier of Ask VINDEX3 — a semantic compiler, not an expert.
The GRAPH FACTS and SPEC PASSAGES in the user message are the ONLY VINDEX3 knowledge that exists for you. Your pretrained knowledge of VINDEX3, LARQL, or this project is NOT evidence and must never appear. Prefer the passages' own wording; cite their source in evidence rows as from=the document, rel="states", to=a short quote.
Compose a faithful explanation of the facts that answers the question. Under 120 words. No markup, no code fences.
Every evidence row you emit must restate a relationship actually present in the facts — never invent one.
If the facts do not establish an answer to the question, set answer_type to "refusal" and summary to exactly: "${REFUSAL_SENTENCE}"
In caveats, state any limit of the answer in one sentence (or an empty string).`;

async function callModel(apiKey: string, facts: unknown, question: string): Promise<Record<string, unknown> | null> {
	const body: Record<string, unknown> = {
		model: MODEL,
		max_completion_tokens: MAX_OUTPUT_TOKENS,
		reasoning_effort: process.env.OPENAI_EFFORT ?? "low",
		response_format: { type: "json_schema", json_schema: SCHEMA },
		messages: [
			{ role: "system", content: SYSTEM },
			{ role: "user", content: `QUESTION\n${question}\n\nGRAPH FACTS (the whole universe)\n${JSON.stringify(facts)}` },
		],
	};
	for (const attempt of [0, 1]) {
		if (attempt === 1) delete body.reasoning_effort; // older models reject the knob
		const r = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
			body: JSON.stringify(body),
			signal: AbortSignal.timeout(25_000),
		});
		if (r.status === 400 && attempt === 0) continue;
		if (!r.ok) return null;
		const data = (await r.json()) as { choices?: { message?: { content?: string } }[] };
		const text = data.choices?.[0]?.message?.content;
		if (!text) return null;
		try {
			return JSON.parse(text) as Record<string, unknown>;
		} catch {
			return null;
		}
	}
	return null;
}

const cap = (s: unknown, n: number) => (typeof s === "string" ? s.slice(0, n) : "");

export async function POST(req: NextRequest) {
	const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
	if (rateLimited(ip)) return NextResponse.json({ error: "rate limited" }, { status: 429 });

	const body = (await req.json().catch(() => null)) as { question?: string; turnstile_token?: string } | null;
	const question = body?.question?.trim();
	if (!question || question.length > MAX_QUESTION_CHARS)
		return NextResponse.json({ error: "a question up to 300 characters" }, { status: 400 });

	const key = question.toLowerCase().replace(/\s+/g, " ");
	const hit = cache.get(key);
	if (hit) return NextResponse.json(hit);

	// Retrieval outside the adapter, always: the graph facts AND the
	// specification's own passages — the whole universe any backend sees.
	const facts = resolveForSynthesis(question);
	const hits = searchCorpus(question, 4);
	const wordTrim = (t: string, max: number) => {
		if (t.length <= max) return { text: t, trimmed: false };
		const cut = t.lastIndexOf(" ", max);
		return { text: t.slice(0, cut > max * 0.6 ? cut : max).trimEnd(), trimmed: true };
	};
	facts.passages = hits.map((h) => {
		const w = wordTrim(h.passage.text, 900);
		return {
			source: `${h.passage.source} · ${h.passage.doc}`,
			heading: h.passage.heading,
			text: w.text,
			trimmed: w.trimmed,
		};
	});

	const token = body?.turnstile_token;
	const apiKey = process.env.OPENAI_API_KEY;
	const turnstileSecret = process.env.TURNSTILE_SECRET;

	if (!token) {
		// The free tier: when retrieval is decisive, the spec answers in
		// its own words — verbatim, attributed, no model, no challenge.
		if (strongHit(question, hits)) {
			const response: ExplanationResponse = {
				answer_type: "spec_excerpts",
				summary:
					"The graph holds no typed answer for that yet — but the specification speaks to it. Its own words, retrieved verbatim:",
				passages: hits.slice(0, 3).map((h) => {
					const w = wordTrim(h.passage.text, 700);
					return { source: h.passage.source, heading: h.passage.heading, text: w.text, trimmed: w.trimmed };
				}),
				actions: [{ label: "THE RECORD →", href: "/ladder" }],
				snapshot: `${facts.snapshot} · corpus ${CORPUS_META.generated} (${CORPUS_META.passages} passages)`,
			};
			cache.set(key, response);
			return NextResponse.json(response);
		}
		// Retrieval was not decisive. Synthesis exists — but it costs,
		// so it sits behind the wallet gate: ask the client to verify.
		if (apiKey && turnstileSecret) return NextResponse.json({ error: "verification required" }, { status: 428 });
		return NextResponse.json({ error: "no supported subgraph" }, { status: 404 });
	}

	// ── The wallet gate: a model call only behind a verified token ──
	if (!apiKey || !turnstileSecret)
		return NextResponse.json({ error: "synthesis tier not configured" }, { status: 503 });
	if (token.length > 4096) return NextResponse.json({ error: "forbidden" }, { status: 403 });
	const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
		method: "POST",
		headers: { "content-type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({ secret: turnstileSecret, response: token, remoteip: ip }),
		signal: AbortSignal.timeout(10_000),
	}).catch(() => null);
	const verdict = verify ? ((await verify.json().catch(() => null)) as { success?: boolean } | null) : null;
	if (!verdict?.success) return NextResponse.json({ error: "forbidden" }, { status: 403 });

	if (overBudget()) return NextResponse.json({ error: "daily budget reached" }, { status: 503 });
	if (facts.entities.length === 0 && facts.canonical.length === 0 && facts.gates.length === 0 && hits.length === 0)
		return NextResponse.json({ error: "no supported subgraph" }, { status: 404 });

	spentToday += 1;
	const raw = await callModel(apiKey, facts, question);
	if (!raw) return NextResponse.json({ error: "synthesis failed" }, { status: 502 });

	// Post-validation: only our fields, capped, our labels.
	const refused = raw.answer_type === "refusal";
	const evidence = Array.isArray(raw.evidence)
		? (raw.evidence as { from?: unknown; rel?: unknown; to?: unknown }[])
				.slice(0, 6)
				.map((e) => ({ from: cap(e.from, 80), rel: cap(e.rel, 60), to: cap(e.to, 120) }))
				.filter((e) => e.from && e.rel && e.to)
		: [];
	const response: ExplanationResponse = refused
		? {
				answer_type: "refusal",
				summary: REFUSAL_SENTENCE,
				related: facts.canonical.map((c) => ({ label: c.summary, ask: c.summary })),
				actions: [{ label: "THE RECORD — WHAT IS ESTABLISHED →", href: "/ladder" }],
				snapshot: facts.snapshot,
			}
		: {
				answer_type: "synthesis",
				title: cap(raw.title, 120),
				summary: cap(raw.summary, 1200),
				evidence,
				caveats: cap(raw.caveats, 300) || undefined,
				passages: facts.passages?.slice(0, 2).map((pg) => {
					const w = wordTrim(pg.text, 500);
					return { ...pg, text: w.text, trimmed: pg.trimmed || w.trimmed };
				}),
				actions: [{ label: "THE RECORD →", href: "/ladder" }],
				snapshot: facts.snapshot,
			};
	cache.set(key, response);
	if (cache.size > 2000) cache.delete(cache.keys().next().value as string);
	return NextResponse.json(response);
}
