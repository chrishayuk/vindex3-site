"use client";

import { useState } from "react";

/**
 * REPRESENT — the instruments.
 *
 * Every number here is a recorded run against
 * Kimi-Linear-48B-A3B-Instruct (27 layers · 256 routed experts ·
 * hidden 2,304), verbatim from the banked precision-ladder records:
 * the frozen kimi-logit-v3 contract, the 8,192-position authority
 * runs, the 256-position diagnostics, and the in-session decode
 * benchmark. Nothing is illustrative except where labelled.
 */

/* ------------------------------------------------------------------
   THE TOPOLOGY TOWER — click a layer, read its evidence.
   ------------------------------------------------------------------ */

type Cell = {
	layer: number;
	rep: "BF16" | "Q8_0";
	/** Recorded evidence for this layer's routed experts, when probed. */
	q8?: { kl: string; verdict: "PASS" | "REFUSE"; scale: "8192" | "256" };
	q6?: { kl: string; verdict: "PASS" | "REFUSE"; scale: "8192" | "256" };
	note?: string;
	kda?: { kl: string; verdict: string };
};

const STRICT: Cell[] = Array.from({ length: 27 }, (_, i) => {
	const base: Cell = { layer: i, rep: i >= 24 ? "Q8_0" : "BF16" };
	const cells: Record<number, Partial<Cell>> = {
		13: { q8: { kl: "8.001e-3", verdict: "REFUSE", scale: "256" }, note: "Refused with routing consequence — the deep-middle wall." },
		16: { q8: { kl: "4.962e-3", verdict: "REFUSE", scale: "256" } },
		18: { q8: { kl: "8.906e-4", verdict: "REFUSE", scale: "256" }, note: "KL passes; refused on displaced top-10 mass alone — a single-criterion miss at the frontier." },
		19: { q8: { kl: "1.144e-3", verdict: "REFUSE", scale: "256" }, note: "Refused on KL alone, by 14%. The failure mode rotates at the edge." },
		20: { q8: { kl: "4.258e-4", verdict: "PASS", scale: "256" }, note: "Passes alone — but no admissible composed map reaches this deep. Individually safe is not safe together." },
		21: { q8: { kl: "8.988e-4", verdict: "PASS", scale: "256" } },
		22: { q8: { kl: "1.569e-4", verdict: "PASS", scale: "256" }, note: "Cheap alone; adding it to the late band cost ~6× its solo displacement. Left out of the winning map." },
		23: { q8: { kl: "7.049e-4", verdict: "PASS", scale: "256" } },
		24: { q8: { kl: "8.804e-5", verdict: "PASS", scale: "256" } },
		25: {
			q8: { kl: "1.446e-4", verdict: "PASS", scale: "8192" },
			q6: { kl: "1.078e-3", verdict: "REFUSE", scale: "8192" },
			note: "Q6_K independently exceeded the behavioural budget here. Q8_0 earned the slot at authority scale.",
		},
		26: {
			q8: { kl: "1.161e-4", verdict: "PASS", scale: "256" },
			q6: { kl: "8.530e-4", verdict: "PASS", scale: "8192" },
			note: "Q6_K passes alone — and belongs to no admissible composed map: it consumes most of the whole budget. The optimizer chose Q8_0 instead. The cheapest representation for a layer in isolation need not belong to the cheapest admissible model.",
		},
	};
	return { ...base, ...cells[i] };
});

const KDA_CELLS: Record<number, { kl: string; verdict: string }> = {
	10: { kl: "7.559e-3", verdict: "REFUSE — error accumulates across positions" },
	13: { kl: "1.485e-2", verdict: "REFUSE" },
	16: { kl: "3.982e-4", verdict: "REFUSE on displaced top-10 mass alone" },
	24: { kl: "1.541e-4", verdict: "PASS (measured as the {24,25} pair)" },
	25: { kl: "8.837e-5", verdict: "PASS — cheaper than the expert cell at the same depth" },
};

