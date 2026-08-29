"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The story figures: four performed explanations, one per chapter,
 * each turning a load-bearing paragraph of the spec into a mechanism
 * you can watch. All follow the hause loop idiom — run while in view,
 * pause off-screen, rest on the finished state under reduced motion —
 * and all stay silent (loops never speak).
 */

const HATCH = (color: string, pitch = 6) =>
	`repeating-linear-gradient(45deg, ${color} 0, ${color} 1px, transparent 1px, transparent ${pitch}px)`;

function useLoop(ref: React.RefObject<HTMLElement | null>, cycle: (running: React.MutableRefObject<boolean>, timers: React.MutableRefObject<ReturnType<typeof setTimeout>[]>) => void, rest: () => void) {
	const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
	const running = useRef(false);
	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const el = ref.current;
		if (!el) return;
		const clear = () => {
			timers.current.forEach(clearTimeout);
			timers.current = [];
		};
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !running.current) {
					running.current = true;
					cycle(running, timers);
				} else if (!entry.isIntersecting && running.current) {
					running.current = false;
					clear();
					rest();
				}
			},
			{ threshold: 0.35 }
		);
		observer.observe(el);
		return () => {
			running.current = false;
			observer.disconnect();
			clear();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
}

/* ------------------------------------------------------------------
   CLASS TRAFFIC — why five classes: what one token actually touches.
   Classes 1–3 light fully on every pulse; the routed banks light only
   a sliver, somewhere different each time. Same container, different
   economics.
   ------------------------------------------------------------------ */
const CLASSES = [
	{ label: "1 · control & router", full: true, note: "every token" },
	{ label: "2 · dense spine", full: true, note: "every token" },
	{ label: "3 · shared ffn", full: true, note: "every token" },
	{ label: "4 · routed gate/up", full: false, note: "top-k only — a sliver" },
	{ label: "5 · routed down", full: false, note: "the same sliver, later" },
];

export function ClassTraffic() {
	const ref = useRef<HTMLDivElement>(null);
	const [pulse, setPulse] = useState(6); // deterministic sliver position seed
	const [lit, setLit] = useState(true);

	useLoop(
		ref,
		(running, timers) => {
			const beat = () => {
				if (!running.current) return;
				setLit(true);
				setPulse((p) => p + 1);
				timers.current.push(setTimeout(() => running.current && setLit(false), 1050));
				timers.current.push(setTimeout(beat, 1800));
			};
			beat();
		},
		() => {
			setLit(true);
		}
	);

	const sliverLeft = (row: number) => `${((pulse * 37 + row * 23) % 88) + 4}%`;

	return (
		<section className="hause-grid py-10 sm:py-14">
			<div ref={ref} className="col-span-12 md:col-start-2 md:col-span-10 lg:col-span-9">
				<div className="flex flex-col gap-2" aria-hidden="true">
					{CLASSES.map((c, i) => (
						<div key={c.label} className="grid grid-cols-[minmax(8rem,11rem)_1fr_minmax(8rem,auto)] gap-4 sm:gap-6 items-center">
							<span className="voice-evidence text-[10px] sm:text-xs tracking-[0.06em] uppercase opacity-60">{c.label}</span>
							<div className="relative border h-7" style={{ borderColor: "var(--fg)", background: "var(--bg)" }}>
								<div className="absolute inset-0" style={{ backgroundImage: HATCH("var(--color-mist)"), opacity: 0.4 }} />
								<div
									className="absolute inset-y-0"
									style={{
										left: c.full ? 0 : sliverLeft(i),
										width: c.full ? "100%" : "2.2%",
										backgroundImage: HATCH("var(--color-accent)", 4),
										opacity: lit ? 0.9 : 0,
										transition: `opacity var(--motion-considered) var(--ease-hause)${c.full ? "" : ", left 0ms"}`,
									}}
								/>
							</div>
							<span className="voice-evidence text-[10px] tracking-[0.06em] uppercase opacity-40 text-right">{c.note}</span>
						</div>
					))}
				</div>
				<p className="voice-system text-sm opacity-70 leading-relaxed max-w-2xl mt-6">
					One token, one flash. The first three classes work on every token; the routed banks contribute a
					sliver — a handful of experts out of hundreds, different ones each time. Different traffic is different
					economics, and different economics is why each class may be placed, paged, or quantised on its own terms.
				</p>
				<p className="voice-evidence text-xs opacity-40 leading-relaxed max-w-2xl mt-4">
					Classes 1–3: touched by every token. Classes 4–5: touched top-k-at-a-time. The split rule in one picture.
				</p>
			</div>
		</section>
	);
}

