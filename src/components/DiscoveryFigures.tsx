"use client";

import { useEffect, useState } from "react";
import { hatch, reducedMotion, useInView } from "@chrishayuk/hause/figure";
import { tick } from "@chrishayuk/hause/sound";

/**
 * DISCOVERING THE MAP — the instruments.
 *
 * Every number is a recorded run of the SENSITIVITY programme against
 * granite-4.1-3b, verbatim from the banked records — the same runs the
 * quantization video performs. The four screens are shown exactly as
 * they scored, including the one that almost worked.
 */


/* ------------------------------------------------------------------
   THE BAR — frozen before any score existed.
   ------------------------------------------------------------------ */

export function TheBar() {
	return (
		<section className="hause-grid py-10">
			<div className="col-span-12 md:col-start-3 md:col-span-8">
				<div className="border p-6" style={{ borderColor: "var(--color-accent)" }}>
					<p className="voice-evidence text-[10px] tracking-[0.14em] uppercase opacity-50 m-0 mb-4">
						THE BAR — FROZEN BEFORE ANY SCORE EXISTED
					</p>
					<p className="voice-system text-sm sm:text-base m-0 leading-relaxed">
						1. It identifies late-FFN as the highest-return region.
						<br />
						2. It rejects v_proj, k_proj and down_proj as low-value.
					</p>
					<p className="voice-evidence text-xs mt-4 m-0" style={{ color: "var(--color-accent)" }}>
						Both, or it is not a predictor.
					</p>
					<p className="voice-system text-sm opacity-60 m-0 mt-3 leading-relaxed">
						The second half is the trap. A screen that merely learns &ldquo;protecting more bytes helps&rdquo;
						would be true, useless, and would pass any correlation test — the three frozen negatives are what it
						has to avoid.
					</p>
				</div>
			</div>
		</section>
	);
}

/* ------------------------------------------------------------------
   THE FOUR SCREENS — each as it scored.
   ------------------------------------------------------------------ */

const SCREENS: {
	n: string;
	name: string;
	idea: string;
	rho: string;
	verdict: "FAIL" | "ALMOST" | "WRONG ALGORITHM";
	why: string;
}[] = [
	{
		n: "01",
		name: "LOOK AT THE WEIGHTS",
		idea: "SENSITIVITY-1A — how far does each tensor move when quantized? No forward pass, just arithmetic on weights. 280 tensors in 19 seconds.",
		rho: "ρ = −0.313",
		verdict: "FAIL",
		why: "Every projection quantizes to within about one percent of the same relative error — that is what a fixed relative grid is. The numerator barely varies, so a per-byte score collapses into ranking by inverse size: the two frozen negatives come first and second, the measured knee ninth of thirteen. Weight geometry alone carries no semantic signal.",
	},
	{
		n: "02",
		name: "WEIGHT BY THE ACTIVATIONS",
		idea: "SENSITIVITY-1B — capture what the model actually feeds each tensor and score the relative output error ‖XW − X·Q(W)‖² / ‖XW‖².",
		rho: "ρ = −0.524",
		verdict: "FAIL",
		why: "It got worse — and the diagnosis is the denominator, not the activations. Dividing by the operand's own output rewards operands whose output is small, exactly the way 1A's ‖W‖² rewarded small weights. The activation weighting supplied the missing factor; the normalisation removed it again.",
	},
	{
		n: "03",
		name: "MEASURE LOCAL CONSEQUENCE",
		idea: "SENSITIVITY-1B′ — drop the denominator, score the absolute consequence Σ d_j · ‖ΔW[:,j]‖², pre-registered before a single number was computed.",
		rho: "ρ = +0.595",
		verdict: "ALMOST",
		why: "So much came right: late5-ffn rank one, v and k fell to seventh and eighth, the knee recovered (ρ 77 against a truth of 169). And it still fails on exactly one tensor — down_proj carries the largest local consequence in the model by twenty times, the screen says protect it, and the bank already showed that costs a gigabyte and makes the tail worse.",
	},
	{
		n: "04",
		name: "RUN THE CONSEQUENCE FORWARD",
		idea: "SENSITIVITY-1C — perturb the residual by the exact quantization error and execute the remaining layers. Mathematically, the correct thing to want.",
		rho: "80.8× candidate-equivalents",
		verdict: "WRONG ALGORITHM",
		why: "It cannot be batched — the executor's row axis is the causal position axis, so packed directions would attend to each other. And the economics are not close: eighty candidate-equivalents against fifteen for the entire ground-truth sweep. The cheap screen costs five times more than measuring the answer. Correct mathematics, wrong algorithm.",
	},
];

