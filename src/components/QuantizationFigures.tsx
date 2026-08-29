"use client";

import { useEffect, useRef, useState } from "react";
import { tick } from "@chrishayuk/hause/sound";
import { DOWN_PROJ_8 as WEIGHTS8, DOWN_PROJ_COLLAPSED as COLLAPSED } from "@/data/recordedRuns";

/**
 * QUANTIZATION — the instruments.
 *
 * Every number here is a recorded run against granite-4.1-3b (40
 * layers · hidden 2,560 · vocab 100,352), verbatim from the banked
 * quality-bank-1 records — the same runs the quantization video
 * performs on camera. Nothing is illustrative except where labelled;
 * the snapping values, the error columns, the precision map, and the
 * destroyed distribution are the actual outputs.
 */

const hatch = (color: string, pitch = 4) =>
	`repeating-linear-gradient(45deg, ${color} 0, ${color} 1px, transparent 1px, transparent ${pitch}px)`;

function reducedMotion() {
	return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function useInView(threshold = 0.35) {
	const ref = useRef<HTMLDivElement>(null);
	const [inView, setInView] = useState(false);
	useEffect(() => {
		if (reducedMotion()) {
			setInView(true);
			return;
		}
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					observer.disconnect();
					setInView(true);
				}
			},
			{ threshold }
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [threshold]);
	return { ref, inView };
}

/* ------------------------------------------------------------------
   THE TENSOR — what a model actually is, at one address.
   ------------------------------------------------------------------ */

const f6 = (v: number) => (v >= 0 ? "+" : "") + v.toFixed(6);

export function TensorOpen() {
	const { ref, inView } = useInView();
	return (
		<section className="hause-grid py-12 sm:py-16">
			<div ref={ref} className="col-span-12 md:col-start-3 md:col-span-8">
				<div className="border p-6" style={{ borderColor: "var(--color-mist)" }}>
					<p className="voice-evidence text-xs m-0" style={{ color: "var(--color-accent)" }}>
						layer.0.mlp.down_proj · granite-4.1-3b
					</p>
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
						{[
							["shape", "2,560 × 8,192"],
							["weights", "20,971,520"],
							["dtype", "BF16 · 16 bits each"],
							["stored", "41,943,040 bytes"],
						].map(([k, v]) => (
							<div key={k}>
								<p className="voice-evidence text-[10px] tracking-[0.12em] uppercase opacity-45 m-0">{k}</p>
								<p className="voice-evidence text-sm m-0 mt-1">{v}</p>
							</div>
						))}
					</div>
					<p className="voice-evidence text-[10px] tracking-[0.12em] uppercase opacity-45 m-0 mt-6 mb-2">
						the first eight weights of row zero — real values
					</p>
					<div className="flex flex-wrap gap-2">
						{WEIGHTS8.map((w, i) => (
							<span
								key={i}
								className={inView ? "graph-pulse voice-evidence text-[12px] border px-2.5 py-1.5" : "voice-evidence text-[12px] border px-2.5 py-1.5"}
								style={{ borderColor: "var(--color-mist)", animationDelay: `${i * 90}ms` }}
							>
								{f6(w.original)}
							</span>
						))}
					</div>
				</div>
				<p className="voice-system text-sm sm:text-base opacity-70 leading-relaxed max-w-2xl mt-6">
					Twenty-one million numbers in this one tensor; two hundred and eighty tensors like it in the model.
					Notice how tiny they are: BF16 can represent values up to about 10³⁸, and these live in hundredths —
					sixteen bits each, spent on a very narrow band. So: keep the position on the number line, discard the
					precision.
				</p>
			</div>
		</section>
	);
}

/* ------------------------------------------------------------------
   THE SWITCHER — one identity, physical representations chosen.
   Values shown only where a recorded run produced them.
   ------------------------------------------------------------------ */
