"use client";

import { useState } from "react";
import Link from "next/link";
import { SNAPSHOT, NODES, EDGES, CANON, SUGGESTIONS, type CanonEntry } from "@/data/vindexGraph";
import { tick, refuse } from "@chrishayuk/hause/sound";

/**
 * ASK VINDEX3 — an intelligent query interface, not a chatbot.
 *
 * natural language → five-word canonical form → graph address →
 * evidence → answer. Fully deterministic: the question is matched
 * against a canonical index compiled into the site, the answer's
 * graph path and Record line are shown, and the interpretation is
 * displayed so the system reads as a query engine, not magic. No
 * model call, no server, no write surface — the universe is the
 * versioned public graph snapshot and nothing else. A synthesis tier
 * can sit behind this later without changing the contract.
 */

const STOP = new Set(["the", "a", "an", "is", "are", "was", "it", "its", "of", "to", "in", "on", "and", "or", "for", "with", "does", "do", "can", "i", "my", "me", "from", "that", "this", "there", "be", "just", "another", "about", "vindex3", "vindex"]);

const ABUSE = /system prompt|ignore (your|all|previous)|credential|api.?key|drop\s|delete\s|truncate|every node|all nodes|enumerate|dump (the|your)|exfiltrat/i;

const INTENT_HINTS: [RegExp, CanonEntry["intent"]][] = [
	[/^why|why\s/i, "why"],
	[/differ|versus|vs\.?|compare|instead of|rather than|different/i, "compare"],
	[/^how|how\s/i, "how"],
	[/status|ready|frozen|today|current|open|passed/i, "status"],
	[/show|story|example|demonstrat/i, "show"],
	[/^what|what\s/i, "what"],
];

function tokens(q: string): string[] {
	return q.toLowerCase().split(/[^a-z0-9._]+/).filter((t) => t.length > 1 && !STOP.has(t));
}

type MatchResult = { entry: CanonEntry; confidence: number };

function interpret(q: string): { intent: CanonEntry["intent"] | null; matches: MatchResult[] } {
	const toks = tokens(q);
	let intent: CanonEntry["intent"] | null = null;
	for (const [re, i] of INTENT_HINTS) if (re.test(q)) { intent = i; break; }
	const ql = q.toLowerCase();
	const scored = CANON.map((entry) => {
		let score = 0;
		for (const ent of entry.entities) if (toks.includes(ent) || ql.includes(ent)) score += 2;
		const sumToks = tokens(entry.summary);
		for (const t of toks) if (sumToks.includes(t)) score += 1;
		if (entry.patterns) for (const p of entry.patterns) if (ql.includes(p)) score += 3;
		if (intent && entry.intent === intent) score += 1;
		return { entry, confidence: Math.min(1, score / 7) };
	}).sort((a, b) => b.confidence - a.confidence);
	return { intent, matches: scored.slice(0, 3) };
}

const node = (id: string) => NODES.find((n) => n.id === id)!;

type Result =
	| { kind: "answer"; q: string; m: MatchResult }
	| { kind: "related"; q: string; ms: MatchResult[] }
	| { kind: "none"; q: string }
	| { kind: "unsupported"; q: string };