/* ------------------------------------------------------------------
   SEGMENTATION — the K3 arithmetic performed: a layer too big for the
   cap splits on group-extent boundaries into two segments that fit.
   ------------------------------------------------------------------ */
export function SegmentationFigure() {
	const ref = useRef<HTMLDivElement>(null);
	const [phase, setPhase] = useState(2); // 0 whole+cap · 1 split · 2 extents (rest)

	useLoop(
		ref,
		(running, timers) => {
			const cycle = () => {
				if (!running.current) return;
				setPhase(0);
				timers.current.push(setTimeout(() => running.current && setPhase(1), 2200));
				timers.current.push(setTimeout(() => running.current && setPhase(2), 4200));
				timers.current.push(setTimeout(cycle, 7600));
			};
			cycle();
		},
		() => setPhase(2)
	);

	const seg = (label: string) => (
		<div className="relative border h-10 overflow-hidden" style={{ borderColor: "var(--fg)", background: "var(--bg)", width: "56.5%" }}>
			<div className="absolute inset-0" style={{ backgroundImage: HATCH("var(--color-accent)"), opacity: 0.6 }} />
			{phase >= 2 && (
				<div
					className="absolute inset-0"
					style={{ backgroundImage: `repeating-linear-gradient(90deg, var(--bg) 0, var(--bg) 1px, transparent 1px, transparent ${100 / 28}%)` }}
				/>
			)}
			<span className="absolute bottom-1 left-2 voice-evidence text-[9px] tracking-[0.06em] uppercase">{label}</span>
		</div>
	);

	return (
		<section className="hause-grid py-10 sm:py-14">
			<div ref={ref} className="col-span-12 md:col-start-2 md:col-span-10 lg:col-span-9">
				<div aria-hidden="true" className="relative" style={{ minHeight: 150 }}>
					{/* the cap */}
					<div className="absolute top-0 left-0" style={{ width: "50%" }}>
						<div className="border-t" style={{ borderColor: "var(--color-status-refuted)" }} />
						<p className="voice-evidence text-[9px] tracking-[0.08em] uppercase mt-1" style={{ color: "var(--color-status-refuted)" }}>
							the 20 GiB shard cap
						</p>
					</div>
					{/* phase 0: the whole layer, overflowing the cap */}
					<div
						className="absolute border h-10 overflow-hidden"
						style={{
							top: 28,
							width: "100%",
							borderColor: "var(--fg)",
							background: "var(--bg)",
							opacity: phase === 0 ? 1 : 0,
							transition: "opacity var(--motion-considered) var(--ease-hause)",
						}}
					>
						<div className="absolute inset-0" style={{ backgroundImage: HATCH("var(--color-accent)"), opacity: 0.6 }} />
						<span className="absolute bottom-1 left-2 voice-evidence text-[9px] tracking-[0.06em] uppercase">
							one routed layer — 896 experts · 22.61 GiB
						</span>
					</div>
					{/* phases 1–2: two segments, inside the cap */}
					<div
						className="absolute flex gap-[3%] w-full"
						style={{
							top: 28,
							opacity: phase >= 1 ? 1 : 0,
							transition: "opacity var(--motion-cinematic) var(--ease-hause)",
						}}
					>
						{seg("seg00 — experts 0–447 · 11.3 GiB")}
						{seg("seg01 — experts 448–895 · 11.3 GiB")}
					</div>
					<p
						className="absolute voice-evidence text-[10px] tracking-[0.06em] uppercase opacity-50"
						style={{ top: 84, opacity: phase >= 2 ? 0.5 : 0, transition: "opacity var(--motion-considered) var(--ease-hause)" }}
					>
						28 group extents of 16 experts each — the unit of reads, prefetch, and dispatch
					</p>
				</div>
				<p className="voice-system text-sm opacity-70 leading-relaxed max-w-2xl mt-8">
					Two scales, two measurements. The segment answers to file management — as large as the cap allows, so two
					files, not fourteen. The extent answers to hardware — how much one grouped dispatch reads. Boundaries
					always agree: segments split only on extent edges.
				</p>
			</div>
		</section>
	);
}

