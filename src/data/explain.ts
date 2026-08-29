/**
 * THE EXPLANATION CONTRACT — Ask does not return chat. It returns
 * VINDEX explanations.
 *
 * The architecture, in order, with the boundaries deliberate:
 *
 *   question
 *     → resolver (intent + entities + canonical match — graph only)
 *     → ExplanationRequest (the resolved subgraph, nothing else)
 *     → an ExplanationBackend
 *     → ExplanationResponse (typed; HAUSE renders it)
 *
 * The resolver sits OUTSIDE any backend, so every backend answers
 * from the same resolved facts. V1 ships one backend — GraphOnly,
 * fully deterministic, no model call. A synthesis backend (a small
 * hosted model now, a LARQL-served model later) slots behind the same
 * request/response types without the renderer changing: the model
 * would choose meaning within the resolved subgraph; it never gets to
 * "know" VINDEX3 from its priors, and it never emits markup — only
 * this schema.
 *
 * The honesty rule is architectural: if no supported subgraph exists,
 * the answer is a refusal that says so, with the nearest evidence —
 * never a guess.
 */

import {
	SNAPSHOT,
	NODES,
	EDGES,
	CANON,
	ENTITIES,
	GATE_NODES,
	findEntities,
	entity,
	type CanonEntry,
	type Entity,
	type GateNode,
} from "./vindexGraph";

/* ── The response contract ── */

export type AnswerType =
	| "canonical"
	| "definition"
	| "component_flow"
	| "status_report"
	| "related"
	| "refusal"
	| "synthesis"
	| "unsupported";

export type ExplanationAction = { label: string; href: string; accent?: boolean };

export type EvidenceRow = { from: string; rel: string; to: string };

export type ExplanationResponse = {
	answer_type: AnswerType;
	/** The five-word canonical form the question resolved to. */
	interpreted?: string;
	confidence?: number;
	title?: string;
	summary: string;
	/** Per-entity rows (component_flow) — display, signature, role. */
	rows?: { head: string; five: string; body: string }[];
	/** Gate rows (status_report). */
	gates?: GateNode[];
	/** The graph path that grounds the answer. */
	evidence?: EvidenceRow[];
	record?: { status: string; note: string };
	actions: ExplanationAction[];
	/** Near-miss reask chips (related / refusal). */
	related?: { label: string; ask: string }[];
	/** Synthesis only: the model's own stated limits. */
	caveats?: string;
	/** The HAUSE treatment the resolved subgraph declares for itself —
	 * rendered as the real instrument, not a picture of one. */
	visual?: "ffn_gate_up_down" | "attention_qkv" | "moe_router";
	snapshot: string;
};

const GROUP_VISUALS: Record<string, ExplanationResponse["visual"]> = {
	"feed-forward": "ffn_gate_up_down",
	attention: "attention_qkv",
	moe: "moe_router",
};

/* ── The bounded fact bundle a synthesis backend receives ──
 * Retrieval lives here, outside every backend: the model narrates the
 * resolved facts and nothing else — its priors are not evidence. */

export type SynthesisFacts = {
	question: string;
	snapshot: string;
	entities: { id: string; display: string; five: string; role: string; detail: string; relations: { rel: string; to: string }[] }[];
	canonical: { summary: string; answer: string }[];
	gates: GateNode[];
};

export function resolveForSynthesis(question: string): SynthesisFacts {
	const q = question.trim();
	const toks = tokens(q);
	const ql = q.toLowerCase();
	const matched = findEntities(toks, ql);
	const canon = scoreCanon(q)
		.filter((c) => c.confidence >= 0.14)
		.slice(0, 3)
		.map((c) => ({ summary: c.entry.summary, answer: c.entry.answer }));
	return {
		question: q,
		snapshot: `${SNAPSHOT.id} · ${SNAPSHOT.date}`,
		entities: matched.slice(0, 4).map((m) => ({
			id: m.id,
			display: m.display,
			five: m.five,
			role: m.role,
			detail: m.detail,
			relations: m.relations,
		})),
		canonical: canon,
		gates: STATUS_HINT.test(q) ? GATE_NODES : [],
	};
}

