/**
 * QWEN3.8-27B — the hero model's measured record.
 *
 * Every number here is measured, not illustrative: the container was
 * encoded 2026-08-30 at schema 6 and compiled to NVFP4 the same day
 * after the role-classifier fix. The one thing this file deliberately
 * does not carry is a fidelity figure — the canonical Q-BANK rerun on
 * the new CPU NVFP4 execution path has not returned, and a model page
 * that invents one is the exact failure the whole site argues against.
 */

export const QWEN = {
	slug: "qwen3.8-27b",
	display: "Qwen3.8-27B",
	layers: 64,
	hidden: 5120,
	schema: 6,
	authority: "canonical",
	/** Encoded with an explicit capability gate — see VISION below. */
	capability: "text-generation",
} as const;

/**
 * The token-mixer cadence, from the graph's declared per-layer
 * operator: DDD·F repeated sixteen times. Every full-attention layer
 * sits at N ≡ 3 (mod 4). Qwen declares its attention output gate on
 * the component's execution surface, so those layers render GATED
 * ATTENTION — not SOFTMAX ATTENTION.
 */
export type Mixer = "GATED DELTANET" | "GATED ATTENTION";

export function mixerAt(layer: number): Mixer {
	return layer % 4 === 3 ? "GATED ATTENTION" : "GATED DELTANET";
}

export const LAYERS = Array.from({ length: QWEN.layers }, (_, i) => ({
	index: i,
	mixer: mixerAt(i),
	ffn: "DENSE" as const,
}));

/** The five objects the container actually holds. No MTP surface. */
export const OBJECTS = [
	{ id: "target.decoder_stack", rep: "BF16", tensors: 848, bytes: 48_706_393_088 },
	{ id: "target.embedding", rep: "BF16", tensors: 1, bytes: 2_542_796_800 },
	{ id: "target.final_norm", rep: "BF16", tensors: 1, bytes: 10_240 },
	{ id: "target.output_head", rep: "BF16", tensors: 1, bytes: 2_542_796_800 },
	{ id: "vision.perception_tower", rep: "BF16", tensors: 333, bytes: 921_460_192 },
] as const;

export const COMPILE = {
	seconds: 97,
	reencoded: 400,
	carried: 448,
	decoderBefore: 48_706_393_088,
	decoderAfter: 13_736_385_088,
	decoderRatio: "3.54×",
	decoderBits: 4.5124,
	deployableBytes: 19_743_449_120,
	deployable: "18.4 GiB",
	original: "51.0 GiB",
	ratio: "2.77×",
} as const;

/**
 * Operands per mixer programme, with the bits/weight the current
 * precision programme chose. The three 16.00 cells are stated
 * decisions, not measured requirements — decay and write are the
 * recurrence's control path, conv is a 3-D depthwise kernel no
 * block-quantised layout fits.
 */
export type Operand = { semantics: string; column: string; bits: number | null; note?: string };

export const DELTANET_OPERANDS: Operand[] = [
	{ semantics: "fused recurrent q|k|v", column: "qkv", bits: 4.5 },
	{ semantics: "decay projection", column: "decay", bits: 16, note: "recurrence control — preserved by policy" },
	{ semantics: "write-strength projection", column: "write", bits: 16, note: "recurrence control — preserved by policy" },
	{ semantics: "output-gate projection", column: "zgate", bits: 4.5 },
	{ semantics: "causal conv over q|k|v", column: "conv", bits: 16, note: "3-D depthwise kernel — no block layout applies" },
	{ semantics: "log decay", column: "—", bits: null },
	{ semantics: "timestep bias", column: "—", bits: null },
	{ semantics: "gated norm", column: "—", bits: null },
	{ semantics: "output projection", column: "out", bits: 4.5 },
];

export const ATTENTION_OPERANDS: Operand[] = [
	{ semantics: "query", column: "q", bits: 4.5 },
	{ semantics: "key", column: "k", bits: 4.5 },
	{ semantics: "value", column: "v", bits: 4.5 },
	{ semantics: "output", column: "o", bits: 4.5 },
	{ semantics: "output gate", column: "zgate", bits: 4.5 },
];

export const FFN_PARTS = [
	{ id: "GATE", column: "gate", bits: 4.5, role: "FFN GATE PROJECTION" },
	{ id: "UP", column: "up", bits: 4.5, role: "FFN UP PROJECTION" },
	{ id: "DOWN", column: "down", bits: 4.5, role: "FFN DOWN PROJECTION" },
] as const;

/**
 * The leaf the film navigates to at 0:45. Values measured on
 * qwen3.8-27b.s6.vindex3 — re-run and re-paste if the container is
 * re-encoded.
 */
export const DOWN_PROJ = {
	role: "FFN DOWN PROJECTION",
	object: "target.decoder_stack",
	tensor: "0.mlp.down_proj.weight",
	shape: "[5120, 17408]",
	weights: 5120 * 17408,
	representations: [
		{ id: "BF16", fidelity: "canonical", bits: 16.0 },
		{ id: "NVFP4", fidelity: "approximate", bits: 4.5 },
	],
	values: [-0.001671, -0.000618, -0.01416, -0.004883, -0.014832, 0.013794, -0.020996, -0.012146],
} as const;

/** Surfaces the programme left at BF16. */
export const SURFACES = [
	{ id: "target.embedding", bits: 16.0 },
	{ id: "target.final_norm", bits: 16.0 },
	{ id: "target.output_head", bits: 16.0 },
	{ id: "vision.perception_tower", bits: 16.0 },
] as const;