/* ------------------------------------------------------------------
   EDGE RESOLUTION — the exactly-one-producer rule, three scenarios on
   a loop: one candidate resolves; zero refuses; two refuses. Never
   guessed.
   ------------------------------------------------------------------ */
const EDGE_CASES = [
	{ producers: 1, verdict: "RESOLVED", ok: true, gloss: "exactly one component owns every declared tap — the edge exists" },
	{ producers: 0, verdict: "REFUSED — ZERO CANDIDATES", ok: false, gloss: "no component is deep enough to own the taps — the interface blocks" },
	{ producers: 2, verdict: "REFUSED — TWO CANDIDATES", ok: false, gloss: "ambiguity is refused, never guessed — the interface blocks" },
] as const;

export function EdgeResolution() {
	const ref = useRef<HTMLDivElement>(null);
	const [idx, setIdx] = useState(0);

	useLoop(
		ref,
		(running, timers) => {
			const cycle = (i: number) => {
				if (!running.current) return;
				setIdx(i % EDGE_CASES.length);
				timers.current.push(setTimeout(() => cycle(i + 1), 3000));
			};
			cycle(0);
		},
		() => setIdx(0)
	);

	const c = EDGE_CASES[idx];

	return (
		<section className="hause-grid py-10 sm:py-14">
			<div ref={ref} className="col-span-12 md:col-start-2 md:col-span-10 lg:col-span-9">
				<div key={idx} aria-hidden="true" className="graph-pulse flex items-center justify-center gap-8 sm:gap-14" style={{ minHeight: 120 }}>
					<div className="flex flex-col gap-3">
						{Array.from({ length: Math.max(c.producers, 1) }).map((_, i) => (
							<div
								key={i}
								className="border px-4 py-2.5"
								style={{
									borderColor: c.producers === 0 ? "var(--color-mist)" : "var(--fg)",
									borderStyle: c.producers === 0 ? "dashed" : "solid",
									background: "var(--bg)",
									opacity: c.producers === 0 ? 0.35 : 1,
								}}
							>
								<span className="voice-evidence text-xs">{c.producers === 0 ? "no producer" : `candidate ${i + 1}`}</span>
							</div>
						))}
					</div>
					<div className="relative flex-none" style={{ width: 120 }}>
						<div
							className="border-t"
							style={{
								borderColor: c.ok ? "var(--color-accent)" : "var(--color-status-refuted)",
								borderStyle: c.ok ? "solid" : "dashed",
								opacity: c.producers === 0 ? 0.4 : 1,
							}}
						/>
						<p
							className="voice-evidence text-[9px] tracking-[0.08em] uppercase text-center mt-1"
							style={{ color: c.ok ? "var(--color-accent)" : "var(--color-status-refuted)" }}
						>
							taps [1, 13, 25, 37, 49]
						</p>
					</div>
					<div className="border px-4 py-2.5" style={{ borderColor: "var(--fg)", background: "var(--bg)" }}>
						<span className="voice-evidence text-xs">draft.feature_projector</span>
					</div>
				</div>
				<p
					key={`v-${idx}`}
					className="graph-pulse voice-evidence text-xs tracking-[0.1em] uppercase text-center mt-4"
					style={{ color: c.ok ? "var(--color-status-supported)" : "var(--color-status-refuted)" }}
				>
					{c.verdict}
				</p>
				<p className="voice-system text-sm opacity-70 leading-relaxed max-w-xl mx-auto text-center mt-3">{c.gloss}.</p>
			</div>
		</section>
	);
}

