"use client";

import { useState } from "react";
import { tick } from "@chrishayuk/hause/sound";
import {
	QWEN,
	LAYERS,
	DELTANET_OPERANDS,
	ATTENTION_OPERANDS,
	FFN_PARTS,
	DOWN_PROJ,
	mixerAt,
	type Operand,
} from "@/data/qwen38";

/**
 * The model browser: Qwen3.8 → layer → feed-forward → down projection
 * → weights, one click per level. The point is that the descent is
 * legible with the sound off — you can see a model being opened, and
 * arrive at the thing quantization actually acts on.
 *
 * Every level reads the same declared record the CLI does. The layer
 * list is the graph's per-layer operator, never a guess from which
 * tensors a layer ships; the bits shown at the leaves are the ones the
 * current precision programme chose, and the page says chose rather
 * than needed, because no measurement has promoted that yet.
 */

const MONO = "voice-evidence text-xs sm:text-sm";

type View =
	| { kind: "stack" }
	| { kind: "layer"; layer: number }
	| { kind: "mixer"; layer: number }
	| { kind: "ffn"; layer: number }
	| { kind: "proj"; layer: number; part: (typeof FFN_PARTS)[number]["id"] };

function bits(b: number | null) {
	return b === null ? "—" : b.toFixed(2);
}

