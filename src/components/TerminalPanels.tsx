"use client";

import type { TerminalPanel } from "@chrishayuk/hause/components/forms/Terminal";
import { DOWN_PROJ_8, DOWN_PROJ_COLLAPSED, DOWN_PROJ_STATS, RECORDED_TAG } from "@/data/recordedRuns";

/**
 * THE DESIGNED RESULTS — builders from typed data to TerminalPanel.
 *
 * Each builder takes the structured object (fetched from the live
 * protocol endpoints, or shaped from the snapshot's worked example)
 * and returns the three views at once: DESIGNED (the HAUSE
 * rendering), RAW (the object itself — the proof), and GRAPH where
 * the result has knowledge-graph grounding. The builders never fetch;
 * transports supply the data, so both render identically.
 */

type GraphRow = { from: string; rel: string; to: string };

function Kicker({ children }: { children: React.ReactNode }) {
	return <p className="voice-evidence text-[10px] tracking-[0.12em] uppercase opacity-50 m-0 mb-2">{children}</p>;
}

function Row({ cols, accent, dim }: { cols: (string | number)[]; accent?: boolean; dim?: boolean }) {
	return (
		<div
			className="grid gap-3 py-1.5 border-t"
			style={{
				gridTemplateColumns: `minmax(0,1.4fr) repeat(${cols.length - 1}, minmax(0,1fr))`,
				borderColor: "var(--color-mist)",
				opacity: dim ? 0.55 : 1,
			}}
		>
			{cols.map((c, i) => (
				<span
					key={i}
					className="voice-evidence text-[11px] break-words"
					style={{ color: i === 0 && accent ? "var(--color-accent)" : "var(--fg)" }}
				>
					{c}
				</span>
			))}
		</div>
	);
}

/* ── SHOW COMPONENTS ── */

export type ComponentsData = {
	components: {
		id: string;
		role: string;
		num_layers: number;
		hidden_size: number;
		full_layers?: number | null;
		sliding_layers?: number | null;
		recurrent_layers?: number | null;
		window?: number | null;
	}[];
	objects: number;
	edges: number;
	coherent: boolean;
};

/**
 * The Explorer serves whichever model the URL names. Granite is the
 * default and carries both storage and quality evidence; Qwen carries
 * storage only, and the panels say so rather than filling the gap.
 * A model with no record is refused by name — the same standing rule
 * the quantization chapter follows.
 */
import {
	REPRESENTATIONS as QWEN_REPS,
	VERIFY as QWEN_VERIFY,
	DIFF as QWEN_DIFF,
	DOWN_PROJ_NVFP4,
	DOWN_PROJ_NVFP4_COLLAPSED,
	DOWN_PROJ_STATS as QWEN_TENSOR,
	PRECISION_MAP as QWEN_MAP,
	DECODER_STACK as QWEN_STACK,
	QWEN,
} from "@/data/qwen38";

/** Which model's record a panel should speak. `null` = the default. */
export type PanelModel = "qwen3.8-27b" | null;

const QWEN_TAG = "recorded — qwen3.8-27b.s6.vindex3 · storage measured, quality not established";

export function componentsPanel(data: ComponentsData, provenance: string): TerminalPanel {
	return {
		designed: (
			<div>
				<Kicker>THE SYSTEM GRAPH&apos;S CENSUS · {provenance}</Kicker>
				<Row cols={["component", "role", "layers", "hidden", "attention"]} dim />
				{data.components.map((c) => {
					const census = [
						c.full_layers ? `${c.full_layers} full` : null,
						c.sliding_layers ? `${c.sliding_layers} sliding${c.window ? ` (w${c.window})` : ""}` : null,
						c.recurrent_layers ? `${c.recurrent_layers} recurrent` : null,
					]
						.filter(Boolean)
						.join(" · ");
					return <Row key={c.id} cols={[c.id, c.role, c.num_layers, c.hidden_size, census || "—"]} accent />;
				})}
				<p className="voice-evidence text-[10px] opacity-45 mt-3 mb-0">
					{data.objects} object(s) · {data.edges} hidden-state edge(s) ·{" "}
					{data.coherent ? "coherent — every fact above is graph data" : "coherence defects present"}
				</p>
			</div>
		),
		raw: data,
		graph: [
			{ from: "the container", rel: "carries", to: "the system graph" },
			{ from: "the system graph", rel: "contains", to: "components · objects · edges" },
			{ from: "meaning", rel: "judged once, stored verbatim in", to: "the container" },
		],
	};
}