/* ------------------------------------------------------------------
   CLOSURE — the refusal that taught the format, performed: operands
   connect to operations until one finds no op. The refusal names the
   missing primitive; the primitive is judged in; the layer closes.
   ------------------------------------------------------------------ */
const OPERANDS = ["pre_attn_norm", "q_proj", "k_proj", "v_proj", "q_norm", "k_norm", "gate_proj", "o_proj", "post_attn_norm", "ffn_gate", "ffn_up", "ffn_down"];
const GATE_INDEX = OPERANDS.indexOf("gate_proj");

export function ClosureFigure() {
	const ref = useRef<HTMLDivElement>(null);
	// phase: 0..11 connecting · 12 refusal · 13 judged (op appears) · 14 closed (rest)
	const [phase, setPhase] = useState(14);

	useLoop(
		ref,
		(running, timers) => {
			const cycle = () => {
				if (!running.current) return;
				setPhase(0);
				for (let i = 1; i <= 11; i++) timers.current.push(setTimeout(() => running.current && setPhase(i), 300 + i * 260));
				timers.current.push(setTimeout(() => running.current && setPhase(12), 300 + 12 * 260 + 300));
				timers.current.push(setTimeout(() => running.current && setPhase(13), 300 + 12 * 260 + 2400));
				timers.current.push(setTimeout(() => running.current && setPhase(14), 300 + 12 * 260 + 3600));
				timers.current.push(setTimeout(cycle, 300 + 12 * 260 + 6600));
			};
			cycle();
		},
		() => setPhase(14)
	);

	const refusing = phase === 12;
	const judged = phase >= 13;
	const closed = phase >= 14;

	return (
		<section className="hause-grid py-10 sm:py-14">
			<div ref={ref} className="col-span-12 md:col-start-2 md:col-span-10 lg:col-span-9">
				<div className="flex flex-wrap gap-2" aria-hidden="true">
					{OPERANDS.map((name, i) => {
						const isGate = i === GATE_INDEX;
						// non-gate operands connect in order (skipping the gate's turn);
						const order = i < GATE_INDEX ? i : i - 1;
						const connected = isGate ? judged : phase >= order + 1;
						const alarmed = isGate && refusing;
						return (
							<span
								key={name}
								className="voice-evidence text-[10px] sm:text-xs px-2.5 py-1.5 border"
								style={{
									borderColor: alarmed ? "var(--color-status-refuted)" : connected ? "var(--color-accent)" : "var(--color-mist)",
									color: alarmed ? "var(--color-status-refuted)" : connected ? "var(--color-accent)" : undefined,
									opacity: connected || alarmed ? 1 : 0.45,
									transition: "border-color var(--motion-immediate) var(--ease-hause), color var(--motion-immediate) var(--ease-hause), opacity var(--motion-immediate) var(--ease-hause)",
								}}
							>
								{name}
							</span>
						);
					})}
				</div>

				<div className="mt-5 min-h-[3.5rem]">
					{refusing && (
						<p key="refuse" className="graph-pulse voice-evidence text-xs sm:text-sm" style={{ color: "var(--color-status-refuted)" }}>
							● REFUSED · required primitive: attention output gate — ×52 layers
						</p>
					)}
					{judged && !closed && (
						<p key="judge" className="graph-pulse voice-evidence text-xs sm:text-sm" style={{ color: "var(--color-accent)" }}>
							judged from the reference — sigmoid(gate) multiplied into the head output — the primitive enters the IR
						</p>
					)}
					{closed && (
						<p key="close" className="graph-pulse voice-evidence text-xs sm:text-sm" style={{ color: "var(--color-status-supported)" }}>
							● CLOSED · 52 layers × 12/12 operands accounted
						</p>
					)}
				</div>

				<p className="voice-system text-sm opacity-70 leading-relaxed max-w-2xl mt-4">
					Closure, performed: every operand must map to an operation the surface declares. The gate weight found no
					operation — so the format refused, naming the missing primitive rather than skipping the tensor. Once the
					gate&apos;s semantics were judged from the reference implementation, the primitive entered the vocabulary
					and the layer closed. Refusal is how this format learns.
				</p>
			</div>
		</section>
	);
}