export function TopologyExplorer() {
	const [sel, setSel] = useState<number | null>(25);
	const [profile, setProfile] = useState<"strict" | "balanced">("strict");
	const cell = sel !== null ? STRICT[sel] : null;
	return (
		<section className="hause-grid py-12 sm:py-16">
			<div className="col-span-12 md:col-start-2 md:col-span-9">
				<div className="flex items-center gap-2 mb-4">
					{(["strict", "balanced"] as const).map((p) => (
						<button
							key={p}
							onClick={() => setProfile(p)}
							className="voice-evidence text-[11px] px-3 py-1.5 border uppercase tracking-[0.12em]"
							style={{
								borderColor: profile === p ? "var(--color-accent)" : "var(--color-mist)",
								opacity: profile === p ? 1 : 0.55,
							}}
						>
							{p === "strict" ? "STRICT · VERIFIED @ 8192" : "BALANCED · NOT YET CALIBRATED"}
						</button>
					))}
				</div>
				{profile === "balanced" ? (
					<div className="border p-5" style={{ borderColor: "var(--color-mist)" }}>
						<p className="voice-evidence text-xs m-0 opacity-70">
							BALANCED IS EXPERIMENTAL — the contract has not been frozen. What exists so far is its
							calibration evidence: bracket maps at 256 positions, an authority-scale refusal that
							taught the protocol (63 argmax flips invisible at diagnostic scale), and a held-out
							evaluation bank the search never touched. This panel will speak when balanced-v1 is
							earned, not before.
						</p>
					</div>
				) : (
					<>
						<p className="voice-evidence text-[10px] tracking-[0.12em] uppercase opacity-45 m-0 mb-2">
							kimi-linear-48b · routed-expert precision by layer · click a layer
						</p>
						<div className="border p-4" style={{ borderColor: "var(--color-mist)" }}>
							<div className="flex flex-col gap-[3px]">
								{STRICT.map((c) => (
									<button
										key={c.layer}
										onClick={() => setSel(c.layer)}
										className="flex items-center gap-3 text-left"
										style={{ opacity: sel === c.layer ? 1 : 0.75 }}
									>
										<span className="voice-evidence text-[10px] w-8 shrink-0 opacity-60">L{c.layer}</span>
										<span
											className="h-[10px] shrink-0"
											style={{
												width: c.rep === "BF16" ? "62%" : "33%",
												background: c.rep === "BF16" ? "var(--color-mist)" : "var(--color-accent)",
												outline: sel === c.layer ? "1px solid var(--color-accent)" : "none",
												outlineOffset: 2,
											}}
										/>
										<span className="voice-evidence text-[10px] shrink-0" style={{ color: c.rep === "BF16" ? "inherit" : "var(--color-accent)" }}>
											{c.rep}
										</span>
									</button>
								))}
							</div>
						</div>
						{cell && (
							<div className="border border-t-0 p-5" style={{ borderColor: "var(--color-mist)" }}>
								<p className="voice-evidence text-xs m-0" style={{ color: "var(--color-accent)" }}>
									LAYER {cell.layer} · ROUTED EXPERTS · {cell.rep} in the strict topology
								</p>
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
									<div>
										<p className="voice-evidence text-[10px] uppercase tracking-[0.12em] opacity-45 m-0">BF16</p>
										<p className="voice-evidence text-sm m-0 mt-1">canonical — the yardstick both arms are measured against</p>
									</div>
									<div>
										<p className="voice-evidence text-[10px] uppercase tracking-[0.12em] opacity-45 m-0">Q8_0 · KL p99 vs limit 1.000e-3</p>
										<p className="voice-evidence text-sm m-0 mt-1">
											{cell.q8 ? `${cell.q8.kl} · ${cell.q8.verdict} · ${cell.q8.scale} positions` : "not probed — no claim"}
										</p>
									</div>
									<div>
										<p className="voice-evidence text-[10px] uppercase tracking-[0.12em] opacity-45 m-0">Q6_K</p>
										<p className="voice-evidence text-sm m-0 mt-1">
											{cell.q6 ? `${cell.q6.kl} · ${cell.q6.verdict} · ${cell.q6.scale} positions` : "not probed — no claim"}
										</p>
									</div>
								</div>
								{KDA_CELLS[cell.layer] && (
									<p className="voice-evidence text-sm m-0 mt-3 opacity-80">
										KDA projections at Q8_0 (second family, same contract): {KDA_CELLS[cell.layer].kl} — {KDA_CELLS[cell.layer].verdict}.
									</p>
								)}
								{cell.note && <p className="voice-system text-sm m-0 mt-3 opacity-80 leading-relaxed">{cell.note}</p>}
							</div>
						)}
					</>
				)}
			</div>
		</section>
	);
}

/* ------------------------------------------------------------------
   COMPOSITION — individually safe is not safe together.
   ------------------------------------------------------------------ */

const MAPS = [
	{ map: "L20–25 Q8 + L26 Q6", members: "every member passes alone", kl: "2.489e-3", verdict: "FAIL" },
	{ map: "L22–25 Q8 + L26 Q6", members: "every member passes alone", kl: "1.110e-3", verdict: "FAIL" },
	{ map: "L22,24,25,26 Q8", members: "member sum 5.9e-4 — composed is 1.9× larger", kl: "1.124e-3", verdict: "FAIL" },
	{ map: "L24–26 Q8", members: "the surviving map", kl: "4.153e-4 @ 8192", verdict: "PASS" },
] as const;