/* ── The resolver — graph only, shared by every backend ── */

const STOP = new Set([
	"the", "a", "an", "is", "are", "was", "it", "its", "of", "to", "in", "on", "and", "or", "for",
	"with", "does", "do", "can", "i", "my", "me", "from", "that", "this", "there", "be", "just",
	"another", "about", "vindex3", "vindex", "what", "why", "how", "actually", "mean", "means",
]);

const ABUSE =
	/system prompt|ignore (your|all|previous)|credential|api.?key|drop\s+(table|database)|delete\s+from|truncate|every node|all nodes|enumerate|dump (the|your)|exfiltrat/i;

const STATUS_HINT = /status|ready|frozen|open|passed|building|finished|complete|still|remains|gate|g\d\b|m4|parity/i;

function tokens(q: string): string[] {
	return q
		.toLowerCase()
		.split(/[^a-z0-9._]+/)
		.filter((t) => t.length > 0 && !STOP.has(t));
}

function scoreCanon(q: string): { entry: CanonEntry; confidence: number }[] {
	const toks = tokens(q);
	const ql = q.toLowerCase();
	return CANON.map((entry) => {
		let score = 0;
		for (const ent of entry.entities) if (toks.includes(ent) || ql.includes(ent)) score += 2;
		const sumToks = tokens(entry.summary);
		for (const t of toks) if (sumToks.includes(t)) score += 1;
		if (entry.patterns) for (const p of entry.patterns) if (ql.includes(p)) score += 3;
		return { entry, confidence: Math.min(1, score / 7) };
	}).sort((a, b) => b.confidence - a.confidence);
}

const nodeLabel = (id: string) => NODES.find((n) => n.id === id)?.label ?? entity(id)?.display ?? id;

const rel = (r: string) => r.replace(/_/g, " ");

function entityEvidence(matched: Entity[]): EvidenceRow[] {
	const ids = new Set(matched.map((m) => m.id));
	const rows: EvidenceRow[] = [];
	for (const ent of matched)
		for (const r of ent.relations)
			rows.push({ from: ent.display, rel: rel(r.rel), to: nodeLabel(r.to) });
	// Relations among the matched set first, then the rest, capped.
	rows.sort((a, b) => {
		const aIn = matched.some((m) => m.display === a.to || ids.has(a.to)) ? 0 : 1;
		const bIn = matched.some((m) => m.display === b.to) ? 0 : 1;
		return aIn - bIn;
	});
	return rows.slice(0, 6);
}

const GROUP_TITLES: Record<string, string> = {
	attention: "How attention's parts work together",
	"feed-forward": "How gate, up and down work",
	moe: "How the router and the experts work",
	layer: "What a layer is made of",
	format: "How the format holds it",
};

/* ── The GraphOnly backend — deterministic; V1's only backend ── */

