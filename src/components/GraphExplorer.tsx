"use client";

import { useState } from "react";

/**
 * The interactive SystemGraph: a worked three-component system —
 * target (primary_text), vision (perception), draft (drafter) — drawn
 * as the graph it is. Click a component, an object, or an edge and
 * read its facts in the spec's own vocabulary. The thin connectors
 * inside target are residual flow, not edges: a HiddenStateEdge only
 * exists across a component boundary, and the two here are the two
 * the living spec describes.
 */

type Selection =
	| { kind: "component"; id: string }
	| { kind: "object"; id: string }
	| { kind: "edge"; id: string }
	| null;

const COMPONENTS: Record<string, { role: string; evidence: string; geometry: string }> = {
	target: {
		role: "primary_text",
		evidence: "the default judgment — no drafter declaration, no nested config",
		geometry: "num_layers 24 · hidden_size 2048",
	},
	vision: {
		role: "perception",
		evidence: "a nested *_config component is perception — judged from evidence, never from a model name",
		geometry: "its own tower geometry, not the target's",
	},
	draft: {
		role: "drafter",
		evidence: "an artifact declaring target_layer_ids is a drafter",
		geometry: "taps the target's residual stream",
	},
};

const OBJECTS: Record<string, { kind: string; gloss: string; representations: string }> = {
	"target.embedding": { kind: "embedding", gloss: "tokens become vectors here", representations: "target.embedding@bf16 · canonical" },
	"target.decoder_stack": { kind: "decoder_stack", gloss: "the 24 layers every token passes through", representations: "target.decoder_stack@bf16 · canonical — further encodings arrive as variants, beside it" },
	"target.final_norm": { kind: "final_norm", gloss: "the last normalisation before the head", representations: "target.final_norm@f32 · canonical" },
	"target.output_head": { kind: "output_head", gloss: "vectors become token scores here", representations: "reuses the embedding — bound, not duplicated" },
	"vision.perception_tower": { kind: "perception_tower", gloss: "images become hidden states here", representations: "vision.perception_tower@bf16 · canonical" },
	"draft.feature_projector": { kind: "feature_projector", gloss: "the drafter's window onto the target", representations: "draft.feature_projector@bf16 · canonical" },
};

const EDGES: Record<string, { fields: [string, string][]; gloss: string }> = {
	"vision→target": {
		fields: [
			["producer_component", "vision"],
			["producer_layers", "[final]"],
			["consumer_component", "target"],
			["consumer_object", "vision.perception_adapter"],
		],
		gloss:
			"Perception states enter the text model's residual stream. The edge records the flow; the adapter that implements it is a separate object, referenced by id. The edge is not the tensor.",
	},
	"target→draft": {
		fields: [
			["producer_component", "target"],
			["producer_layers", "[12..23]"],
			["consumer_component", "draft"],
			["consumer_object", "draft.feature_projector"],
		],
		gloss:
			"The drafter taps the target's later layers — speculative execution is discovered from this edge, never from a model name. Its producer must be exactly one component deep enough to own every tap. Zero candidates, or two: the interface blocks. Never guessed.",
	},
};

// Layout (viewBox 0 0 720 400).
const NODE_POS: Record<string, { x: number; y: number; w: number; h: number }> = {
	"target.embedding": { x: 290, y: 52, w: 160, h: 34 },
	"target.decoder_stack": { x: 290, y: 130, w: 160, h: 58 },
	"target.final_norm": { x: 290, y: 232, w: 160, h: 34 },
	"target.output_head": { x: 290, y: 310, w: 160, h: 34 },
	"vision.perception_tower": { x: 40, y: 120, w: 160, h: 46 },
	"draft.feature_projector": { x: 530, y: 140, w: 160, h: 46 },
};

const FRAMES: Record<string, { x: number; y: number; w: number; h: number; label: string }> = {
	vision: { x: 24, y: 84, w: 192, h: 100, label: "vision — perception" },
	target: { x: 274, y: 16, w: 192, h: 348, label: "target — primary_text" },
	draft: { x: 514, y: 104, w: 192, h: 100, label: "draft — drafter" },
};