export function CompositionFigure() {
	return (
		<section className="hause-grid py-12 sm:py-16">
			<div className="col-span-12 md:col-start-3 md:col-span-8">
				<div className="border p-6" style={{ borderColor: "var(--color-mist)" }}>
					<p className="voice-evidence text-xs m-0" style={{ color: "var(--color-accent)" }}>
						FOUR COMPOSED MAPS · ONE FROZEN CONTRACT · RECORDED
					</p>
					<div className="mt-4 flex flex-col gap-3">
						{MAPS.map((m) => (
							<div key={m.map} className="grid grid-cols-12 gap-2 items-baseline">
								<span className="voice-evidence text-sm col-span-5">{m.map}</span>
								<span className="voice-system text-xs col-span-4 opacity-60">{m.members}</span>
								<span className="voice-evidence text-xs col-span-2">{m.kl}</span>
								<span
									className="voice-evidence text-xs col-span-1 text-right"
									style={{ color: m.verdict === "PASS" ? "var(--color-accent)" : "var(--color-status-refuted)" }}
								>
									{m.verdict}
								</span>
							</div>
						))}
					</div>
					<p className="voice-system text-sm m-0 mt-5 opacity-80 leading-relaxed">
						The composition factor is not a constant: measured ratios of composed to summed displacement
						ran 0.52, 0.55, 0.77, 0.88 — and 1.90, super-additive, on the third map above. No scalar
						correction ranks maps. The interaction is structural: a substitution&apos;s error cascades through
						every later routing decision, so the same layer costs ~6× more inside the wrong company, and
						the last routed layer composes nearly free because nothing downstream can amplify it.
					</p>
				</div>
			</div>
		</section>
	);
}

/* ------------------------------------------------------------------
   THE DECODE LEDGER — where the bytes actually go, per token.
   ------------------------------------------------------------------ */

const LEDGER = [
	{ name: "routed experts (26 layers)", mb: 2944, pct: 47.4, opened: "opened — strict map earned at 8,192 positions" },
	{ name: "KDA projections (20 layers)", mb: 1575, pct: 25.4, opened: "opened — cross-family map earned at 8,192 positions" },
	{ name: "lm_head", mb: 755, pct: 12.2, opened: "next" },
	{ name: "MLA attention (7 layers)", mb: 408, pct: 6.6, opened: "next" },
	{ name: "shared experts", mb: 368, pct: 5.9, opened: "next" },
	{ name: "dense MLP + routers", mb: 158, pct: 2.6, opened: "—" },
] as const;

export function LedgerFigure() {
	return (
		<section className="hause-grid py-12 sm:py-16">
			<div className="col-span-12 md:col-start-3 md:col-span-8">
				<div className="border p-6" style={{ borderColor: "var(--color-mist)" }}>
					<p className="voice-evidence text-xs m-0" style={{ color: "var(--color-accent)" }}>
						DECODE BYTES PER TOKEN · KIMI-LINEAR-48B · BF16 · 6,209 MB TOTAL
					</p>
					<div className="mt-4 flex flex-col gap-2">
						{LEDGER.map((r) => (
							<div key={r.name}>
								<div className="flex justify-between items-baseline">
									<span className="voice-evidence text-xs">{r.name}</span>
									<span className="voice-evidence text-xs opacity-70">
										{r.mb.toLocaleString()} MB · {r.pct}%
									</span>
								</div>
								<div className="h-[8px] mt-1" style={{ background: "var(--color-mist)", width: "100%" }}>
									<div className="h-full" style={{ width: `${r.pct * 2}%`, background: "var(--color-accent)", opacity: r.opened.startsWith("opened") ? 1 : 0.35 }} />
								</div>
								<p className="voice-evidence text-[10px] uppercase tracking-[0.12em] m-0 mt-0.5 opacity-45">{r.opened}</p>
							</div>
						))}
					</div>
					<p className="voice-system text-sm m-0 mt-5 opacity-80 leading-relaxed">
						This ledger is calibrated, not hypothetical: the earned map removes ~3.7% of decode traffic
						and measured a 3.2–3.7% GPU-time reduction beside its own in-session baseline — bytes convert
						to time at the predicted rate, across both families opened so far. The route to large decode
						gains runs through every row of this table at once. REPRESENT optimizes all of them together.
					</p>
				</div>
			</div>
		</section>
	);
}