export function ScreenLadder() {
	const { ref, inView } = useInView();
	const [open, setOpen] = useState<number | null>(2);
	return (
		<section className="hause-grid py-12 sm:py-16">
			<div ref={ref} className="col-span-12 md:col-start-2 md:col-span-10 flex flex-col gap-3">
				{SCREENS.map((s, i) => {
					const isOpen = open === i;
					const color =
						s.verdict === "ALMOST" ? "var(--color-accent)" : "var(--color-status-refuted)";
					return (
						<button
							key={s.n}
							aria-expanded={isOpen}
							onClick={() => {
								tick();
								setOpen(isOpen ? null : i);
							}}
							className={inView ? "graph-pulse border p-5 text-left" : "border p-5 text-left"}
							style={{ borderColor: isOpen ? color : "var(--color-mist)", animationDelay: `${i * 120}ms`, background: "var(--bg)" }}
						>
							<div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
								<span className="voice-evidence text-xs opacity-45">{s.n}</span>
								<span className="voice-evidence text-sm tracking-[0.08em]">{s.name}</span>
								<span className="voice-evidence text-xs ml-auto" style={{ color }}>
									{s.rho} · {s.verdict}
								</span>
							</div>
							{isOpen && (
								<div className="mt-4">
									<p className="voice-system text-sm opacity-70 leading-relaxed m-0">{s.idea}</p>
									<p className="voice-system text-sm leading-relaxed m-0 mt-3 opacity-90">{s.why}</p>
								</div>
							)}
						</button>
					);
				})}
				<p className="voice-evidence text-[10px] opacity-45 m-0 mt-1">
					recorded — granite-4.1-3b · SENSITIVITY-1A/1B/1B′/1C vs the banked Q-BANK sweep · tap a screen
				</p>
			</div>
		</section>
	);
}

/* ------------------------------------------------------------------
   THE COUNTEREXAMPLE — local consequence, per projection.
   ------------------------------------------------------------------ */

const CONSEQUENCE: { name: string; value: number }[] = [
	{ name: "down_proj", value: 4098.2 },
	{ name: "q_proj", value: 197.7 },
	{ name: "up_proj", value: 131.5 },
	{ name: "gate_proj", value: 106.2 },
	{ name: "k_proj", value: 49.9 },
	{ name: "v_proj", value: 30.7 },
];

export function CounterexampleFigure() {
	const { ref, inView } = useInView();
	const max = CONSEQUENCE[0].value;
	return (
		<section className="hause-grid py-12 sm:py-16">
			<div ref={ref} className="col-span-12 md:col-start-3 md:col-span-8">
				<p className="voice-evidence text-[11px] tracking-[0.12em] uppercase opacity-50 mb-4">
					MEAN LOCAL CONSEQUENCE, PER PROJECTION — RECORDED · GRANITE-4.1-3B
				</p>
				<div className="flex flex-col gap-2">
					{CONSEQUENCE.map((c, i) => (
						<div key={c.name} className="grid grid-cols-[6.5rem_1fr_4.5rem] gap-3 items-center">
							<span className="voice-evidence text-[11px]" style={{ color: i === 0 ? "var(--color-status-refuted)" : undefined }}>
								{c.name}
							</span>
							<div className="h-3 border" style={{ borderColor: "var(--color-mist)" }}>
								<div
									className="h-full"
									style={{
										width: inView ? `${Math.max(1.2, (c.value / max) * 100)}%` : "0%",
										transition: `width 900ms var(--ease-hause) ${i * 90}ms`,
										backgroundImage: hatch(i === 0 ? "var(--color-status-refuted)" : "var(--color-accent)"),
									}}
								/>
							</div>
							<span className="voice-evidence text-[11px] text-right opacity-70">{c.value.toLocaleString()}</span>
						</div>
					))}
				</div>
				<p className="voice-evidence text-xs mt-4 m-0" style={{ color: "var(--color-status-refuted)" }}>
					the screen says: protect down_proj. the bank already measured that: +1,150 MiB, and the tail gets worse.
				</p>
				<p className="voice-system text-sm opacity-70 leading-relaxed max-w-2xl mt-4 m-0">
					This is not noise — it is a screen being confidently wrong for a structural reason. Local consequence
					measures where quantization error <em>is large</em>. It does not measure whether the model&apos;s output
					is <em>sensitive</em> to error there. The difference is not local, and the next figure is why.
				</p>
			</div>
		</section>
	);
}