/* ── SHOW REPRESENTATIONS ── */

export type RepresentationsData = {
	entries: { id: string; object: string; encoding: string; tensor_count: number; payload_bytes: number; compiled_from?: string | null }[];
};

export function representationsPanel(data: RepresentationsData, provenance: string): TerminalPanel {
	return {
		designed: (
			<div>
				<Kicker>THE PHYSICAL DIRECTORY · {provenance}</Kicker>
				<Row cols={["representation", "encoding", "tensors", "bytes"]} dim />
				{data.entries.slice(0, 12).map((e) => (
					<Row
						key={e.id}
						cols={[e.id + (e.compiled_from ? " (compiled)" : ""), e.encoding, e.tensor_count, e.payload_bytes.toLocaleString()]}
						accent
					/>
				))}
				<p className="voice-evidence text-[10px] opacity-45 mt-3 mb-0">
					presence is physical — a variant listed here exists as bytes; selecting an absent one fails closed
				</p>
			</div>
		),
		raw: data,
		graph: [
			{ from: "a region set", rel: "carries", to: "physically present variants" },
			{ from: "a profile", rel: "selects — never converts", to: "a present variant" },
			{ from: "fidelity", rel: "recorded against", to: "the source, at extraction" },
		],
	};
}

/* ── SHOW PROVENANCE ── */

export type ProvenanceData = {
	authority: string;
	derived_from_model?: string | null;
	entries: { id: string; object: string; segment?: string; payload_sha256: string; segment_sha256: string; compiled_from?: string | null }[];
};

export function provenancePanel(data: ProvenanceData, provenance: string): TerminalPanel {
	return {
		designed: (
			<div>
				<Kicker>HASHES AND LINEAGE — DIGESTS WHOLE · {provenance}</Kicker>
				{data.entries.slice(0, 6).map((e) => (
					<div key={e.id} className="border-t py-2" style={{ borderColor: "var(--color-mist)" }}>
						<p className="voice-evidence text-[11px] m-0" style={{ color: "var(--color-accent)" }}>{e.id}</p>
						<p className="voice-evidence text-[10px] opacity-70 m-0 mt-1 break-all">payload {e.payload_sha256}</p>
						<p className="voice-evidence text-[10px] opacity-70 m-0 break-all">segment {e.segment_sha256}</p>
						<p className="voice-evidence text-[10px] opacity-45 m-0">
							{e.compiled_from ? `compiled from ${e.compiled_from}` : "from the source checkpoint — no earlier container-side authority"}
						</p>
					</div>
				))}
				<p className="voice-evidence text-[10px] opacity-45 mt-3 mb-0">
					recorded at encode · re-hashed at verify — drift and corruption fail differently, by name
				</p>
			</div>
		),
		raw: data,
		graph: [
			{ from: "every representation", rel: "records", to: "payload + segment SHA-256" },
			{ from: "verification", rel: "re-hashes", to: "both ends, forever" },
			{ from: "the container", rel: "is", to: "a chain of custody, not a warehouse" },
		],
	};
}

/* ── SHOW AUTHORITY ── */

export type AuthorityData = { authority: string; derived_from_model?: string | null; profiles: string[] };

export function authorityPanel(data: AuthorityData, provenance: string): TerminalPanel {
	return {
		designed: (
			<div>
				<Kicker>THE CONTAINER&apos;S OWN DECLARATION · {provenance}</Kicker>
				<p className="voice-editorial text-lg m-0" style={{ color: "var(--color-accent)" }}>
					{data.authority === "canonical" ? "CANONICAL" : "DERIVED"}
				</p>
				<p className="voice-system text-sm opacity-80 m-0 mt-1 max-w-xl">
					{data.authority === "canonical"
						? "Source bytes present; derived representations can be recompiled."
						: "Executable; not re-compilable — and it says so, which is the difference between missing something and never promising it."}
				</p>
				{data.derived_from_model && (
					<p className="voice-evidence text-[11px] opacity-60 m-0 mt-2">derives from {data.derived_from_model}</p>
				)}
				{data.profiles.length > 0 && (
					<p className="voice-evidence text-[11px] opacity-60 m-0 mt-2">profiles: {data.profiles.join(" · ")}</p>
				)}
			</div>
		),
		raw: data,
		graph: [
			{ from: "authority", rel: "derived by a fold, never", to: "asserted" },
			{ from: "a profile", rel: "cannot claim above", to: "its derived fidelity" },
		],
	};
}