const REPS: {
	id: string;
	card: [string, string][];
	real: boolean;
}[] = [
	{
		id: "BF16",
		real: true,
		card: [
			["nominal", "16 bits"],
			["effective", "16.0000 bits / weight"],
			["number system", "floating point"],
			["lossy", "no — the canonical bytes"],
			["stored", "41,943,040 bytes"],
		],
	},
	{
		id: "NVFP4",
		real: true,
		card: [
			["nominal", "4 bits"],
			["effective", "4.5000 bits / weight"],
			["scale granularity", "16 weights share one E4M3 scale"],
			["number system", "floating point (E2M1)"],
			["lossy", "yes — deliberately, permanently"],
			["stored", "11,796,484 bytes · 3.56× smaller"],
		],
	},
	{
		id: "INT8",
		real: false,
		card: [
			["nominal", "8 bits"],
			["effective", "scheme-dependent — scales and zero points are never free"],
			["number system", "integers on a linear grid"],
			["lossy", "yes"],
			["stored", "card only — this artifact carries BF16 and NVFP4"],
		],
	},
	{
		id: "FP8",
		real: false,
		card: [
			["nominal", "8 bits"],
			["effective", "scheme-dependent"],
			["number system", "floating point (E4M3 / E5M2)"],
			["lossy", "yes"],
			["stored", "card only — this artifact carries BF16 and NVFP4"],
		],
	},
];

export function RepresentationSwitcher() {
	const { ref, inView } = useInView();
	const [rep, setRep] = useState("NVFP4");
	const current = REPS.find((r) => r.id === rep)!;
	return (
		<section className="hause-grid py-12 sm:py-16">
			<div ref={ref} className="col-span-12 md:col-start-3 md:col-span-8">
				<p className="voice-evidence text-[11px] tracking-[0.12em] uppercase opacity-50 mb-4">
					THE SAME WEIGHTS — SELECT A REPRESENTATION
				</p>
				<div className="flex flex-wrap gap-2 mb-6">
					{REPS.map((r) => (
						<button
							key={r.id}
							onClick={() => {
								tick();
								setRep(r.id);
							}}
							className="voice-evidence text-xs px-4 py-2 border"
							style={{
								borderColor: rep === r.id ? "var(--color-accent)" : "var(--color-mist)",
								color: rep === r.id ? "var(--color-accent)" : undefined,
								opacity: rep === r.id ? 1 : 0.6,
							}}
						>
							{r.id}
						</button>
					))}
				</div>

				<div key={rep} className="graph-pulse border p-5 sm:p-6" style={{ borderColor: "var(--color-mist)", background: "var(--bg)" }}>
					{current.real ? (
						<>
							<div className="grid grid-cols-3 gap-3 voice-evidence text-[10px] tracking-[0.1em] uppercase opacity-45 pb-2 border-b" style={{ borderColor: "var(--color-mist)" }}>
								<span>original</span>
								<span>reconstructed</span>
								<span>error</span>
							</div>
							{WEIGHTS8.map((w, i) => {
								const rec = rep === "BF16" ? w.original : w.nvfp4;
								const err = rec - w.original;
								const collapsed = rep === "NVFP4" && COLLAPSED.has(i);
								return (
									<div
										key={i}
										className="grid grid-cols-3 gap-3 voice-evidence text-[12px] py-1"
										style={{ color: collapsed ? "var(--color-accent)" : "var(--fg)" }}
									>
										<span>{f6(w.original)}</span>
										<span style={{ transition: "color var(--motion-considered) var(--ease-hause)" }}>{f6(rec)}</span>
										<span className="opacity-60">{rep === "BF16" ? "±0.000000" : f6(err)}</span>
									</div>
								);
							})}
							{rep === "NVFP4" && (
								<p className="voice-evidence text-[11px] mt-3 mb-0" style={{ color: "var(--color-accent)" }}>
									three different inputs, one output — the highlighted rows all land on −0.002106
								</p>
							)}
							{rep === "NVFP4" && (
								<p className="voice-evidence text-[10px] opacity-45 mt-2 mb-0">
									over all 20,971,520 weights: rms error 0.00148137 · max 0.01741537 · first group of 16 holds 8 distinct values
								</p>
							)}
						</>
					) : (
						<p className="voice-system text-sm opacity-70 m-0 max-w-xl">
							Shown as a specification card only: this page refuses to invent reconstructed values no recorded run
							produced. The artifact beside it physically carries BF16 and NVFP4 — selection, not conversion.
						</p>
					)}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-5 pt-4 border-t" style={{ borderColor: "var(--color-mist)" }}>
						{current.card.map(([k, v]) => (
							<div key={k} className="flex gap-3 items-baseline">
								<span className="voice-evidence text-[10px] tracking-[0.1em] uppercase opacity-45 w-32 shrink-0">{k}</span>
								<span className="voice-evidence text-[12px] opacity-85">{v}</span>
							</div>
						))}
						<div className="flex gap-3 items-baseline">
							<span className="voice-evidence text-[10px] tracking-[0.1em] uppercase opacity-45 w-32 shrink-0">identity</span>
							<span className="voice-evidence text-[12px]" style={{ color: "var(--color-accent)" }}>
								layer.0.mlp.down_proj — unchanged, in every representation
							</span>
						</div>
					</div>
				</div>
				<p className="voice-system text-sm opacity-70 leading-relaxed max-w-2xl mt-6">
					The semantic component never changes. Its physical representation does — encoding, grouping, scales,
					error, and effective bits per weight all move together. That distinction is the whole page.
				</p>
			</div>
		</section>
	);
}