export function QueryVindex({ compact = false }: { compact?: boolean }) {
	const [q, setQ] = useState("");
	const [result, setResult] = useState<Result | null>(null);
	const [thinking, setThinking] = useState(false);

	function ask(question: string) {
		const query = question.trim();
		if (!query) return;
		setQ(query);
		setThinking(true);
		setResult(null);
		// The considered pause — an instant snap reads as broken, not fast.
		setTimeout(() => {
			setThinking(false);
			if (ABUSE.test(query)) {
				refuse();
				setResult({ kind: "unsupported", q: query });
				return;
			}
			const { matches } = interpret(query);
			tick();
			if (matches[0] && matches[0].confidence >= 0.5) setResult({ kind: "answer", q: query, m: matches[0] });
			else if (matches[0] && matches[0].confidence >= 0.28)
				setResult({ kind: "related", q: query, ms: matches.filter((m) => m.confidence >= 0.28) });
			else setResult({ kind: "none", q: query });
		}, 650);
	}

	const pathRow = (edgeIdx: number, i: number) => {
		const edge = EDGES[edgeIdx];
		const a = node(edge.from);
		const b = node(edge.to);
		return (
			<div key={i} className="graph-pulse flex items-baseline gap-3 flex-wrap" style={{ animationDelay: `${i * 140}ms` }}>
				<span className="voice-evidence text-xs">{a.label}</span>
				<span className="voice-evidence text-[10px] tracking-[0.08em] uppercase opacity-50">— {edge.rel.replace(/_/g, " ")} →</span>
				<span className="voice-evidence text-xs" style={{ color: "var(--color-accent)" }}>{b.label}</span>
			</div>
		);
	};

	return (
		<section className="hause-grid py-16 sm:py-24">
			<div className="col-span-12 md:col-start-2 md:col-span-9">
				<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-3 opacity-50">
					ASK VINDEX3 — THE DOCUMENTATION IS A DATABASE TOO
				</p>
				{!compact && (
					<p className="voice-editorial text-2xl sm:text-3xl mb-8 max-w-2xl">
						If the model is a database, the documentation should feel like one.
					</p>
				)}

				<form
					onSubmit={(e) => {
						e.preventDefault();
						ask(q);
					}}
					className="flex gap-3 max-w-2xl"
				>
					<input
						value={q}
						onChange={(e) => setQ(e.target.value)}
						placeholder="why isn't VINDEX3 just another quantised format?"
						aria-label="Ask a question about VINDEX3"
						className="voice-evidence text-sm flex-1 border bg-transparent px-4 py-3 outline-none focus-visible:outline-2"
						style={{ borderColor: "var(--fg)", color: "var(--fg)" }}
					/>
					<button type="submit" className="voice-evidence text-xs tracking-[0.14em] uppercase border px-5" style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)" }}>
						ASK →
					</button>
				</form>

				<div className="flex flex-wrap gap-2 mt-4 max-w-2xl">
					{SUGGESTIONS.slice(0, compact ? 3 : 5).map((s) => (
						<button
							key={s}
							onClick={() => ask(s)}
							className="voice-evidence text-[11px] px-3 py-1.5 border opacity-60 hover:opacity-100"
							style={{ borderColor: "var(--color-mist)" }}
						>
							{s}
						</button>
					))}
				</div>

				<div className="mt-10 min-h-[4rem]" aria-live="polite">
					{thinking && <p className="voice-evidence text-xs tracking-[0.1em] uppercase opacity-40 graph-pulse">resolving…</p>}

					{result?.kind === "answer" && (
						<div key={result.m.entry.id}>
							<p className="voice-evidence text-[11px] opacity-50">
								INTERPRETED AS&nbsp;&nbsp;<span style={{ color: "var(--color-accent)" }}>{result.m.entry.summary}</span>
								&nbsp;&nbsp;·&nbsp;&nbsp;match {result.m.confidence.toFixed(2)} · snapshot {SNAPSHOT.id} / {SNAPSHOT.date}
							</p>
							<p className="voice-system text-base sm:text-lg opacity-90 leading-relaxed max-w-2xl mt-5">{result.m.entry.answer}</p>

							<p className="voice-evidence text-[10px] tracking-[0.12em] uppercase opacity-50 mt-8 mb-3">EVIDENCE — THE GRAPH PATH</p>
							<div className="flex flex-col gap-2">{result.m.entry.path.map(pathRow)}</div>

							{result.m.entry.record && (
								<>
									<p className="voice-evidence text-[10px] tracking-[0.12em] uppercase opacity-50 mt-6 mb-2">RECORD</p>
									<p className="voice-evidence text-xs">
										<span
											className="status-mark"
											style={{
												color:
													result.m.entry.record.status === "OPEN"
														? "var(--color-status-open)"
														: result.m.entry.record.status === "BUILDING"
															? "var(--color-accent)"
															: "var(--color-status-supported)",
											}}
										>
											{result.m.entry.record.status}
										</span>
										<span className="opacity-70">&nbsp;&nbsp;{result.m.entry.record.note}</span>
									</p>
								</>
							)}

							<p className="voice-evidence text-[10px] tracking-[0.12em] uppercase opacity-50 mt-6 mb-2">EXPLORE</p>
							<div className="flex flex-wrap gap-2">
								{result.m.entry.explore.map((id) => {
									const n = node(id);
									return n.href ? (
										<Link key={id} href={n.href} className="voice-evidence text-[11px] px-3 py-1.5 border hover:opacity-100 opacity-80" style={{ borderColor: "var(--color-accent)" }}>
											{n.label} →
										</Link>
									) : (
										<span key={id} className="voice-evidence text-[11px] px-3 py-1.5 border opacity-60" style={{ borderColor: "var(--color-mist)" }}>
											{n.label}
										</span>
									);
								})}
								{result.m.entry.id === "q-what-is-container" || result.m.entry.id === "q-lyrw" ? (
									<Link href="/terminal" className="voice-evidence text-[11px] px-3 py-1.5 border" style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)" }}>
										SHOW ME — ENTER A MODEL →
									</Link>
								) : null}
							</div>
						</div>
					)}

					{result?.kind === "related" && (
						<div>
							<p className="voice-evidence text-[11px] opacity-50">NO CANONICAL ANSWER — CLOSEST MATCHES</p>
							<div className="flex flex-col gap-3 mt-4">
								{result.ms.map((m) => (
									<button key={m.entry.id} onClick={() => ask(m.entry.summary)} className="text-left voice-evidence text-xs border px-4 py-3 opacity-80 hover:opacity-100" style={{ borderColor: "var(--color-mist)" }}>
										{m.entry.summary} <span className="opacity-40">· {m.confidence.toFixed(2)}</span>
									</button>
								))}
							</div>
						</div>
					)}

					{result?.kind === "none" && (
						<p className="voice-system text-sm opacity-70 max-w-xl">
							Nothing in the snapshot answers that yet — the canonical index covers the format itself. Try one of
							the suggestions, or walk the chapters directly.
						</p>
					)}

					{result?.kind === "unsupported" && (
						<div className="border-l-2 pl-5 py-1 max-w-xl" style={{ borderColor: "var(--color-status-refuted)" }}>
							<p className="voice-evidence text-xs tracking-[0.12em] uppercase" style={{ color: "var(--color-status-refuted)" }}>
								UNSUPPORTED QUERY
							</p>
							<p className="voice-system text-sm opacity-70 mt-2">
								That operation does not exist in this universe. The query surface is read-only over a versioned
								public snapshot — there is nothing to disclose and nothing to drop.
							</p>
						</div>
					)}
				</div>

				{/* Always-present text fallback. */}
				<p className="voice-evidence text-xs opacity-40 leading-relaxed max-w-2xl mt-10">
					A deterministic query engine over graph snapshot {SNAPSHOT.id} ({SNAPSHOT.date}): natural language →
					five-word canonical form → graph path → evidence → answer. {CANON.length} canonical questions, read-only,
					no model call — the interface practises what the format preaches.
				</p>
			</div>
		</section>
	);
}
