/**
 * QUANTIZATION CHAPTER — which model's recorded numbers the page speaks.
 *
 * The chapter refuses to dress one model's numbers in another's name,
 * so every figure that is model-specific reads its values from here and
 * the page says whose they are. Two models are recorded, and they are
 * recorded to different depths — which the page must state rather than
 * smooth over:
 *
 *   granite-4.1-3b   storage AND quality (the banked quality records)
 *   qwen3.8-27b      storage AND quality — Q-BANK-1 returned 2026-08-31
 *
 * A model with `quality: false` renders the storage figures from its own
 * measurements and refuses the quality ones. That is the honest middle
 * state, and it is the one Qwen is in.
 */

import {
	DOWN_PROJ_NVFP4,
	DOWN_PROJ_NVFP4_COLLAPSED,
	DOWN_PROJ_STATS as QWEN_TENSOR,
	PRECISION_MAP as QWEN_MAP,
	DECODER_STACK as QWEN_STACK,
	type Programme,
} from "@/data/qwen38";
import {
	DOWN_PROJ_8,
	DOWN_PROJ_COLLAPSED,
	DOWN_PROJ_STATS as GRANITE_TENSOR,
} from "@/data/recordedRuns";

export type QuantModel = {
	slug: string;
	display: string;
	/** Whether banked quality evidence exists for this model. */
	quality: boolean;
	tensor: {
		address: string;
		shape: string;
		weights: number;
		bf16Bytes: number;
	};
	values: readonly { original: number; nvfp4: number }[];
	collapsed: ReadonlySet<number>;
	/** Grouped by token-mixer programme, as `vindex precision --matrix` prints it. */
	programmes: Programme[];
	stack: { bytes: number; weights: number; effectiveBits: number };
	/** Only shown where it exists — see `quality`. */
	throughput?: string;
};

const GRANITE: QuantModel = {
	slug: "granite-4.1-3b",
	display: "granite-4.1-3b",
	quality: true,
	tensor: {
		address: GRANITE_TENSOR.tensor,
		shape: GRANITE_TENSOR.shape,
		weights: GRANITE_TENSOR.weights,
		bf16Bytes: GRANITE_TENSOR.bf16_bytes,
	},
	values: DOWN_PROJ_8,
	collapsed: DOWN_PROJ_COLLAPSED,
	// One programme: every layer mixes tokens the same way, which is
	// exactly why a single row can describe the whole stack here and
	// cannot describe Qwen's.
	programmes: [
		{
			label: "SOFTMAX ATTENTION",
			layers: 40,
			span: "0–39",
			columns: [
				{ id: "mlp.down", bits: 4.5 },
				{ id: "mlp.gate", bits: 4.5 },
				{ id: "mlp.up", bits: 4.5 },
				{ id: "attn.k", bits: 4.5 },
				{ id: "attn.o", bits: 4.5 },
				{ id: "attn.q", bits: 4.5 },
				{ id: "attn.v", bits: 4.5 },
			],
		},
	],
	stack: { bytes: 2_221_671_460, weights: 3_145_728_000, effectiveBits: 4.5 },
	throughput: "uniform ≈116 tok/s · this map ≈104 tok/s · +400 MB · 3.5× better in the tail",
};

const QWEN: QuantModel = {
	slug: "qwen3.8-27b",
	display: "Qwen3.8-27B",
	quality: true,
	tensor: {
		address: QWEN_TENSOR.tensor,
		shape: QWEN_TENSOR.shape,
		weights: QWEN_TENSOR.weights,
		bf16Bytes: QWEN_TENSOR.bf16_bytes,
	},
	values: DOWN_PROJ_NVFP4,
	collapsed: DOWN_PROJ_NVFP4_COLLAPSED,
	programmes: QWEN_MAP,
	stack: QWEN_STACK,
};

export const QUANT_MODELS = [GRANITE, QWEN];
export const DEFAULT_MODEL = GRANITE;

/** `null` = a name nothing is recorded under; the page refuses it. */
export function quantModel(slug: string | undefined): QuantModel | null {
	if (!slug) return DEFAULT_MODEL;
	return QUANT_MODELS.find((m) => m.slug === slug) ?? null;
}
