/**
 * RECORDED RUNS — shared numbers from the banked quality records.
 *
 * One source for the granite-4.1-3b figures the quantization chapter,
 * the terminal's DIFF panel, and the video all show. Verbatim from
 * the recorded runs; nothing here is illustrative.
 */

export const DOWN_PROJ_8: { original: number; nvfp4: number }[] = [
	{ original: -0.01239, nvfp4: -0.012634 },
	{ original: -0.00296, nvfp4: -0.002106 },
	{ original: -0.016479, nvfp4: -0.016846 },
	{ original: -0.010132, nvfp4: -0.008423 },
	{ original: 0.022461, nvfp4: 0.025269 },
	{ original: -0.001228, nvfp4: -0.002106 },
	{ original: -0.002914, nvfp4: -0.002106 },
	{ original: -0.00589, nvfp4: -0.006317 },
];

/** Rows that collapse onto the same representable value (−0.002106). */
export const DOWN_PROJ_COLLAPSED = new Set([1, 5, 6]);

export const DOWN_PROJ_STATS = {
	tensor: "layer.0.mlp.down_proj",
	shape: "2,560 × 8,192",
	weights: 20_971_520,
	bf16_bytes: 41_943_040,
	nvfp4_bytes: 11_796_484,
	rms_error: 0.00148137,
	max_error: 0.01741537,
	ratio: "3.56× smaller",
} as const;

export const RECORDED_TAG = "recorded — granite-4.1-3b · the quantization chapter's artifact";