/* ------------------------------------------------------------------
   THE RESIDUAL STREAM — why placement beats magnitude.
   ------------------------------------------------------------------ */

export function ResidualWhyFigure() {
	const { ref, inView } = useInView();
	const [phase, setPhase] = useState<0 | 1 | 2>(0);
	useEffect(() => {
		if (!inView || reducedMotion()) return;
		const t1 = setTimeout(() => setPhase(1), 900);
		const t2 = setTimeout(() => setPhase(2), 2400);
		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
		};
	}, [inView]);
	const lit = (want: number) => (reducedMotion() || phase >= want ? 1 : 0.25);
	return (
		<section className="hause-grid py-12 sm:py-16">
			<div ref={ref} className="col-span-12 md:col-start-2 md:col-span-10">
				<p className="voice-evidence text-[11px] tracking-[0.12em] uppercase opacity-50 mb-6">
					WHY: TWO ERRORS, TWO FATES — THE RESIDUAL STREAM
				</p>
				<div className="border p-5 sm:p-8 overflow-x-auto" style={{ borderColor: "var(--color-mist)", background: "var(--bg)" }}>
					<div className="min-w-[560px]">
						{/* The stream */}
						<div className="flex items-center gap-3">
							<span className="voice-evidence text-[11px] opacity-70 shrink-0">residual stream</span>
							<div className="h-4 flex-1" style={{ backgroundImage: hatch("var(--color-accent)", 5) }} />
							<span
								className="voice-evidence text-lg"
								style={{ color: "var(--color-accent)", opacity: lit(2), transition: "opacity 600ms var(--ease-hause)" }}
							>
								⊕
							</span>
							<div className="h-4 w-16" style={{ backgroundImage: hatch("var(--color-accent)", 5) }} />
							<span className="voice-evidence text-[11px] opacity-50">…</span>
						</div>
						{/* The branch */}
						<div className="grid grid-cols-[7rem_1fr_1fr] gap-x-4 mt-6 items-start">
							<div />
							<div
								className="border p-3"
								style={{
									borderColor: phase >= 1 && phase < 2 ? "var(--color-status-refuted)" : "var(--color-mist)",
									opacity: lit(1),
									transition: "all 600ms var(--ease-hause)",
								}}
							>
								<p className="voice-evidence text-[11px] m-0">gate → SiLU · up → ⊗</p>
								<p className="voice-evidence text-[10px] m-0 mt-2" style={{ color: "var(--color-status-refuted)" }}>
									an error HERE crosses a nonlinearity
								</p>
								<p className="voice-system text-xs opacity-70 m-0 mt-1 leading-relaxed">
									— it changes <em>what the network computes</em>. Small error, large meaning.
								</p>
							</div>
							<div
								className="border p-3"
								style={{
									borderColor: phase >= 2 ? "var(--color-accent)" : "var(--color-mist)",
									opacity: lit(2),
									transition: "all 600ms var(--ease-hause)",
								}}
							>
								<p className="voice-evidence text-[11px] m-0">down → ⊕ into the stream</p>
								<p className="voice-evidence text-[10px] m-0 mt-2" style={{ color: "var(--color-accent)" }}>
									an error HERE joins a much larger signal
								</p>
								<p className="voice-system text-xs opacity-70 m-0 mt-1 leading-relaxed">
									— added to what was already computed, and the layers downstream mostly absorb it. Large error,
									small meaning.
								</p>
							</div>
						</div>
					</div>
				</div>
				<p className="voice-system text-sm sm:text-base opacity-80 leading-relaxed max-w-2xl mt-6 m-0">
					down_proj writes <em>into</em> the residual stream: its error, however large, nudges what has already
					been computed. An error in gate or up goes somewhere else entirely — through a nonlinearity, where it
					changes what gets computed at all. A local score cannot tell those apart,{" "}
					<strong>because the difference isn&apos;t local</strong>.
				</p>
			</div>
		</section>
	);
}