export function ModelBrowser() {
	const [path, setPath] = useState<View[]>([{ kind: "stack" }]);
	const current = path[path.length - 1];

	const push = (v: View) => {
		setPath([...path, v]);
		tick();
	};

	const rowClass =
		"graph-pulse grid grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-4 sm:gap-8 border px-4 sm:px-6 py-3 text-left group";

	const crumbs = (
		<div className="flex items-baseline gap-2 flex-wrap mb-6">
			{path.map((v, i) => {
				const last = i === path.length - 1;
				const label =
					v.kind === "stack"
						? QWEN.display
						: v.kind === "layer"
							? `layer ${v.layer}`
							: v.kind === "mixer"
								? "token mixer"
								: v.kind === "ffn"
									? "feed-forward"
									: v.part.toLowerCase();
				return (
					<button
						key={i}
						onClick={() => setPath(path.slice(0, i + 1))}
						className="voice-evidence text-xs tracking-[0.08em]"
						style={{ color: last ? undefined : "var(--color-accent)" }}
					>
						{label}
						{last ? "" : " /"}
					</button>
				);
			})}
			{path.length > 1 && (
				<button
					onClick={() => setPath(path.slice(0, -1))}
					className="voice-evidence text-xs tracking-[0.1em] uppercase opacity-50 ml-4"
				>
					← up
				</button>
			)}
		</div>
	);

	const note = (text: string) => (
		<p className="voice-system text-sm opacity-70 leading-relaxed max-w-2xl mt-5">{text}</p>
	);

	const operandTable = (ops: Operand[]) => (
		<div className="flex flex-col gap-2">
			{ops.map((o, i) => (
				<div
					key={o.semantics}
					className="graph-pulse grid grid-cols-[minmax(0,1fr)_auto_auto] items-baseline gap-4 sm:gap-8 border px-4 sm:px-6 py-3"
					style={{ borderColor: "var(--color-mist)", animationDelay: `${i * 40}ms` }}
				>
					<span className={MONO}>{o.semantics}</span>
					<span className="voice-evidence text-[10px] tracking-[0.1em] uppercase opacity-50 whitespace-nowrap">
						{o.note ?? o.column}
					</span>
					<span className={`${MONO} w-14 text-right opacity-70`}>{bits(o.bits)}</span>
				</div>
			))}
		</div>
	);

	let body: React.ReactNode;

	switch (current.kind) {
		case "stack":
			body = (
				<>
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
						{LAYERS.map((l) => (
							<button
								key={l.index}
								onClick={() => push({ kind: "layer", layer: l.index })}
								className="graph-pulse border px-3 py-2 text-left group"
								style={{
									borderColor: l.mixer === "GATED ATTENTION" ? "var(--color-accent)" : "var(--color-mist)",
									animationDelay: `${l.index * 8}ms`,
								}}
							>
								<span className={`${MONO} opacity-50 mr-2`}>{l.index}</span>
								<span className="voice-evidence text-[10px] tracking-[0.08em] uppercase">
									{l.mixer === "GATED ATTENTION" ? "ATTN" : "GDN"}
								</span>
							</button>
						))}
					</div>
					{note(
						`${QWEN.layers} language layers, and they do not all run the same programme. Three mix tokens with a Gated DeltaNet recurrence, then one uses gated attention — repeated sixteen times. The label comes from the operator each layer declares in the graph, never from which tensors it happens to ship.`
					)}
				</>
			);
			break;

		case "layer": {
			const m = mixerAt(current.layer);
			body = (
				<>
					<div className="flex flex-col gap-2">
						<button
							onClick={() => push({ kind: "mixer", layer: current.layer })}
							className={rowClass}
							style={{ borderColor: "var(--fg)", background: "var(--bg)" }}
						>
							<span className="voice-evidence text-[10px] tracking-[0.1em] uppercase opacity-50 w-28">TOKEN MIXER</span>
							<span className={MONO}>{m}</span>
							<span className={`${MONO} opacity-40`}>→</span>
						</button>
						<button
							onClick={() => push({ kind: "ffn", layer: current.layer })}
							className={rowClass}
							style={{ borderColor: "var(--fg)", background: "var(--bg)" }}
						>
							<span className="voice-evidence text-[10px] tracking-[0.1em] uppercase opacity-50 w-28">FEED-FORWARD</span>
							<span className={MONO}>DENSE</span>
							<span className={`${MONO} opacity-40`}>→</span>
						</button>
					</div>
					{note(
						"A layer is two programmes: something that mixes information between positions, and something that transforms each position on its own. Open either."
					)}
				</>
			);
			break;
		}

		case "mixer": {
			const m = mixerAt(current.layer);
			body = (
				<>
					<p className={`${MONO} mb-4 opacity-60`}>
						layer {current.layer} · token mixer {m}
					</p>
					{operandTable(m === "GATED DELTANET" ? DELTANET_OPERANDS : ATTENTION_OPERANDS)}
					{note(
						m === "GATED DELTANET"
							? "The recurrence does have queries, keys and values — fused into one projection and fed through a delta-rule state update. They are not the q, k, v of softmax attention, and asking this layer for attention.q refuses by naming the operator the graph declares. The three sixteen-bit rows are the current programme's stated decisions, not a measured requirement."
							: "Gated attention: the output gate is declared once on the component's execution surface, which is why these layers read GATED ATTENTION rather than SOFTMAX ATTENTION. Every operand here is compiled."
					)}
				</>
			);
			break;
		}

		case "ffn":
			body = (
				<>
					<div className="flex flex-col gap-2">
						{FFN_PARTS.map((p, i) => (
							<button
								key={p.id}
								onClick={() => push({ kind: "proj", layer: current.layer, part: p.id })}
								className={rowClass}
								style={{ borderColor: "var(--fg)", background: "var(--bg)", animationDelay: `${i * 60}ms` }}
							>
								<span className={`${MONO} w-16`}>{p.id}</span>
								<span className="voice-evidence text-[10px] tracking-[0.1em] uppercase opacity-50">{p.role}</span>
								<span className={`${MONO} opacity-70`}>{bits(p.bits)}</span>
							</button>
						))}
					</div>
					{note(
						"Three matrices with three jobs. Gate modulates the activation, up expands it, down projects the result back toward the residual stream. Each is addressed by that role, not by a filename."
					)}
				</>
			);
			break;

		case "proj": {
			const part = FFN_PARTS.find((p) => p.id === current.part)!;
			const isDown = part.id === "DOWN";
			body = (
				<>
					<div className="border px-5 py-4 sm:px-7 sm:py-6" style={{ borderColor: "var(--color-mist)" }}>
						<pre className={`${MONO} leading-relaxed whitespace-pre overflow-x-auto m-0`}>
							{[
								`role           ${part.role}`,
								`object         ${DOWN_PROJ.object}`,
								isDown ? `tensor         ${DOWN_PROJ.tensor}` : `tensor         ${current.layer}.mlp.${part.id.toLowerCase()}_proj.weight`,
								isDown ? `shape          ${DOWN_PROJ.shape}` : `shape          —`,
							].join("\n")}
						</pre>
						<div className="mt-5 flex flex-col gap-2">
							{DOWN_PROJ.representations.map((r) => (
								<div key={r.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-4">
									<span className={`${MONO} w-16`}>{r.id}</span>
									<span className="voice-evidence text-[10px] tracking-[0.1em] uppercase opacity-50">{r.fidelity}</span>
									<span className={`${MONO} opacity-70`}>{r.bits.toFixed(4)} bits/weight</span>
								</div>
							))}
						</div>
					</div>

					{isDown && (
						<div className="mt-4 border px-5 py-4 sm:px-7 sm:py-6" style={{ borderColor: "var(--color-mist)" }}>
							<p className="voice-evidence text-[10px] tracking-[0.14em] uppercase opacity-50 mb-3">
								WEIGHTS — first eight values
							</p>
							<pre className={`${MONO} leading-relaxed whitespace-pre overflow-x-auto m-0`}>
								{DOWN_PROJ.values.map((v) => (v < 0 ? "  " : "  +") + v.toFixed(6)).join("\n")}
							</pre>
						</div>
					)}

					{note(
						isDown
							? "This is what the model is physically made from, and what quantization actually acts on. Two representations of one component are catalogued here: the canonical bytes, and the compiled ones. The identity did not change when the second was compiled."
							: "The same addressing reaches every projection by role. Only the down projection carries recorded values on this page."
					)}
				</>
			);
			break;
		}
	}

	return (
		<div className="hause-grid py-12 sm:py-16">
			<div className="col-span-12 md:col-start-2 md:col-span-10">
				{crumbs}
				{body}
			</div>
		</div>
	);
}