/* ------------------------------------------------------------------
   FOUR BIT ISN'T FOUR BIT — the arithmetic, staged.
   ------------------------------------------------------------------ */
export function BitsArithmetic() {
	const { ref, inView } = useInView();
	const rows = [
		{ label: "16 weights", value: "each picks a slot on the shared scale", dim: false },
		{ label: "the E2M1 alphabet", value: "0 · ±0.5 · ±1 · ±1.5 · ±2 · ±3 · ±4 · ±6", dim: true },
		{ label: "16 × 4-bit codes", value: "64 bits" },
		{ label: "+ one E4M3 scale", value: "8 bits" },
		{ label: "= 72 bits / 16 weights", value: "4.5 bits per weight", accent: true },
	];
	return (
		<section className="hause-grid py-12 sm:py-16">
			<div ref={ref} className="col-span-12 md:col-start-3 md:col-span-8">
				<div className="border p-6 max-w-2xl" style={{ borderColor: "var(--color-mist)" }}>
					{rows.map((r, i) => (
						<div
							key={r.label}
							className={inView ? "graph-pulse flex flex-wrap justify-between gap-3 py-2 border-t first:border-t-0" : "flex flex-wrap justify-between gap-3 py-2 border-t first:border-t-0"}
							style={{ borderColor: "var(--color-mist)", animationDelay: `${i * 220}ms`, opacity: r.dim ? 0.55 : 1 }}
						>
							<span className="voice-evidence text-[12px]" style={{ color: r.accent ? "var(--color-accent)" : "var(--fg)" }}>
								{r.label}
							</span>
							<span className="voice-evidence text-[12px]" style={{ color: r.accent ? "var(--color-accent)" : "var(--fg)" }}>
								{r.value}
							</span>
						</div>
					))}
				</div>
				<p className="voice-system text-sm sm:text-base opacity-70 leading-relaxed max-w-2xl mt-6">
					A four-bit model is never four bits, because the scales are not free. Sixteen weights share one scale,
					each picks one of sixteen slots on it — and the honest rate is four and a half.
				</p>
			</div>
		</section>
	);
}

/* ------------------------------------------------------------------
   THE COLLAPSE — information deliberately discarded, on a number line.
   ------------------------------------------------------------------ */
const LINE_MIN = -0.0035;
const LINE_MAX = -0.0005;
const pos = (v: number) => ((v - LINE_MIN) / (LINE_MAX - LINE_MIN)) * 100;
const TRIO = [-0.00296, -0.002914, -0.001228];
const TARGET = -0.002106;