export function GraphExplorer() {
	const [sel, setSel] = useState<Selection>({ kind: "object", id: "target.decoder_stack" });

	const isSel = (kind: string, id: string) => sel?.kind === kind && sel.id === id;

	const edgeStroke = (id: string) => (isSel("edge", id) ? "var(--color-accent)" : "var(--color-mist)");

	let detail: React.ReactNode = null;
	if (sel?.kind === "component") {
		const c = COMPONENTS[sel.id];
		detail = (
			<div key={`c-${sel.id}`} className="graph-pulse">
				<p className="voice-evidence text-sm mb-1" style={{ color: "var(--color-accent)" }}>
					component: {sel.id}
				</p>
				<p className="voice-evidence text-xs opacity-70 mb-3">role {c.role} · {c.geometry}</p>
				<p className="voice-system text-sm opacity-80 leading-relaxed max-w-xl">
					Roles are derived, never declared: {c.evidence}. Ids are conceptual — never directory names.
				</p>
			</div>
		);
	} else if (sel?.kind === "object") {
		const o = OBJECTS[sel.id];
		detail = (
			<div key={`o-${sel.id}`} className="graph-pulse">
				<p className="voice-evidence text-sm mb-1" style={{ color: "var(--color-accent)" }}>
					{sel.id}
				</p>
				<p className="voice-evidence text-xs opacity-70 mb-3">kind {o.kind} · {o.representations}</p>
				<p className="voice-system text-sm opacity-80 leading-relaxed max-w-xl">
					{o.gloss}. Identity is the pair — component dot kind. Physical tensor names may bind this object; they
					never define it.
				</p>
			</div>
		);
	} else if (sel?.kind === "edge") {
		const e = EDGES[sel.id];
		detail = (
			<div key={`e-${sel.id}`} className="graph-pulse">
				<p className="voice-evidence text-sm mb-3" style={{ color: "var(--color-accent)" }}>
					HiddenStateEdge
				</p>
				<div className="flex flex-col gap-1 mb-3">
					{e.fields.map(([k, v]) => (
						<p key={k} className="voice-evidence text-xs">
							<span className="opacity-50">{k}</span>&nbsp;&nbsp;{v}
						</p>
					))}
				</div>
				<p className="voice-system text-sm opacity-80 leading-relaxed max-w-xl">{e.gloss}</p>
			</div>
		);
	}

	return (
		<section className="house-grid py-20 sm:py-28">
			<div className="col-span-12 md:col-start-2 md:col-span-10 lg:col-span-9">
				<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-3 opacity-50">
					EXPLORE — A SYSTEM GRAPH YOU CAN TOUCH
				</p>
				<p className="voice-editorial text-2xl sm:text-3xl mb-10">Three components. Six objects. Two edges.</p>

				<div className="overflow-x-auto">
					<svg viewBox="0 0 720 400" className="w-full min-w-[560px]" role="img" aria-label="A worked system graph: a vision component feeding a target text model, and a drafter tapping the target's later layers">
						{/* Component frames */}
						{Object.entries(FRAMES).map(([id, f]) => (
							<g key={id} onClick={() => setSel({ kind: "component", id })} className="cursor-pointer">
								<rect
									x={f.x} y={f.y} width={f.w} height={f.h}
									fill="none"
									stroke={isSel("component", id) ? "var(--color-accent)" : "var(--color-mist)"}
									strokeDasharray="4 4"
								/>
								<text
									x={f.x + 8} y={f.y - 6}
									className="voice-evidence"
									style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}
									fill={isSel("component", id) ? "var(--color-accent)" : "var(--fg)"}
									opacity={isSel("component", id) ? 1 : 0.55}
								>
									{f.label}
								</text>
							</g>
						))}

						{/* Residual flow inside target — flow, not edges */}
						{[
							["target.embedding", "target.decoder_stack"],
							["target.decoder_stack", "target.final_norm"],
							["target.final_norm", "target.output_head"],
						].map(([a, b]) => {
							const pa = NODE_POS[a];
							const pb = NODE_POS[b];
							return (
								<line
									key={`${a}-${b}`}
									x1={pa.x + pa.w / 2} y1={pa.y + pa.h}
									x2={pb.x + pb.w / 2} y2={pb.y}
									stroke="var(--color-mist)" strokeWidth={1} opacity={0.6}
								/>
							);
						})}

						{/* The two HiddenStateEdges */}
						<g onClick={() => setSel({ kind: "edge", id: "vision→target" })} className="cursor-pointer">
							<line x1={200} y1={143} x2={290} y2={155} stroke="transparent" strokeWidth={16} />
							<line x1={200} y1={143} x2={290} y2={155} stroke={edgeStroke("vision→target")} strokeWidth={1.5} />
							<circle cx={290} cy={155} r={3} fill={edgeStroke("vision→target")} />
						</g>
						<g onClick={() => setSel({ kind: "edge", id: "target→draft" })} className="cursor-pointer">
							<line x1={450} y1={160} x2={530} y2={163} stroke="transparent" strokeWidth={16} />
							<line x1={450} y1={160} x2={530} y2={163} stroke={edgeStroke("target→draft")} strokeWidth={1.5} />
							<circle cx={530} cy={163} r={3} fill={edgeStroke("target→draft")} />
							<text x={455} y={150} className="voice-evidence" style={{ fontSize: 9 }} fill="var(--fg)" opacity={0.5}>
								layers 12..23
							</text>
						</g>

						{/* Object nodes */}
						{Object.entries(NODE_POS).map(([id, p], i) => {
							const selected = isSel("object", id);
							return (
								<g key={id} onClick={() => setSel({ kind: "object", id })} className="cursor-pointer graph-pulse" style={{ animationDelay: `${i * 90}ms` }}>
									<rect
										x={p.x} y={p.y} width={p.w} height={p.h}
										fill="var(--bg)"
										stroke={selected ? "var(--color-accent)" : "var(--fg)"}
										strokeWidth={selected ? 1.5 : 1}
									/>
									{selected && (
										<rect
											x={p.x} y={p.y} width={p.w} height={p.h}
											fill="var(--color-accent)" opacity={0.08}
										/>
									)}
									<text
										x={p.x + p.w / 2} y={p.y + p.h / 2 + 3.5}
										textAnchor="middle"
										className="voice-evidence"
										style={{ fontSize: 10.5 }}
										fill={selected ? "var(--color-accent)" : "var(--fg)"}
									>
										{id.split(".")[1]}
									</text>
								</g>
							);
						})}
					</svg>
				</div>

				<div className="border-t pt-6 mt-4 min-h-[9rem]" style={{ borderColor: "var(--color-mist)" }}>
					{detail}
				</div>

				{/* Always-present text fallback. */}
				<p className="voice-evidence text-xs opacity-40 leading-relaxed max-w-2xl mt-8">
					A worked example, in the spec&apos;s own vocabulary: components target (primary_text), vision
					(perception), and draft (drafter); objects named {"{component}.{kind}"}; one edge carrying perception
					states into the target, one letting the drafter tap the target&apos;s layers 12..23. Inside a component,
					connectors are residual flow — an edge exists only across a boundary.
				</p>
			</div>
		</section>
	);
}
