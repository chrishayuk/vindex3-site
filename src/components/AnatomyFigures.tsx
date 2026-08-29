"use client";

import { useState } from "react";
import { tick } from "@chrishayuk/hause/sound";
import { Gating } from "@chrishayuk/hause/components/forms/Gating";

/**
 * ANATOMY — the four instruments.
 *
 * The chapter's job is one mental model: what the machinery behind an
 * address actually does. Every figure carries its point in visible
 * text, so nothing depends on the interaction — clicking only lets the
 * reader hold one part at a time. Numbers are the site's worked
 * example throughout: hidden 2,048 · intermediate 6,144 · 32 experts ·
 * 24 layers.
 */

const hatch = (color: string, pitch = 6) =>
	`repeating-linear-gradient(45deg, ${color} 0, ${color} 1px, transparent 1px, transparent ${pitch}px)`;

function Box({
	label,
	sub,
	accent,
	dim,
	onClick,
	active,
	wide,
}: {
	label: string;
	sub?: string;
	accent?: boolean;
	dim?: boolean;
	onClick?: () => void;
	active?: boolean;
	wide?: boolean;
}) {
	const Tag = onClick ? "button" : "div";
	return (
		<Tag
			onClick={onClick}
			className={`border px-4 py-3 text-center ${wide ? "w-full" : "min-w-40"}`}
			style={{
				borderColor: active ? "var(--color-accent)" : "var(--fg)",
				backgroundImage: hatch(accent || active ? "var(--color-accent)" : "var(--color-mist)"),
				backgroundColor: "var(--bg)",
				opacity: dim ? 0.45 : 1,
				transition: "border-color var(--motion-immediate) var(--ease-hause), opacity var(--motion-considered) var(--ease-hause)",
				cursor: onClick ? "pointer" : undefined,
			}}
		>
			<span className="voice-evidence text-[11px] tracking-[0.12em] uppercase block" style={{ background: "var(--bg)", padding: "0 4px" }}>
				{label}
			</span>
			{sub && (
				<span className="voice-evidence text-[10px] opacity-55 block mt-1" style={{ background: "var(--bg)", padding: "0 4px" }}>
					{sub}
				</span>
			)}
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

/* ------------------------------------------------------------------
   THE STACK — token to next word; the layer opens when touched.
   ------------------------------------------------------------------ */
export function StackFigure() {
	const [open, setOpen] = useState(false);
	return (
		<section className="hause-grid py-12 sm:py-16">
			<div className="col-span-12 md:col-start-3 md:col-span-8 flex flex-col items-center">
				<Box label="token" sub="“the”" />
				<Arrow />
				<Box label="embedding" sub="the word becomes 2,048 numbers" />
				<Arrow />
				<Box
					label={open ? "layer — inside" : "layer — click to enter"}
					sub={open ? undefined : "the machine, repeated 24 times"}
					onClick={() => {
						tick();
						setOpen((v) => !v);
					}}
					active={open}
					wide
				/>
				{open && (
					<div className="w-full border border-t-0 px-4 sm:px-8 py-5 flex flex-col items-center" style={{ borderColor: "var(--color-accent)" }}>
						<Box label="norm" sub="keep the numbers in range" dim />
						<Arrow />
						<Box label="attention" sub="look at every token before this one" accent />
						<div className="voice-evidence text-[10px] opacity-45 py-1">↓ added back to the stream — the residual</div>
						<Box label="norm" sub="in range again" dim />
						<Arrow />
						<Box label="feed-forward" sub="transform what attention gathered" accent />
						<div className="voice-evidence text-[10px] opacity-45 py-1">↓ added back to the stream</div>
					</div>
				)}
				<Arrow />
				<Box label="× 23 more layers" dim />
				<Arrow />
				<Box label="next word" sub="one pass through everything, for every single token" />
				<p className="voice-system text-sm opacity-70 leading-relaxed max-w-xl mt-8 text-center">
					A layer does exactly two things: attention looks backwards along the sentence, and the feed-forward
					network transforms what it found. Each result is <em>added</em> to a running stream rather than replacing
					it — which is why a layer can be measured, attributed, or skipped without the story falling apart.
				</p>
			</div>
		</section>
	);
}

/* ------------------------------------------------------------------
   ATTENTION — Q, K, V, O; hold one at a time.
   ------------------------------------------------------------------ */
const ATTN: Record<string, { title: string; text: string; addr: string }> = {
	q: {
		title: "QUERY — what am I looking for?",
		text: "q_proj turns this token's state into the questions it asks of every token before it. A verb asking for its subject; a pronoun asking who it stands for.",
		addr: "layer.17.attention.q_proj",
	},
	k: {
		title: "KEY — what do I contain?",
		text: "k_proj gives every earlier token an answerable surface — the description queries are compared against. A strong query–key match means: this one matters to you.",
		addr: "layer.17.attention.k_proj",
	},
	v: {
		title: "VALUE — what do I return?",
		text: "v_proj carries the actual information. When a match is strong, it is the value — not the key — that flows back into the current token.",
		addr: "layer.17.attention.v_proj",
	},
	o: {
		title: "OUTPUT — write it back.",
		text: "o_proj collects everything attention gathered across all its heads and writes it into the stream, sized to fit the hidden width.",
		addr: "layer.17.attention.o_proj",
	},
};

export function AttentionFigure() {
	const [sel, setSel] = useState<string>("q");
	const pick = (k: string) => {
		tick();
		setSel(k);
	};
	return (
		<section className="hause-grid py-12 sm:py-16">
			<div className="col-span-12 md:col-start-3 md:col-span-8 flex flex-col items-center">
				<Box label="hidden state" sub="one token · 2,048 numbers" wide />
				<Arrow />
				<div className="flex gap-3 sm:gap-6 w-full justify-center">
					{["q", "k", "v"].map((k) => (
						<Box key={k} label={k.toUpperCase()} sub={`${k}_proj`} onClick={() => pick(k)} active={sel === k} />
					))}
				</div>
				<Arrow />
				<Box label="attention" sub="queries meet keys · values flow back" wide />
				<Arrow />
				<Box label="O" sub="o_proj" onClick={() => pick("o")} active={sel === "o"} />
				<div className="w-full border p-5 mt-8" style={{ borderColor: "var(--color-mist)" }}>
					<p className="voice-editorial text-lg sm:text-xl mb-2">{ATTN[sel].title}</p>
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
					text: "up_proj expands 2,048 numbers into 6,144 — a wider space with more room to transform information than the stream itself allows.",
					payoff: "layer.17.mlp.up_proj — readable now",
					width: "wide",
					label: "6,144 values",
				},
				{
					chip: "GATE",
					title: "Decide what gets through.",
					text: "gate_proj builds a second wide vector whose job is judgement: it scores every one of those 6,144 channels for how much it should matter right now.",
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
					text: "down_proj compresses 6,144 back to 2,048, and the result is added to the stream for the next layer.",
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
   ------------------------------------------------------------------ */
const MOE_SCENARIOS = [
	{ label: "“the capital of France”", chosen: [3, 9, 18, 27] },
	{ label: "“a line of Python”", chosen: [1, 9, 14, 30] },
	{ label: "“a chess opening”", chosen: [3, 12, 22, 25] },
];

function ExpertGlyph({ lit }: { lit: boolean }) {
	return (
		<div
			className="border flex flex-col justify-between p-1"
			style={{
				aspectRatio: "1",
				borderColor: lit ? "var(--color-accent)" : "var(--color-mist)",
				opacity: lit ? 1 : 0.35,
				transition: "opacity var(--motion-considered) var(--ease-hause), border-color var(--motion-immediate) var(--ease-hause)",
			}}
		>
			{[0, 1, 2].map((i) => (
				<div key={i} style={{ height: 3, backgroundImage: hatch(lit ? "var(--color-accent)" : "var(--color-mist)", 3) }} />
			))}
		</div>
	);
}

export function MoeFigure() {
	const [scenario, setScenario] = useState(0);
	const chosen = new Set(MOE_SCENARIOS[scenario].chosen);
	return (
		<section className="hause-grid py-12 sm:py-16">
			<div className="col-span-12 md:col-start-3 md:col-span-8 flex flex-col items-center">
				<Box label="router" sub="32 candidates · 4 chosen, per token" wide />
				<Arrow />
				<div className="grid grid-cols-8 gap-2 w-full" aria-hidden="true">
					{Array.from({ length: 32 }, (_, i) => (
						<ExpertGlyph key={i} lit={chosen.has(i)} />
					))}
				</div>
				<div className="flex flex-wrap gap-2 mt-6 justify-center">
					{MOE_SCENARIOS.map((sc, i) => (
						<button
							key={sc.label}
							onClick={() => {
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
				<p className="voice-system text-sm opacity-70 leading-relaxed max-w-xl mt-8 text-center">
					Each small square is an expert, and an expert is nothing exotic: another gate–up–down triple, the three
					bars of its glyph. A mixture-of-experts layer keeps thirty-two of them and lets a router pick four per
					token. Which is why the Physics chapter could say the routing is the model&apos;s and the residency is
					yours — now you know what those resident bytes <em>are</em>.
				</p>
			</div>
		</section>
	);
}