/* ── STATS ── */

export function statsPanel(json: Record<string, unknown>, provenance: string): TerminalPanel {
	const pick = (k: string) => (json[k] === undefined || json[k] === null ? "—" : String(json[k]));
	return {
		designed: (
			<div>
				<Kicker>THE BINDING, AS IT DECLARES ITSELF · {provenance}</Kicker>
				<Row cols={["model", pick("model")]} accent />
				<Row cols={["generation", pick("generation")]} />
				<Row cols={["component", pick("component")]} />
				<Row cols={["layers", pick("layers")]} />
				<Row cols={["hidden size", pick("hidden_size")]} />
				<Row cols={["vocab", pick("vocab_size")]} />
				<Row cols={["output head", json["has_output_head"] ? "present" : "absent"]} />
			</div>
		),
		raw: json,
	};
}

/* ── TREE ── */

export function treePanel(layer: number, special: boolean, provenance: string, raw: unknown): TerminalPanel {
	const rows: { depth: number; label: string; note: string; accent?: boolean; dim?: boolean }[] = [
		{ depth: 0, label: `layer.${layer}`, note: "", accent: true },
		{ depth: 1, label: "attention", note: "q · k · v · output — the layer looking backwards" },
		{ depth: 1, label: "norm ×2", note: "keep the numbers in range", dim: true },
		{ depth: 1, label: "router", note: "32 candidates · 4 chosen per token" },
		{ depth: 1, label: "experts ×32", note: "gate · up · down, each" },
		{ depth: 2, label: "gate_up", note: `consumed together, stored together${special ? " · 2 representations" : ""}`, accent: special },
		{ depth: 2, label: "down", note: "consumed apart, stored apart", dim: true },
	];
	return {
		designed: (
			<div>
				<Kicker>THE STRUCTURE, AS A TREE · {provenance}</Kicker>
				{rows.map((r, i) => (
					<p
						key={i}
						className="voice-evidence text-[12px] m-0 py-0.5"
						style={{
							paddingLeft: r.depth * 18,
							color: r.accent ? "var(--color-accent)" : "var(--fg)",
							opacity: r.dim ? 0.55 : 1,
						}}
					>
						{r.depth > 0 ? "├─ " : ""}
						{r.label}
						{r.note && <span className="opacity-50">&nbsp;&nbsp;{r.note}</span>}
					</p>
				))}
				<p className="voice-evidence text-[10px] opacity-45 mt-2 mb-0">
					every edge is data in the container — DESCRIBE any part: layer.{layer}.ffn.gate · layer.{layer}.attention.q
				</p>
			</div>
		),
		raw,
		graph: [
			{ from: "a layer", rel: "contains", to: "attention · feed-forward · norms" },
			{ from: "an expert", rel: "is", to: "another gate–up–down triple" },
			{ from: "the residual stream", rel: "receives, never surrenders to", to: "each result" },
		],
	};
}

/* ── SHOW PRECISION — the recorded map from the quantization chapter ── */