/**
 * Whole-model admission refuses: the vision tower's vision_config
 * declares neither layer_norm_eps nor rms_norm_eps, so its norm
 * surface is undeclared and the encoder will not invent one. The text
 * stack is fully admissible; the vision bytes are carried untouched —
 * and preserved bytes are not evaluated behaviour.
 */
export const VISION = {
	admitted: false,
	reason: "vision_config declares neither layer_norm_eps nor rms_norm_eps",
	carried: true,
	fidelity: "NOT EVALUATED",
} as const;

export const RECORDED_TAG = "recorded — qwen3.8-27b.s6.vindex3 · encoded and compiled 2026-08-30";

/* ------------------------------------------------------------------
   QUANTIZATION FIGURES — measured 2026-08-31 by running the CLI
   against the real containers. `vindex diff` supplied the original and
   reconstructed values and the error; `vindex precision --matrix` the
   map; `vindex representations` the byte counts. Storage facts only:
   nothing here is quality evidence, and none of it licenses a claim
   about behaviour.
   ------------------------------------------------------------------ */

/** The film's tensor, under both representations. */
export const DOWN_PROJ_NVFP4: { original: number; nvfp4: number }[] = [
	{ original: -0.001671, nvfp4: -0.001824 },
	{ original: -0.000618, nvfp4: -0.0 },
	{ original: -0.01416, nvfp4: -0.01459 },
	{ original: -0.004883, nvfp4: -0.005471 },
	{ original: -0.014832, nvfp4: -0.01459 },
	{ original: 0.013794, nvfp4: 0.01459 },
	{ original: -0.020996, nvfp4: -0.021885 },
	{ original: -0.012146, nvfp4: -0.010943 },
];

/** Rows 2 and 4 are distinct inputs landing on the same −0.014590. */
export const DOWN_PROJ_NVFP4_COLLAPSED = new Set([2, 4]);

export const DOWN_PROJ_STATS = {
	tensor: "layer.0.mlp.down_proj",
	shape: "5,120 × 17,408",
	weights: 89_128_960,
	bf16_bytes: 178_257_920,
	rms_error: 0.001009,
	max_error: 0.060547,
	changed: 89_128_960,
} as const;

/**
 * The precision map as the CLI prints it: grouped by token-mixer
 * programme, each group carrying only the columns its programme
 * computes with. This is what makes Qwen's map structurally different
 * from a single-programme model's — there is no one row that describes
 * the model.
 */
export type Programme = {
	label: string;
	layers: number;
	span: string;
	columns: { id: string; bits: number }[];
};

export const PRECISION_MAP: Programme[] = [
	{
		label: "GATED DELTANET",
		layers: 48,
		span: "0–62",
		columns: [
			{ id: "gate", bits: 4.5 },
			{ id: "up", bits: 4.5 },
			{ id: "down", bits: 4.5 },
			{ id: "qkv", bits: 4.5 },
			{ id: "decay", bits: 16 },
			{ id: "write", bits: 16 },
			{ id: "zgate", bits: 4.5 },
			{ id: "conv", bits: 16 },
			{ id: "out", bits: 4.5 },
		],
	},
	{
		label: "GATED ATTENTION",
		layers: 16,
		span: "3–63",
		columns: [
			{ id: "gate", bits: 4.5 },
			{ id: "up", bits: 4.5 },
			{ id: "down", bits: 4.5 },
			{ id: "q", bits: 4.5 },
			{ id: "k", bits: 4.5 },
			{ id: "v", bits: 4.5 },
			{ id: "o", bits: 4.5 },
			{ id: "zgate", bits: 4.5 },
		],
	},
];

export const DECODER_STACK = {
	bytes: 13_736_385_088,
	weights: 24_353_196_544,
	effectiveBits: 4.5124,
} as const;

/* ------------------------------------------------------------------
   EXPLORER RECORD — what the browser can show about this model.
   Measured with the CLI against the real container, 2026-08-31.
   ------------------------------------------------------------------ */

/** `vindex representations`, verbatim. */
export const REPRESENTATIONS = [
	{ id: "target.decoder_stack@BF16", encoding: "BF16", fidelity: "canonical", tensors: 848, bytes: 48_706_393_088 },
	{ id: "target.decoder_stack@NVFP4", encoding: "NVFP4", fidelity: "approximate", tensors: 848, bytes: 13_736_385_088 },
	{ id: "target.embedding@BF16", encoding: "BF16", fidelity: "canonical", tensors: 1, bytes: 2_542_796_800 },
	{ id: "target.final_norm@BF16", encoding: "BF16", fidelity: "canonical", tensors: 1, bytes: 10_240 },
	{ id: "target.output_head@BF16", encoding: "BF16", fidelity: "canonical", tensors: 1, bytes: 2_542_796_800 },
	{ id: "vision.perception_tower@BF16", encoding: "BF16", fidelity: "canonical", tensors: 333, bytes: 921_460_192 },
] as const;

/**
 * `vindex verify`, verbatim — all six representations `ok`, in
 * 20 min 00 s against the real container. The scope line is the
 * artifact's own, and it is the whole point: self-integrity is not
 * source faithfulness, and the container says which one it proved.
 */
export const VERIFY = {
	entries: REPRESENTATIONS.map((r) => r.id),
	verified: true,
	scope: "self — recorded hashes re-derived from the artifact alone; source faithfulness is the reference implementation's G4",
	seconds: 1200,
} as const;

/** `vindex diff BF16 NVFP4 layer.0.ffn.down`, verbatim. */
export const DIFF = {
	tensor: "0.mlp.down_proj.weight",
	weights: 89_128_960,
	changed: 89_128_960,
	rms: 0.001009,
	max: 0.060547,
} as const;