export function CollapseFigure() {
	const { ref, inView } = useInView();
	const [snapped, setSnapped] = useState(false);
	useEffect(() => {
		if (!inView) return;
		if (reducedMotion()) {
			setSnapped(true);
			return;
		}
		const t = setTimeout(() => setSnapped(true), 1400);
		return () => clearTimeout(t);
	}, [inView]);
	return (
		<section className="hause-grid py-12 sm:py-16">
			<div ref={ref} className="col-span-12 md:col-start-3 md:col-span-8">
				<p className="voice-evidence text-[11px] tracking-[0.12em] uppercase opacity-50 mb-8">
					THREE NUMBERS ENTER · ONE NUMBER LEAVES
				</p>
				<div className="relative max-w-2xl" style={{ height: 110 }} aria-hidden="true">
					<div className="absolute left-0 right-0 border-t" style={{ top: 70, borderColor: "var(--color-mist)" }} />
					<span className="voice-evidence text-[10px] opacity-40 absolute" style={{ top: 78, left: 0 }}>{LINE_MIN}</span>
					<span className="voice-evidence text-[10px] opacity-40 absolute" style={{ top: 78, right: 0 }}>{LINE_MAX}</span>
					{/* the representable slot */}
					<div className="absolute" style={{ left: `${pos(TARGET)}%`, top: 58 }}>
						<div style={{ width: 2, height: 24, background: "var(--color-accent)" }} />
					</div>
					<span
						className="voice-evidence text-[11px] absolute"
						style={{ left: `${pos(TARGET)}%`, top: 90, transform: "translateX(-50%)", color: "var(--color-accent)" }}
					>
						−0.002106 — the nearest representable slot
					</span>
					{TRIO.map((v, i) => (
						<div key={i}>
							<div
								className="absolute rounded-full"
								style={{
									width: 10,
									height: 10,
									top: 64,
									left: `calc(${pos(snapped ? TARGET : v)}% - 5px)`,
									background: snapped ? "var(--color-accent)" : "var(--fg)",
									transition: "left var(--motion-cinematic) var(--ease-hause), background var(--motion-considered) var(--ease-hause)",
								}}
							/>
							<span
								className="voice-evidence text-[10px] absolute"
								style={{
									top: 8 + i * 16,
									left: `${pos(v)}%`,
									transform: "translateX(-50%)",
									opacity: snapped ? 0.25 : 0.8,
									transition: "opacity var(--motion-cinematic) var(--ease-hause)",
								}}
							>
								{f6(v)}
							</span>
						</div>
					))}
				</div>
				<button
					onClick={() => {
						tick();
						setSnapped(false);
						setTimeout(() => setSnapped(true), 700);
					}}
					className="voice-evidence text-[11px] px-3 py-1.5 border opacity-70 hover:opacity-100 mt-4"
					style={{ borderColor: "var(--color-mist)" }}
				>
					REPLAY
				</button>
				<p className="voice-system text-sm sm:text-base opacity-70 leading-relaxed max-w-2xl mt-6">
					Three different numbers go in. All three come out as −0.002106 — they landed in the same slot, and
					nothing anywhere can tell them apart again. That is not compression: compression gives your bytes back.
					This information is gone — deliberately, permanently — and the format&apos;s job is to keep the choice
					honest: the lossy copy lives beside the canonical bytes as a named variant with recorded fidelity, never
					in their place.
				</p>
			</div>
		</section>
	);
}

/* ------------------------------------------------------------------
   THE PRECISION MAP — the object the argument is about.
   ------------------------------------------------------------------ */