export function precisionPanel(model: PanelModel = null): TerminalPanel {
	if (model === "qwen3.8-27b") {
		return {
			designed: (
				<div>
					<Kicker>THE PRECISION MAP · {QWEN_TAG}</Kicker>
					{QWEN_MAP.map((prog) => (
						<div key={prog.label} className="mb-3">
							<p className="voice-evidence text-[10px] tracking-[0.1em] uppercase m-0 mb-1" style={{ color: "var(--color-accent)" }}>
								{prog.label} · {prog.layers} layers
							</p>
							<Row cols={["layers", ...prog.columns.map((c) => c.id)]} dim />
							<Row cols={[prog.span, ...prog.columns.map((c) => c.bits.toFixed(2))]} accent />
						</div>
					))}
					<p className="voice-evidence text-[10px] opacity-45 mt-3 mb-0">
						two programmes, two tables — {QWEN.display} does not have one row that describes it, and therefore does
						not have a bit-width. effective {QWEN_STACK.effectiveBits} bits/weight over the decoder stack.
					</p>
					<p className="voice-evidence text-[10px] opacity-45 mt-1 mb-0">
						the 16.00 cells are what this programme chose, not what was proven necessary
					</p>
				</div>
			),
			raw: {
				artifact: "qwen3.8-27b.s6.vindex3 — recorded run",
				programmes: QWEN_MAP,
				effective_bits_per_weight: QWEN_STACK.effectiveBits,
			},
		};
	}

	const operands = ["mlp.down", "mlp.gate", "mlp.up", "attn.k", "attn.o", "attn.q", "attn.v"];
	const raw = {
		artifact: "granite-late5.vindex3 — recorded run, the quantization chapter's artifact",
		map: [
			{ layers: "0-34", ...Object.fromEntries(operands.map((o) => [o, 4.5])) },
			{ layers: "35-39", "mlp.down": 16, "mlp.gate": 16, "mlp.up": 16, "attn.k": 4.5, "attn.o": 4.5, "attn.q": 4.5, "attn.v": 4.5 },
		],
		stored_bytes: 2221671460,
		weights: 3145728000,
		effective_bits_per_weight: 5.65,
	};
	return {
		designed: (
			<div>
				<Kicker>THE PRECISION MAP · recorded — granite-4.1-3b (the quantization chapter&apos;s artifact)</Kicker>
				<Row cols={["layers", ...operands]} dim />
				<Row cols={["0–34", "4.50", "4.50", "4.50", "4.50", "4.50", "4.50", "4.50"]} />
				<Row cols={["35–39", "16.00", "16.00", "16.00", "4.50", "4.50", "4.50", "4.50"]} accent />
				<p className="voice-evidence text-[11px] mt-3 mb-0" style={{ color: "var(--color-accent)" }}>
					effective 5.6500 bits / weight · 2.069 GiB stored over 3,145,728,000 weights
				</p>
				<p className="voice-evidence text-[10px] opacity-45 mt-1 mb-0">
					a compiled program inside the file, not a flag at load time — execution honours it over the backend&apos;s request
				</p>
			</div>
		),
		raw,
		graph: [
			{ from: "the precision map", rel: "compiles", to: "role-based eligibility + exceptions, first match decides" },
			{ from: "precision", rel: "is a property of", to: "components — never a label on the model" },
			{ from: "the map", rel: "answers to", to: "measured evidence on the Record" },
		],
	};
}

/* ── EXPLAIN REPRESENTATION — the policy, resolving ── */

export function explainRepresentationPanel(address: string): TerminalPanel {
	const m = address.toLowerCase().match(/^layer\.(\d+)\.(mlp|ffn)\.(down|gate|up)/);
	const layer = m ? Number(m[1]) : null;
	const protectedHit = layer !== null && layer >= 35 && layer <= 39;
	const known = m !== null && layer !== null && layer <= 39;
	const selected = known && protectedHit ? "BF16 · 16 bits / weight" : "NVFP4 · 4.5 bits / weight";
	const rule = known && protectedHit ? "protect mlp.*@35-39 — rule 3, matched first" : "no exception matched — the default encoding applies";
	const raw = {
		artifact: "granite-late5.vindex3 — recorded policy, the quantization chapter's artifact",
		component: address,
		role: known ? { down: "FfnDown", gate: "FfnGate", up: "FfnUp" }[m![3]] : "unknown to this map",
		default: "NVFP4 · 4.5 bits / weight",
		matched_rule: known ? rule : null,
		selected: known ? selected : null,
		order: "exceptions matched in declaration order — first match decides",
	};
	if (!known) {
		return {
			designed: (
				<div>
					<Kicker>EXPLAIN REPRESENTATION · recorded — granite-4.1-3b</Kicker>
					<p className="voice-system text-sm opacity-80 m-0 max-w-xl">
						{address} is not an FFN address this map speaks for — try layer.0.mlp.down through layer.39.mlp.up. The
						map is a policy over roles, and it only answers for what it governs.
					</p>
				</div>
			),
			raw,
		};
	}
	return {
		designed: (
			<div>
				<Kicker>THE POLICY, RESOLVING · recorded — granite-4.1-3b</Kicker>
				<Row cols={["component", address]} accent />
				<Row cols={["role", String(raw.role)]} />
				<Row cols={["default", "NVFP4 · 4.5 bits / weight"]} />
				<Row cols={["matched rule", rule]} accent={protectedHit} />
				<Row cols={["selected", selected]} accent />
				<p className="voice-evidence text-[10px] opacity-45 mt-3 mb-0">
					a precision map is a compiled program: a default, role-based eligibility, and exceptions matched in
					declaration order — first match decides. Not a table: explainable policy.
				</p>
			</div>
		),
		raw,
		graph: [
			{ from: address, rel: "governed by", to: "the precision map" },
			{ from: "the map", rel: "resolves by", to: "first matching rule" },
			{ from: "the selection", rel: "is a physical fact in", to: "the file" },
		],
	};
}