export function resolveAndExplain(question: string): ExplanationResponse {
	const snapshot = `${SNAPSHOT.id} · ${SNAPSHOT.date}`;
	const q = question.trim();

	if (ABUSE.test(q)) {
		return {
			answer_type: "unsupported",
			summary:
				"That operation does not exist in this universe. The query surface is read-only over a versioned public snapshot — there is nothing to disclose and nothing to drop.",
			actions: [],
			snapshot,
		};
	}

	const canon = scoreCanon(q);
	const toks = tokens(q);
	const ql = q.toLowerCase();
	const matched = findEntities(toks, ql);

	// L1 — the canonical cache answers first when it is confident.
	if (canon[0] && canon[0].confidence >= 0.5) {
		const m = canon[0].entry;
		return {
			answer_type: "canonical",
			interpreted: m.summary,
			confidence: canon[0].confidence,
			summary: m.answer,
			evidence: m.path.map((i) => ({
				from: nodeLabel(EDGES[i].from),
				rel: rel(EDGES[i].rel),
				to: nodeLabel(EDGES[i].to),
			})),
			record: m.record,
			actions: m.explore.flatMap((id) => {
				const n = NODES.find((x) => x.id === id);
				return n?.href ? [{ label: `${n.label} →`, href: n.href }] : [];
			}),
			snapshot,
		};
	}

	// L2b first when a gate is named outright: asking after G7 or a
	// named open row is a status question even when it mentions experts.
	const namedGates = GATE_NODES.filter(
		(g) => toks.includes(g.id.toLowerCase()) || ql.includes(g.label.toLowerCase())
	);
	if (namedGates.length > 0) {
		return {
			answer_type: "status_report",
			interpreted: "status derives from gate nodes",
			summary: `The graph's record for ${namedGates.map((g) => g.id).join(", ")}:`,
			gates: namedGates,
			actions: [{ label: "THE RECORD — THE FULL LEDGER →", href: "/ladder", accent: true }],
			snapshot,
		};
	}

	// L2 — entity resolution against the graph's vocabulary layer.
	if (matched.length >= 2) {
		const group = matched.find((m) => m.group !== "layer")?.group ?? matched[0].group;
		const inGroup = matched.filter((m) => m.group === group || m.group === "layer");
		const showMe = inGroup.find((m) => m.explorer)?.explorer;
		return {
			answer_type: "component_flow",
			visual: GROUP_VISUALS[group],
			title: GROUP_TITLES[group],
			interpreted: inGroup.map((m) => m.id).join(" · "),
			summary: inGroup.map((m) => m.role).join(" "),
			rows: inGroup.map((m) => ({ head: m.display, five: m.five, body: m.role })),
			evidence: entityEvidence(inGroup),
			actions: [
				...(showMe
					? [{ label: `SHOW ME — ${showMe} →`, href: `/explorer?run=${encodeURIComponent(showMe)}`, accent: true }]
					: []),
				{ label: "THE ANATOMY →", href: inGroup[0].href },
			],
			snapshot,
		};
	}

	if (matched.length === 1) {
		const m = matched[0];
		return {
			answer_type: "definition",
			visual: GROUP_VISUALS[m.group],
			title: m.display,
			interpreted: m.five,
			summary: `${m.role} ${m.detail}`,
			evidence: entityEvidence([m]),
			actions: [
				...(m.explorer
					? [{ label: `SHOW ME — ${m.explorer} →`, href: `/explorer?run=${encodeURIComponent(m.explorer)}`, accent: true }]
					: []),
				{ label: "THE ANATOMY →", href: m.href },
			],
			snapshot,
		};
	}

	// L2b — status questions derive from the gate nodes, never asserted.
	if (STATUS_HINT.test(q)) {
		const named = GATE_NODES.filter((g) => toks.includes(g.id.toLowerCase()));
		const gates = named.length ? named : GATE_NODES;
		const open = GATE_NODES.filter((g) => g.status !== "PASSED").length;
		return {
			answer_type: "status_report",
			interpreted: "status derives from gate nodes",
			summary: named.length
				? `The graph's record for ${named.map((g) => g.id).join(", ")}:`
				: `The format works — five production models encode, verify, and execute byte-identically — and ${open} gates remain honestly un-passed. Nothing freezes until they close. Derived from the gate nodes, not asserted:`,
			gates,
			actions: [{ label: "THE RECORD — THE FULL LEDGER →", href: "/ladder", accent: true }],
			snapshot,
		};
	}

	// L1½ — near-misses become doors, not guesses.
	const near = canon.filter((c) => c.confidence >= 0.28).slice(0, 3);
	if (near.length) {
		return {
			answer_type: "related",
			summary: "No supported subgraph resolves that exactly — the nearest canonical questions:",
			related: near.map((c) => ({ label: `${c.entry.summary} · ${c.confidence.toFixed(2)}`, ask: c.entry.summary })),
			actions: [],
			snapshot,
		};
	}

	// The architectural rule: no supported subgraph → say so.
	return {
		answer_type: "refusal",
		summary: "The current VINDEX3 graph does not establish that.",
		related: [
			{ label: CANON[0] ? canon[0].entry.summary : "", ask: canon[0]?.entry.summary ?? "" },
			{ label: canon[1]?.entry.summary ?? "", ask: canon[1]?.entry.summary ?? "" },
		].filter((r) => r.label),
		actions: [{ label: "THE RECORD — WHAT IS ESTABLISHED →", href: "/ladder" }],
		snapshot,
	};
}