export function PrecisionMapFigure() {
	const { ref, inView } = useInView();
	const [mixed, setMixed] = useState(false);
	useEffect(() => {
		if (!inView) return;
		if (reducedMotion()) {
			setMixed(true);
			return;
		}
		const t = setTimeout(() => setMixed(true), 1600);
		return () => clearTimeout(t);
	}, [inView]);
	const OPERANDS = ["mlp.down", "mlp.gate", "mlp.up", "attn.k", "attn.o", "attn.q", "attn.v"];
	const bandRows = [
		{ label: "0–34", protectedMlp: false },
		{ label: "35–39", protectedMlp: true },
	];
	return (
		<section className="hause-grid py-12 sm:py-16">
			<div ref={ref} className="col-span-12 md:col-start-2 md:col-span-10 lg:col-span-9">
				<div className="flex flex-wrap gap-2 mb-6">
					{[
						{ label: "UNIFORM NVFP4", value: false },
						{ label: "THE PRECISION MAP", value: true },
					].map((b) => (
						<button
							key={b.label}
							onClick={() => {
								tick();
								setMixed(b.value);
							}}
							className="voice-evidence text-xs px-4 py-2 border"
							style={{
								borderColor: mixed === b.value ? "var(--color-accent)" : "var(--color-mist)",
								color: mixed === b.value ? "var(--color-accent)" : undefined,
								opacity: mixed === b.value ? 1 : 0.6,
							}}
						>
							{b.label}
						</button>
					))}
				</div>
				<div className="border p-4 sm:p-6 overflow-x-auto" style={{ borderColor: "var(--color-mist)" }}>
					<div className="grid gap-2 voice-evidence text-[10px] tracking-[0.08em] uppercase opacity-45 mb-2" style={{ gridTemplateColumns: "4rem repeat(7, minmax(3.2rem, 1fr))" }}>
						<span>layer</span>
						{OPERANDS.map((o) => (
							<span key={o}>{o}</span>
						))}
					</div>
					{bandRows.map((band) => (
						<div key={band.label} className="grid gap-2 items-center py-2 border-t" style={{ gridTemplateColumns: "4rem repeat(7, minmax(3.2rem, 1fr))", borderColor: "var(--color-mist)" }}>
							<span className="voice-evidence text-[11px] opacity-60">{band.label}</span>
							{OPERANDS.map((o) => {
								const protectedCell = mixed && band.protectedMlp && o.startsWith("mlp");
								return (
									<div key={o} className="flex flex-col gap-1">
										<div
											style={{
												height: 14,
												width: protectedCell ? "100%" : "34%",
												backgroundImage: hatch("var(--color-accent)", protectedCell ? 3 : 5),
												opacity: protectedCell ? 0.95 : 0.55,
												border: "1px solid var(--color-mist)",
												transition: "width var(--motion-cinematic) var(--ease-hause), opacity var(--motion-considered) var(--ease-hause)",
											}}
										/>
										<span className="voice-evidence text-[10px] opacity-55">{protectedCell ? "16.00" : "4.50"}</span>
									</div>
								);
							})}
						</div>
					))}
					<div className="flex flex-wrap gap-x-8 gap-y-1 mt-4 pt-3 border-t" style={{ borderColor: "var(--color-mist)" }}>
						<span className="voice-evidence text-[11px] opacity-60">stored 2,221,671,460 bytes (2.069 GiB)</span>
						<span className="voice-evidence text-[11px] opacity-60">weights 3,145,728,000</span>
						<span className="voice-evidence text-[12px]" style={{ color: "var(--color-accent)" }}>
							effective {mixed ? "5.6500" : "4.5000"} bits / weight
						</span>
					</div>
				</div>
				<p className="voice-system text-sm sm:text-base opacity-70 leading-relaxed max-w-2xl mt-6">
					This is the object the whole argument is about. Not &ldquo;the model is four-bit&rdquo; — a program:
					these tensors at four and a half bits, those fifteen at sixteen, effective rate 5.65 — and it is a
					physical fact inside the file, not a flag passed at load time. Execution honours it: ask for the
					all-NVFP4 backend and sixteen tensors run at higher precision anyway, because the pack says so.
				</p>
				<p className="voice-evidence text-xs opacity-45 leading-relaxed max-w-2xl mt-3">
					recorded · granite-4.1-3b: uniform ≈116 tok/s · this map ≈104 tok/s · +400 MB · 3.5× better in the tail.
					Three axes, not one.
				</p>
			</div>
		</section>
	);
}

/* ------------------------------------------------------------------
   SAME ANSWER, DIFFERENT MODEL — never judge by the token.
   ------------------------------------------------------------------ */
const DIST_REF = [
	{ tok: "' Paris'", p: 55.775 },
	{ tok: "' ______'", p: 3.101 },
	{ tok: "' a'", p: 2.501 },
	{ tok: "' called'", p: 2.469 },
	{ tok: "'?\\n\\n'", p: 1.88 },
];