/* ── DIFF — original against reconstructed, from the recorded run ── */

const f6 = (v: number) => (v >= 0 ? "+" : "") + v.toFixed(6);

export function diffPanel(address: string, model: PanelModel = null): TerminalPanel {
	if (model === "qwen3.8-27b") {
		const known = /layer\.0\.(mlp|ffn)\.down/i.test(address) || /down_proj/i.test(address);
		if (!known) {
			return {
				designed: (
					<div>
						<Kicker>DIFF · {QWEN_TAG}</Kicker>
						<p className="voice-system text-sm opacity-80 m-0 max-w-xl">
							The recorded diff covers {QWEN_TENSOR.tensor}. This page refuses to invent values no run produced.
						</p>
					</div>
				),
				raw: { address, recorded: QWEN_TENSOR.tensor },
			};
		}
		return {
			designed: (
				<div>
					<Kicker>BF16 → NVFP4 · {QWEN_DIFF.tensor} · {QWEN_TAG}</Kicker>
					<Row cols={["original", "reconstructed", "error"]} dim />
					{DOWN_PROJ_NVFP4.map((w, i) => (
						<Row
							key={i}
							cols={[
								w.original.toFixed(6),
								w.nvfp4.toFixed(6),
								(w.nvfp4 - w.original).toFixed(6),
							]}
							accent={DOWN_PROJ_NVFP4_COLLAPSED.has(i)}
						/>
					))}
					<p className="voice-evidence text-[10px] opacity-45 mt-3 mb-0">
						rows 3 and 5 are distinct inputs landing on the same −0.014590 — the information is gone, not merely
						rounded
					</p>
					<p className="voice-evidence text-[10px] opacity-45 mt-1 mb-0">
						over the whole tensor: {QWEN_DIFF.changed.toLocaleString()} of {QWEN_DIFF.weights.toLocaleString()}{" "}
						values differ · rms {QWEN_DIFF.rms} · max {QWEN_DIFF.max}
					</p>
				</div>
			),
			raw: { ...QWEN_DIFF, values: DOWN_PROJ_NVFP4 },
		};
	}

	const known = /layer\.0\.(mlp|ffn)\.down/i.test(address) || /down_proj/i.test(address);
	if (!known) {
		return {
			designed: (
				<div>
					<Kicker>DIFF · {RECORDED_TAG}</Kicker>
					<p className="voice-system text-sm opacity-80 m-0 max-w-xl">
						The recorded diff covers {DOWN_PROJ_STATS.tensor} — the tensor the quantization chapter opens. Per-value
						diffs of arbitrary addresses arrive with the vindex CLI&apos;s decoder work; this page refuses to invent
						values no run produced.
					</p>
				</div>
			),
			raw: { address, recorded: DOWN_PROJ_STATS.tensor },
		};
	}
	return {
		designed: (
			<div>
				<Kicker>BF16 → NVFP4 · {DOWN_PROJ_STATS.tensor} · {RECORDED_TAG}</Kicker>
				<Row cols={["original", "reconstructed", "error"]} dim />
				{DOWN_PROJ_8.map((w, i) => (
					<div
						key={i}
						className="grid gap-3 py-1 border-t"
						style={{
							gridTemplateColumns: "repeat(3, minmax(0,1fr))",
							borderColor: "var(--color-mist)",
							color: DOWN_PROJ_COLLAPSED.has(i) ? "var(--color-accent)" : "var(--fg)",
						}}
					>
						<span className="voice-evidence text-[11px]">{f6(w.original)}</span>
						<span className="voice-evidence text-[11px]">{f6(w.nvfp4)}</span>
						<span className="voice-evidence text-[11px] opacity-60">{f6(w.nvfp4 - w.original)}</span>
					</div>
				))}
				<p className="voice-evidence text-[11px] mt-3 mb-0" style={{ color: "var(--color-accent)" }}>
					three inputs, one output — the lit rows all reconstruct as −0.002106
				</p>
				<p className="voice-evidence text-[10px] opacity-45 mt-1 mb-0">
					over all {DOWN_PROJ_STATS.weights.toLocaleString()} weights: rms {DOWN_PROJ_STATS.rms_error} · max{" "}
					{DOWN_PROJ_STATS.max_error} · {DOWN_PROJ_STATS.ratio}
				</p>
			</div>
		),
		raw: { address: DOWN_PROJ_STATS.tensor, rows: DOWN_PROJ_8, stats: DOWN_PROJ_STATS },
		graph: [
			{ from: "the identity", rel: "is unchanged across", to: "BF16 · NVFP4" },
			{ from: "the information loss", rel: "is", to: "deliberate and permanent — not compression" },
			{ from: "fidelity", rel: "recorded against", to: "the source, at extraction" },
		],
	};
}

