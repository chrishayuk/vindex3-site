"use client";

import { useEffect, useRef, useState } from "react";
import { tick } from "@chrishayuk/hause/sound";
import { Gating } from "@chrishayuk/hause/components/forms/Gating";
import { entity } from "@/data/vindexGraph";

/**
 * ANATOMY — the four instruments.
 *
 * The chapter's job is one mental model: what the machinery behind an
 * address actually does. Every figure carries its point in visible
 * text, and every figure *arrives* — staged entrances on first view,
 * and the holdable ones cycle themselves gently until the reader takes
 * over, then rest in their hands. Reduced motion gets the finished
 * state. Numbers are the site's worked example throughout: hidden
 * 2,048 · intermediate 6,144 · 32 experts · 24 layers.
 */

const hatch = (color: string, pitch = 6) =>
	`repeating-linear-gradient(45deg, ${color} 0, ${color} 1px, transparent 1px, transparent ${pitch}px)`;

function reducedMotion() {
	return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True once the element has been ~a third in view. */
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

/** Cycle through n states until the reader takes over. */
function useAutoCycle(n: number, active: boolean, periodMs: number, onTickState: (i: number) => void) {
	const held = useRef(false);
	useEffect(() => {
		if (!active || held.current || reducedMotion()) return;
		let i = 0;
		const id = setInterval(() => {
			if (held.current) {
				clearInterval(id);
				return;
			}
			i = (i + 1) % n;
			onTickState(i);
		}, periodMs);
		return () => clearInterval(id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [active, n, periodMs]);
	return () => {
		held.current = true;
	};
}

function Box({
	label,
	sub,
	accent,
	dim,
	onClick,
	active,
	small,
}: {
	label: string;
	sub?: string;
	accent?: boolean;
	dim?: boolean;
	onClick?: () => void;
	active?: boolean;
	small?: boolean;
}) {
	const Tag = onClick ? "button" : "div";
	const lit = accent || active;
	return (
		<Tag
			onClick={onClick}
			className={`border text-center ${small ? "px-5 py-3 min-w-32" : "px-6 py-4 w-full max-w-md"}`}
			style={{
				borderColor: lit ? "var(--color-accent)" : "var(--color-mist)",
				background: "var(--bg)",
				opacity: dim ? 0.5 : 1,
				transition: "border-color var(--motion-immediate) var(--ease-hause), opacity var(--motion-considered) var(--ease-hause)",
				cursor: onClick ? "pointer" : undefined,
			}}
		>
			<span
				aria-hidden="true"
				className="block mb-2"
				style={{
					height: 4,
					backgroundImage: hatch(lit ? "var(--color-accent)" : "var(--color-mist)", 4),
					opacity: 0.8,
				}}
			/>
			<span className="voice-evidence text-xs tracking-[0.12em] uppercase block">{label}</span>
			{sub && <span className="voice-evidence text-[11px] opacity-55 block mt-1.5">{sub}</span>}
		</Tag>
	);
}

function Arrow() {
	return (
		<div aria-hidden="true" className="voice-evidence text-xs opacity-40 py-1">
			↓
		</div>
	);
}

/** Staged entrance: children pulse in, one after another. */
function Arrive({ index, show, children }: { index: number; show: boolean; children: React.ReactNode }) {
	if (!show) return <div className="w-full flex flex-col items-center" style={{ opacity: 0 }}>{children}</div>;
	return (
		<div className="graph-pulse w-full flex flex-col items-center" style={{ animationDelay: `${index * 160}ms` }}>
			{children}
		</div>
	);
}

/* ------------------------------------------------------------------
   THE STACK — token to next word; the layer opens when touched.
   ------------------------------------------------------------------ */
export function StackFigure() {
	const { ref, inView } = useInView();
	const [open, setOpen] = useState(false);
	return (
		<section className="hause-grid py-12 sm:py-16">
			<div ref={ref} className="col-span-12 md:col-start-3 md:col-span-8 flex flex-col items-center">
				<Arrive index={0} show={inView}>
					<Box label="token" sub="“the”" />
				</Arrive>
				<Arrive index={1} show={inView}>
					<Arrow />
					<Box label="embedding" sub="the word becomes 2,048 numbers" />
				</Arrive>
				<Arrive index={2} show={inView}>
					<Arrow />
					<Box
						label={open ? "layer — inside" : "layer — click to enter"}
						sub={open ? undefined : "the machine, repeated 24 times"}
						onClick={() => {
							tick();
							setOpen((v) => !v);
						}}
						active={open}
					/>
				</Arrive>
				{open && (
					<div className="w-full max-w-md border border-t-0 px-5 sm:px-8 py-6 flex flex-col items-center" style={{ borderColor: "var(--color-accent)", background: "var(--bg)" }}>
						{[
							<Box key="n1" label="norm" sub="keep the numbers in range" dim small />,
							<Arrow key="a1" />,
							<Box key="att" label="attention" sub="look at every token before this one" accent small />,
							<div key="r1" className="voice-evidence text-[10px] opacity-45 py-1">↓ added back to the stream — the residual</div>,
							<Box key="n2" label="norm" sub="in range again" dim small />,
							<Arrow key="a2" />,
							<Box key="ffn" label="feed-forward" sub="transform what attention gathered" accent small />,
							<div key="r2" className="voice-evidence text-[10px] opacity-45 py-1">↓ added back to the stream</div>,
						].map((el, i) => (
							<div key={i} className="graph-pulse w-full flex flex-col items-center" style={{ animationDelay: `${i * 110}ms` }}>
								{el}
							</div>
						))}
					</div>
				)}
				<Arrive index={3} show={inView}>
					<Arrow />
					<Box label="× 23 more layers" dim />
				</Arrive>
				<Arrive index={4} show={inView}>
					<Arrow />
					<Box label="next word" sub="one pass through everything, for every single token" />
				</Arrive>
				<p className="voice-system text-sm sm:text-base opacity-70 leading-relaxed max-w-2xl mt-8 text-center">
					A layer does exactly two things: attention looks backwards along the sentence, and the feed-forward
					network transforms what it found. Each result is <em>added</em> to a running stream rather than replacing
					it — which is why a layer can be measured, attributed, or skipped without the story falling apart.
				</p>
			</div>
		</section>
	);
}

/* ------------------------------------------------------------------
   ATTENTION — Q, K, V, O; cycles gently until held.
   ------------------------------------------------------------------ */
const ATTN_ORDER = ["q", "k", "v", "o"] as const;

// A projection, not a copy: the words are the graph entities' own —
// the same records Ask's definitions and the Explorer's DESCRIBE
// answer from, so the three surfaces cannot drift apart.
const ATTN_WORDS: Record<string, string> = { q: "QUERY", k: "KEY", v: "VALUE", o: "OUTPUT" };
const ATTN: Record<string, { title: string; text: string; addr: string }> = Object.fromEntries(
	(["q", "k", "v", "o"] as const).map((id) => {
		const ent = entity(id)!;
		return [
			id,
			{
				title: `${ATTN_WORDS[id]} — ${ent.five}${ent.five.endsWith("?") || id === "o" ? "" : "?"}`,
				text: `${ent.role} ${ent.detail}`,
				addr: `layer.17.attention.${id}_proj`,
			},
		];
	})
);

export function AttentionFigure() {
	const { ref, inView } = useInView();
	const [sel, setSel] = useState<string>("q");
	const hold = useAutoCycle(ATTN_ORDER.length, inView, 3200, (i) => setSel(ATTN_ORDER[i]));
	const pick = (k: string) => {
		hold();
		tick();
		setSel(k);
	};
	return (
		<section className="hause-grid py-12 sm:py-16">
			<div ref={ref} className="col-span-12 md:col-start-3 md:col-span-8 flex flex-col items-center">
				<Arrive index={0} show={inView}>
					<Box label="hidden state" sub="one token · 2,048 numbers" />
				</Arrive>
				<Arrive index={1} show={inView}>
					<Arrow />
					<div className="flex gap-3 sm:gap-6 justify-center">
						{["q", "k", "v"].map((k) => (
							<Box key={k} label={k.toUpperCase()} sub={`${k}_proj`} onClick={() => pick(k)} active={sel === k} small />
						))}
					</div>
				</Arrive>
				<Arrive index={2} show={inView}>
					<Arrow />
					<Box label="attention" sub="queries meet keys · values flow back" />
				</Arrive>
				<Arrive index={3} show={inView}>
					<Arrow />
					<Box label="O" sub="o_proj" onClick={() => pick("o")} active={sel === "o"} small />
				</Arrive>
				<div key={sel} className="graph-pulse w-full max-w-3xl border p-6 mt-8" style={{ borderColor: "var(--color-mist)", background: "var(--bg)" }}>
					<p className="voice-editorial text-xl sm:text-2xl mb-2">{ATTN[sel].title}</p>
					<p className="voice-system text-sm opacity-80 leading-relaxed max-w-xl">{ATTN[sel].text}</p>
					<p className="voice-evidence text-xs mt-4" style={{ color: "var(--color-accent)" }}>
						{ATTN[sel].addr} — readable now
					</p>
				</div>
			</div>
		</section>
	);
}

/* ------------------------------------------------------------------
   FEED-FORWARD — gate / up / down, spoken through HAUSE's Gating form
   (which this figure was generalised into).
   ------------------------------------------------------------------ */
export function FfnFigure() {
	return (
		<Gating
			channels={24}
			keep={[1, 2, 5, 8, 9, 13, 16, 17, 21, 22]}
			stages={[
				{
					chip: "THE STREAM",
					title: "The stream arrives.",
					text: "2,048 numbers — the token as the layers so far understand it.",
					width: "narrow",
					label: "2,048 values",
				},
				{
					chip: "UP",
					title: "Make the space bigger.",
					text: entity("up")!.role,
					payoff: "layer.17.mlp.up_proj — readable now",
					width: "wide",
					label: "6,144 values",
				},
				{
					chip: "GATE",
					title: "Decide what gets through.",
					text: entity("gate")!.role,
					payoff: "layer.17.mlp.gate_proj — readable now",
					width: "wide",
					gated: true,
					label: "6,144 values · the gate judging each channel",
				},
				{
					chip: "×",
					title: "The two multiply.",
					text: "Scored channels pass; the rest fade. That single multiplication is the whole trick the literature calls a gated unit — SwiGLU, spelled out.",
					width: "wide",
					gated: true,
					label: "6,144 values · judged — most of them faded",
				},
				{
					chip: "DOWN",
					title: "Bring it back home.",
					text: entity("down")!.role,
					payoff: "layer.17.mlp.down_proj — readable now",
					width: "narrow",
					label: "2,048 values — back in the stream",
				},
			]}
			fallback="Expand, judge, compress, add back. Three tensors — gate, up, down — and that is the entire feed-forward network. Everything a layer knows lives in how these grids of numbers steer the multiplication."
		/>
	);
}

/* ------------------------------------------------------------------
   MIXTURE OF EXPERTS — the same machine, many times, chosen per token.
   Routes itself gently until the reader takes the router.
   ------------------------------------------------------------------ */
const MOE_SCENARIOS = [
	{ label: "“the capital of France”", chosen: [3, 9, 18, 27] },
	{ label: "“a line of Python”", chosen: [1, 9, 14, 30] },
	{ label: "“a chess opening”", chosen: [3, 12, 22, 25] },
];

function ExpertGlyph({ lit, delay, show }: { lit: boolean; delay: number; show: boolean }) {
	return (
		<div
			className={show ? "graph-pulse border flex flex-col justify-between p-1" : "border flex flex-col justify-between p-1"}
			style={{
				aspectRatio: "1",
				animationDelay: `${delay}ms`,
				borderColor: lit ? "var(--color-accent)" : "var(--color-mist)",
				opacity: show ? (lit ? 1 : 0.35) : 0,
				transition: "opacity var(--motion-considered) var(--ease-hause), border-color var(--motion-immediate) var(--ease-hause)",
			}}
		>
			{[0, 1, 2].map((i) => (
				<div key={i} style={{ height: 5, backgroundImage: hatch(lit ? "var(--color-accent)" : "var(--color-mist)", 3) }} />
			))}
		</div>
	);
}

export function MoeFigure() {
	const { ref, inView } = useInView();
	const [scenario, setScenario] = useState(0);
	const hold = useAutoCycle(MOE_SCENARIOS.length, inView, 3000, (i) => setScenario(i));
	const chosen = new Set(MOE_SCENARIOS[scenario].chosen);
	return (
		<section className="hause-grid py-12 sm:py-16">
			<div ref={ref} className="col-span-12 md:col-start-3 md:col-span-8 flex flex-col items-center">
				<Arrive index={0} show={inView}>
					<Box label="router" sub="32 candidates · 4 chosen, per token" />
				</Arrive>
				<Arrow />
				<div className="grid grid-cols-8 gap-2.5 w-full max-w-3xl mt-1" aria-hidden="true">
					{Array.from({ length: 32 }, (_, i) => (
						<ExpertGlyph key={i} lit={chosen.has(i)} delay={200 + i * 28} show={inView} />
					))}
				</div>
				<div className="flex flex-wrap gap-2 mt-6 justify-center">
					{MOE_SCENARIOS.map((sc, i) => (
						<button
							key={sc.label}
							onClick={() => {
								hold();
								tick();
								setScenario(i);
							}}
							className="voice-evidence text-[11px] px-3 py-1.5 border"
							style={{
								borderColor: i === scenario ? "var(--color-accent)" : "var(--color-mist)",
								color: i === scenario ? "var(--color-accent)" : undefined,
								opacity: i === scenario ? 1 : 0.6,
							}}
						>
							{sc.label}
						</button>
					))}
				</div>
				<p className="voice-system text-sm sm:text-base opacity-70 leading-relaxed max-w-2xl mt-8 text-center">
					Each small square is an expert, and an expert is nothing exotic: another gate–up–down triple, the three
					bars of its glyph. A mixture-of-experts layer keeps thirty-two of them and lets a router pick four per
					token. Which is why the Physics chapter could say the routing is the model&apos;s and the residency is
					yours — now you know what those resident bytes <em>are</em>.
				</p>
			</div>
		</section>
	);
}