export function DistributionFigure() {
	const { ref, inView } = useInView();
	const [broken, setBroken] = useState(false);
	useEffect(() => {
		if (!inView) return;
		if (reducedMotion()) {
			setBroken(true);
			return;
		}
		const t = setTimeout(() => setBroken(true), 1800);
		return () => clearTimeout(t);
	}, [inView]);
	return (
		<section className="hause-grid py-12 sm:py-16">
			<div ref={ref} className="col-span-12 md:col-start-3 md:col-span-8">
				<div className="flex flex-wrap gap-2 mb-6">
					{[
						{ label: "REFERENCE", value: false },
						{ label: "×100 HEAD-SCALE BUG", value: true },
					].map((b) => (
						<button
							key={b.label}
							onClick={() => {
								tick();
								setBroken(b.value);
							}}
							className="voice-evidence text-xs px-4 py-2 border"
							style={{
								borderColor: broken === b.value ? "var(--color-accent)" : "var(--color-mist)",
								color: broken === b.value ? "var(--color-accent)" : undefined,
								opacity: broken === b.value ? 1 : 0.6,
							}}
						>
							{b.label}
						</button>
					))}
				</div>
				<div className="border p-5 sm:p-6 max-w-2xl" style={{ borderColor: "var(--color-mist)" }}>
					<p className="voice-evidence text-[10px] tracking-[0.12em] uppercase opacity-45 m-0 mb-3">
						&ldquo;the capital of France is&rdquo; — the next-token distribution, position 4
					</p>
					{DIST_REF.map((r, i) => {
						const p = broken ? (i === 0 ? 100 : 0) : r.p;
						return (
							<div key={r.tok} className="grid grid-cols-[minmax(0,7rem)_1fr_4rem] gap-3 items-center py-1">
								<span className="voice-evidence text-[12px]">{r.tok}</span>
								<div className="h-3 border" style={{ borderColor: "var(--color-mist)" }}>
									<div
										className="h-full"
										style={{
											width: `${p}%`,
											backgroundImage: hatch("var(--color-accent)"),
											transition: "width var(--motion-cinematic) var(--ease-hause)",
										}}
									/>
								</div>
								<span className="voice-evidence text-[11px] text-right" style={{ color: i === 0 ? "var(--color-accent)" : undefined, opacity: i === 0 ? 1 : 0.6 }}>
									{p.toFixed(3)}%
								</span>
							</div>
						);
					})}
					<div className="flex flex-wrap gap-x-8 gap-y-1 mt-4 pt-3 border-t" style={{ borderColor: "var(--color-mist)" }}>
						<span className="voice-evidence text-[11px]" style={{ color: "var(--color-status-supported)" }}>ARGMAX SAME</span>
						<span className="voice-evidence text-[11px]" style={{ color: "var(--color-status-supported)" }}>TEXT SAME</span>
						<span className="voice-evidence text-[11px]" style={{ color: broken ? "var(--color-status-refuted)" : "var(--color-status-supported)", transition: "color var(--motion-considered) var(--ease-hause)" }}>
							{broken ? "DISTRIBUTION DESTROYED — KL 284.8 bits" : "DISTRIBUTION INTACT"}
						</span>
					</div>
				</div>
				<p className="voice-system text-sm sm:text-base opacity-70 leading-relaxed max-w-2xl mt-6">
					A ×100 scaling bug in the output head — and every test that generates text and compares strings passes.
					Top-1 agreement: one hundred percent, zero flips, while the probability distribution is annihilated.
					Which is why fidelity is measured in probability space — KL, ΔNLL, top-k, margin — and never by the token
					the model picked.
				</p>
				<p className="voice-evidence text-xs opacity-45 leading-relaxed max-w-2xl mt-3">
					recorded · granite-4.1-3b · the bug arm of the quality bank — a deliberately broken image, kept because an
					invariant you never see fail is decoration
				</p>
			</div>
		</section>
	);
}