/* ── VERIFY — the demo container against its own record ── */

export function verifyPanel(model: PanelModel = null): TerminalPanel {
	if (model === "qwen3.8-27b") {
		return {
			designed: (
				<div>
					<Kicker>VERIFY · recorded — vindex verify, qwen3.8-27b · 2026-08-31</Kicker>
					{QWEN_VERIFY.entries.map((e) => (
						<div key={e} className="flex items-baseline justify-between py-0.5 border-t" style={{ borderColor: "var(--color-mist)" }}>
							<span className="voice-evidence text-[11px]">{e}</span>
							<span className="voice-evidence text-[11px]" style={{ color: "var(--color-status-supported)" }}>
								ok
							</span>
						</div>
					))}
					<p className="voice-evidence text-[11px] mt-3 mb-0" style={{ color: "var(--color-status-supported)" }}>
						verified yes — the artifact agrees with its own record
					</p>
					<p className="voice-evidence text-[10px] opacity-45 mt-1 mb-0">scope: {QWEN_VERIFY.scope}</p>
					<p
						className="voice-evidence text-[10px] mt-3 mb-0 pt-2 border-t"
						style={{ borderColor: "var(--color-mist)", color: "var(--color-status-ongoing)" }}
					>
						this is a recorded verification, not one performed in your browser
					</p>
					<p className="voice-evidence text-[10px] opacity-45 mt-1 mb-0">
						it took 20 minutes against the real container, and it re-derives hashes from the container&apos;s own
						bytes — so it runs where the container is. Public evidence does not imply public weights.
					</p>
				</div>
			),
			raw: {
				entries: QWEN_VERIFY.entries.map((id) => ({ id, segment_ok: true, payload_ok: true })),
				failures: 0,
				scope: "self",
			},
		};
	}

	const entries = [
		"target.decoder_stack@F32",
		"target.embedding@F32",
		"target.final_norm@F32",
		"target.output_head@F32",
	];
	return {
		designed: (
			<div>
				<Kicker>VERIFY · recorded — vindex verify, vindex3-demo · 2026-08-30</Kicker>
				{entries.map((e) => (
					<div key={e} className="flex items-baseline justify-between py-0.5 border-t" style={{ borderColor: "var(--color-mist)" }}>
						<span className="voice-evidence text-[11px]">{e}</span>
						<span className="voice-evidence text-[11px]" style={{ color: "var(--color-status-supported)" }}>
							ok
						</span>
					</div>
				))}
				<p className="voice-evidence text-[11px] mt-3 mb-0" style={{ color: "var(--color-status-supported)" }}>
					verified yes — the artifact agrees with its own record
				</p>
				<p className="voice-evidence text-[10px] opacity-45 mt-1 mb-0">
					scope: self — recorded hashes re-derived from the artifact alone; source faithfulness is the reference
					implementation&apos;s G4
				</p>
				{/* The distinction this panel must not blur: the browser is
				    showing a verification that happened, not performing one.
				    Verifying requires the bytes, and the bytes are not here. */}
				<p
					className="voice-evidence text-[10px] mt-3 mb-0 pt-2 border-t"
					style={{ borderColor: "var(--color-mist)", color: "var(--color-status-ongoing)" }}
				>
					this is a recorded verification, not one performed in your browser
				</p>
				<p className="voice-evidence text-[10px] opacity-45 mt-1 mb-0">
					verifying re-derives hashes from the container&apos;s own bytes, so it runs where the container is:
					<span className="voice-evidence"> vindex verify &lt;container&gt;</span>. This surface holds the record
					of that run — public evidence does not imply public weights.
				</p>
			</div>
		),
		raw: {
			entries: entries.map((id) => ({ id, segment_ok: true, payload_ok: true })),
			failures: 0,
			verified: true,
			scope: "self — recorded hashes re-derived from the artifact alone",
		},
		graph: [
			{ from: "every segment", rel: "re-hashed against", to: "segment_sha256, recorded at encode" },
			{ from: "every payload region", rel: "re-hashed against", to: "payload_sha256" },
			{ from: "source faithfulness", rel: "remains", to: "G4 — needs the source, lives with the reference implementation" },
		],
	};
}

export type { GraphRow };
