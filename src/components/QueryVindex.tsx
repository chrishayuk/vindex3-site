"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SNAPSHOT, CANON, ENTITIES, SUGGESTIONS } from "@/data/vindexGraph";
import { resolveAndExplain, type ExplanationResponse } from "@/data/explain";
import { tick, refuse } from "@chrishayuk/hause/sound";

/**
 * ASK VINDEX3 — the natural-language projection of the graph.
 *
 * This component is only a renderer: the question goes to the
 * resolver in src/data/explain.ts, which returns a typed
 * ExplanationResponse from the graph — canonical answer, entity
 * definition, component flow, derived status report, or an honest
 * refusal when no supported subgraph exists. No model call in V1; a
 * synthesis backend can sit behind the same contract later without
 * this file changing. Deep-linkable: /ask?q=… asks on arrival, and
 * the Explorer's results link here — two entrances, one graph.
 */

export function QueryVindex({ compact = false }: { compact?: boolean }) {
	const [q, setQ] = useState("");
	const [result, setResult] = useState<{ r: ExplanationResponse; q: string } | null>(null);
	const [thinking, setThinking] = useState(false);

	const [synthesising, setSynthesising] = useState(false);

	function ask(question: string) {
		const query = question.trim();
		if (!query) return;
		setQ(query);
		setThinking(true);
		setSynthesising(false);
		setResult(null);
		// The considered pause — an instant snap reads as broken, not fast.
		setTimeout(() => {
			setThinking(false);
			const r = resolveAndExplain(query);
			if (r.answer_type === "unsupported" || r.answer_type === "refusal") refuse();
			else tick();
			setResult({ r, q: query });
			// The deterministic layers could not answer — offer the
			// question to the synthesis tier. The refusal stands until
			// (and unless) a grounded synthesis arrives; a missing tier
			// or a failed call changes nothing.
			if (r.answer_type === "refusal" || r.answer_type === "related") {
				setSynthesising(true);
				fetch("/api/explain", {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ question: query }),
					signal: AbortSignal.timeout(30000),
				})
					.then(async (res) => {
						if (!res.ok) return;
						const upgraded = (await res.json()) as ExplanationResponse;
						if (upgraded.answer_type === "synthesis") {
							tick();
							setResult({ r: upgraded, q: query });
						}
					})
					.catch(() => {})
					.finally(() => setSynthesising(false));
			}
		}, 650);
	}

	// /ask?q=… — the other entrance's door into this one.
	useEffect(() => {
		const param = new URLSearchParams(window.location.search).get("q");
		if (param) ask(param);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const r = result?.r;

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
						placeholder="what does the gate projection actually do?"
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

					{r && r.answer_type !== "unsupported" && r.answer_type !== "refusal" && r.answer_type !== "related" && (
						<div key={result!.q + r.answer_type}>
							{r.answer_type === "synthesis" && (
								<p className="voice-evidence text-[11px] opacity-50">
									<span style={{ color: "var(--color-accent)" }}>SYNTHESIS</span>
									&nbsp;&nbsp;narrated from the resolved graph facts — the model is never the authority
									&nbsp;&nbsp;·&nbsp;&nbsp;snapshot {r.snapshot}
								</p>
							)}
							{r.interpreted && (
								<p className="voice-evidence text-[11px] opacity-50">
									INTERPRETED AS&nbsp;&nbsp;<span style={{ color: "var(--color-accent)" }}>{r.interpreted}</span>
									{r.confidence !== undefined && <>&nbsp;&nbsp;·&nbsp;&nbsp;match {r.confidence.toFixed(2)}</>}
									&nbsp;&nbsp;·&nbsp;&nbsp;snapshot {r.snapshot}
								</p>
							)}
							{r.title && <p className="voice-editorial text-xl sm:text-2xl mt-5">{r.title}</p>}
							<p className="voice-system text-base sm:text-lg opacity-90 leading-relaxed max-w-2xl mt-4">{r.summary}</p>
							{r.caveats && <p className="voice-evidence text-[11px] opacity-45 max-w-2xl mt-3">{r.caveats}</p>}

							{r.rows && (
								<div className="flex flex-col mt-6 max-w-2xl">
									{r.rows.map((row, i) => (
										<div key={row.head} className="graph-pulse grid grid-cols-12 gap-3 py-3 border-t items-baseline" style={{ borderColor: "var(--color-mist)", animationDelay: `${i * 140}ms` }}>
											<p className="col-span-4 sm:col-span-3 voice-evidence text-xs" style={{ color: "var(--color-accent)" }}>{row.head}</p>
											<p className="col-span-8 sm:col-span-4 voice-evidence text-[11px] opacity-60">{row.five}</p>
											<p className="col-span-12 sm:col-span-5 voice-system text-sm opacity-85">{row.body}</p>
										</div>
									))}
								</div>
							)}

							{r.gates && (
								<div className="flex flex-col gap-2 mt-6 max-w-2xl">
									{r.gates.map((g, i) => (
										<div key={g.id} className="graph-pulse flex items-baseline gap-4" style={{ animationDelay: `${i * 90}ms` }}>
											<span className="voice-evidence text-xs w-24 shrink-0">{g.id}</span>
											<span
												className="voice-evidence text-xs w-24 shrink-0 status-mark"
												style={{
													color:
														g.status === "PASSED"
															? "var(--color-status-supported)"
															: g.status === "BUILDING"
																? "var(--color-accent)"
																: "var(--color-status-open)",
												}}
											>
												{g.status}
											</span>
											<span className="voice-system text-sm opacity-80">{g.label}
												<span className="voice-evidence text-[11px] opacity-50">&nbsp;&nbsp;{g.note}</span>
											</span>
										</div>
									))}
								</div>
							)}

							{r.evidence && r.evidence.length > 0 && (
								<>
									<p className="voice-evidence text-[10px] tracking-[0.12em] uppercase opacity-50 mt-8 mb-3">EVIDENCE — THE GRAPH PATH</p>
									<div className="flex flex-col gap-2">
										{r.evidence.map((ev, i) => (
											<div key={i} className="graph-pulse flex items-baseline gap-3 flex-wrap" style={{ animationDelay: `${i * 140}ms` }}>
												<span className="voice-evidence text-xs">{ev.from}</span>
												<span className="voice-evidence text-[10px] tracking-[0.08em] uppercase opacity-50">— {ev.rel} →</span>
												<span className="voice-evidence text-xs" style={{ color: "var(--color-accent)" }}>{ev.to}</span>
											</div>
										))}
									</div>
								</>
							)}

							{r.record && (
								<>
									<p className="voice-evidence text-[10px] tracking-[0.12em] uppercase opacity-50 mt-6 mb-2">RECORD</p>
									<p className="voice-evidence text-xs">
										<span
											className="status-mark"
											style={{
												color:
													r.record.status === "OPEN"
														? "var(--color-status-open)"
														: r.record.status === "BUILDING"
															? "var(--color-accent)"
															: "var(--color-status-supported)",
											}}
										>
											{r.record.status}
										</span>
										<span className="opacity-70">&nbsp;&nbsp;{r.record.note}</span>
									</p>
								</>
							)}

							{r.actions.length > 0 && (
								<div className="flex flex-wrap gap-2 mt-8">
									{r.actions.map((a) => (
										<Link
											key={a.href + a.label}
											href={a.href}
											className="voice-evidence text-[11px] px-3 py-1.5 border hover:opacity-100 opacity-85"
											style={{ borderColor: "var(--color-accent)", color: a.accent ? "var(--color-accent)" : undefined }}
										>
											{a.label}
										</Link>
									))}
								</div>
							)}
						</div>
					)}

					{r?.answer_type === "related" && (
						<div>
							<p className="voice-evidence text-[11px] opacity-50">NO SUPPORTED SUBGRAPH — CLOSEST CANONICAL QUESTIONS</p>
							{synthesising && <p className="voice-evidence text-xs tracking-[0.1em] uppercase opacity-40 graph-pulse mt-2">the synthesis tier is composing from the resolved facts…</p>}
							<div className="flex flex-col gap-3 mt-4">
								{r.related?.map((m) => (
									<button key={m.ask} onClick={() => ask(m.ask)} className="text-left voice-evidence text-xs border px-4 py-3 opacity-80 hover:opacity-100" style={{ borderColor: "var(--color-mist)" }}>
										{m.label}
									</button>
								))}
							</div>
						</div>
					)}

					{r?.answer_type === "refusal" && (
						<div className="border-l-2 pl-5 py-1 max-w-xl" style={{ borderColor: "var(--color-status-open)" }}>
							<p className="voice-system text-base opacity-90">{r.summary}</p>
							{synthesising && <p className="voice-evidence text-xs tracking-[0.1em] uppercase opacity-40 graph-pulse mt-2">the synthesis tier is composing from the resolved facts…</p>}
							{r.related && r.related.length > 0 && (
								<>
									<p className="voice-evidence text-[10px] tracking-[0.12em] uppercase opacity-50 mt-4 mb-2">CLOSEST EVIDENCE</p>
									<div className="flex flex-col gap-2">
										{r.related.map((m) => (
											<button key={m.ask} onClick={() => ask(m.ask)} className="text-left voice-evidence text-xs opacity-70 hover:opacity-100 w-fit border-b pb-0.5" style={{ borderColor: "var(--color-mist)" }}>
												{m.label}
											</button>
										))}
									</div>
								</>
							)}
							<p className="voice-evidence text-[11px] opacity-40 mt-4">graph snapshot {r.snapshot}</p>
						</div>
					)}

					{r?.answer_type === "unsupported" && (
						<div className="border-l-2 pl-5 py-1 max-w-xl" style={{ borderColor: "var(--color-status-refuted)" }}>
							<p className="voice-evidence text-xs tracking-[0.12em] uppercase" style={{ color: "var(--color-status-refuted)" }}>
								UNSUPPORTED QUERY
							</p>
							<p className="voice-system text-sm opacity-70 mt-2">{r.summary}</p>
						</div>
					)}
				</div>

				{/* Always-present text fallback. */}
				<p className="voice-evidence text-xs opacity-40 leading-relaxed max-w-2xl mt-10">
					A deterministic resolver over graph snapshot {SNAPSHOT.id} ({SNAPSHOT.date}): question → five-word
					canonical form → entity and status resolution → typed explanation. {CANON.length} canonical answers as the
					cache, {ENTITIES.length} graph entities behind them, the Record&apos;s gates as status nodes — and when no
					supported subgraph exists, Ask says so rather than guessing. No model call; the graph is the authority, and
					a synthesis tier can only ever narrate it.
				</p>
			</div>
		</section>
	);
}
