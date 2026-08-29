"use client";

import { useRef, useState } from "react";
import { tick, settle } from "@chrishayuk/hause/sound";

/**
 * The interactive encoder: choose a recipe, and the actual LYRW v2
 * layout is computed and drawn live — header, descriptors, schemas,
 * entry table, then the payload to scale, with per-entry ticks so the
 * tensors inside the file are visible. ENCODE replays the file being
 * laid down structure by structure, in write order, at the hause
 * stagger. All byte arithmetic is the ABI's own: 24-byte header,
 * 24-byte bank descriptors, 12-byte segment descriptors, 20-byte
 * region schemas, 16-byte entry rows, payload offsets 64-byte aligned.
 *
 * Worked-example geometry (not a specific model): input/output 2048,
 * intermediate 6144 — dims divisible by 256 so block formats pack
 * exactly.
 */

const INPUT = 2048;
const INTER = 6144;

const FORMATS = [
	{ id: "bf16", bitsPerWeight: 16 },
	{ id: "q6_k", bitsPerWeight: 6.5625 },
	{ id: "q4_k", bitsPerWeight: 4.625 },
	{ id: "mxfp4", bitsPerWeight: 4.25 },
] as const;

const BANKS = [
	{ id: "dense", label: "dense · 1 entry", entries: 1 },
	{ id: "routed-8", label: "routed · 8 experts", entries: 8 },
	{ id: "routed-32", label: "routed · 32 experts", entries: 32 },
	{ id: "routed-128", label: "routed · 128 experts", entries: 128 },
] as const;

const REGION_SETS = [
	{
		id: "fused",
		label: "gate_up_fused + down",
		regions: [
			{ role: "gate_up_fused", rows: 2 * INTER, cols: INPUT },
			{ role: "down", rows: INPUT, cols: INTER },
		],
	},
	{
		id: "split",
		label: "gate + up + down",
		regions: [
			{ role: "gate", rows: INTER, cols: INPUT },
			{ role: "up", rows: INTER, cols: INPUT },
			{ role: "down", rows: INPUT, cols: INTER },
		],
	},
] as const;

function fmtBytes(n: number): string {
	if (n >= 1 << 30) return `${(n / (1 << 30)).toFixed(2)} GiB`;
	if (n >= 1 << 20) return `${(n / (1 << 20)).toFixed(1)} MiB`;
	if (n >= 1024) return `${(n / 1024).toFixed(1)} KiB`;
	return `${n} B`;
}

// The write-order phases ENCODE reveals, one per structure.
const PHASES = ["header", "bank descriptor", "segment descriptor", "region schemas", "entry table", "payload"] as const;

export function FileEncoder() {
	const [bankId, setBankId] = useState<(typeof BANKS)[number]["id"]>("routed-32");
	const [setId, setSetId] = useState<(typeof REGION_SETS)[number]["id"]>("fused");
	const [formatId, setFormatId] = useState<(typeof FORMATS)[number]["id"]>("mxfp4");
	// Resting state is the finished file; ENCODE replays the write.
	const [phase, setPhase] = useState<number>(PHASES.length);
	const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

	const bank = BANKS.find((b) => b.id === bankId)!;
	const regionSet = REGION_SETS.find((s) => s.id === setId)!;
	const format = FORMATS.find((f) => f.id === formatId)!;

	const schemaCount = regionSet.regions.length;
	const headerBytes = 24;
	const bankDescBytes = 24;
	const segDescBytes = 12;
	const schemasBytes = schemaCount * 20;
	const entryTableBytes = bank.entries * schemaCount * 16;
	const tablesBytes = headerBytes + bankDescBytes + segDescBytes + schemasBytes + entryTableBytes;
	const firstOffset = Math.ceil(tablesBytes / 64) * 64;

	const regions = regionSet.regions.map((r) => ({
		...r,
		bytesPerEntry: (r.rows * r.cols * format.bitsPerWeight) / 8,
	}));
	const payloadBytes = bank.entries * regions.reduce((a, r) => a + r.bytesPerEntry, 0);
	const totalBytes = firstOffset + payloadBytes;

	const encode = () => {
		timers.current.forEach(clearTimeout);
		timers.current = [];
		if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setPhase(PHASES.length);
			return;
		}
		setPhase(0);
		PHASES.forEach((_, i) => {
			timers.current.push(setTimeout(() => { setPhase(i + 1); if (i + 1 === PHASES.length) settle(); }, 300 + i * 450));
		});
	};

	const tableStructures = [
		{ name: "header", bytes: headerBytes, note: "24 B" },
		{ name: "bank desc", bytes: bankDescBytes, note: "24 B" },
		{ name: "seg desc", bytes: segDescBytes, note: "12 B" },
		{ name: "schemas", bytes: schemasBytes, note: `${schemaCount} × 20 B` },
		{ name: "entry table", bytes: entryTableBytes, note: `${bank.entries} × ${schemaCount} × 16 B` },
	];

	const chip = (active: boolean, onClick: () => void, label: string, key: string) => (
		<button
			key={key}
			onClick={() => { onClick(); tick(); }}
			aria-pressed={active}
			className="voice-evidence text-xs tracking-[0.06em] px-3 py-1.5 border"
			style={{
				borderColor: active ? "var(--color-accent)" : "var(--color-mist)",
				color: active ? "var(--color-accent)" : undefined,
			}}
		>
			{label}
		</button>
	);

	return (
		<section className="hause-grid py-20 sm:py-28">
			<div className="col-span-12 md:col-start-2 md:col-span-10 lg:col-span-9">
				<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-3 opacity-50">
					THE ENCODER — LAY OUT A FILE YOURSELF
				</p>
				<p className="voice-editorial text-2xl sm:text-3xl mb-10">
					Choose a recipe. The bytes follow.
				</p>

				<div className="flex flex-col gap-4 mb-10">
					<div className="flex items-baseline gap-3 flex-wrap">
						<span className="voice-evidence text-[10px] tracking-[0.1em] uppercase opacity-50 w-16 flex-none">bank</span>
						{BANKS.map((b) => chip(b.id === bankId, () => setBankId(b.id), b.label, b.id))}
					</div>
					<div className="flex items-baseline gap-3 flex-wrap">
						<span className="voice-evidence text-[10px] tracking-[0.1em] uppercase opacity-50 w-16 flex-none">regions</span>
						{REGION_SETS.map((s) => chip(s.id === setId, () => setSetId(s.id), s.label, s.id))}
					</div>
					<div className="flex items-baseline gap-3 flex-wrap">
						<span className="voice-evidence text-[10px] tracking-[0.1em] uppercase opacity-50 w-16 flex-none">format</span>
						{FORMATS.map((f) => chip(f.id === formatId, () => setFormatId(f.id), f.id, f.id))}
					</div>
				</div>

				<button
					onClick={() => { tick(); encode(); }}
					className="voice-system text-sm tracking-[0.06em] border-b pb-0.5 mb-10 w-fit"
					style={{ borderColor: "var(--color-accent)" }}
				>
					ENCODE →
				</button>

				{/* The tables zone — drawn magnified (it is a few KB in a file of MBs), and honest about it. */}
				<div className="mb-1 flex w-full" aria-hidden="true">
					{tableStructures.map((s, i) => (
						<div
							key={s.name}
							className="h-9 border-y border-l flex items-center justify-center overflow-hidden"
							style={{
								width: `${[10, 10, 8, 12, 24][i]}%`,
								borderColor: "var(--fg)",
								opacity: phase > i ? 1 : 0.12,
								transition: "opacity var(--motion-considered) var(--ease-hause)",
							}}
						>
							<span className="voice-evidence text-[9px] tracking-[0.06em] uppercase whitespace-nowrap px-1 opacity-60">
								{s.name}
							</span>
						</div>
					))}
					<div
						className="h-9 border flex-1 flex items-center justify-center"
						style={{
							borderColor: "var(--color-mist)",
							borderStyle: "dashed",
							opacity: phase > 4 ? 1 : 0.12,
							transition: "opacity var(--motion-considered) var(--ease-hause)",
						}}
					>
						<span className="voice-evidence text-[9px] tracking-[0.06em] uppercase opacity-50">align → 64 B</span>
					</div>
				</div>
				<p className="voice-evidence text-[10px] opacity-40 mb-6">
					tables drawn magnified — {fmtBytes(tablesBytes)} of structure ahead of {fmtBytes(payloadBytes)} of weights
				</p>

				{/* The payload, to scale by role — entry ticks make the tensors visible. */}
				<div className="flex w-full h-16 sm:h-20 mb-2" aria-hidden="true">
					{regions.map((r, ri) => (
						<div
							key={r.role}
							className="relative border-y border-l last:border-r overflow-hidden"
							style={{
								width: `${((r.bytesPerEntry * bank.entries) / payloadBytes) * 100}%`,
								borderColor: "var(--fg)",
								opacity: phase > 5 ? 1 : 0.12,
								transition: `opacity var(--motion-cinematic) var(--ease-hause) ${ri * 140}ms`,
							}}
						>
							<div
								className="absolute inset-0"
								style={{
									backgroundImage: `repeating-linear-gradient(45deg, var(--color-accent) 0, var(--color-accent) 1px, transparent 1px, transparent ${
										ri === 0 ? 5 : 7
									}px)`,
									opacity: 0.75,
								}}
							/>
							{bank.entries > 1 && (
								<div
									className="absolute inset-0"
									style={{
										backgroundImage: `repeating-linear-gradient(90deg, var(--bg) 0, var(--bg) 1px, transparent 1px, transparent ${
											100 / Math.min(bank.entries, 64)
										}%)`,
									}}
								/>
							)}
							<span
								className="absolute bottom-1 left-2 voice-evidence text-[9px] tracking-[0.06em] uppercase"
								style={{ color: "var(--fg)" }}
							>
								{r.role} × {bank.entries}
							</span>
						</div>
					))}
				</div>
				<p className="voice-evidence text-[10px] opacity-40 mb-10">
					payload to scale · one tick per entry · first region offset {fmtBytes(firstOffset)}
				</p>

				{/* The receipt. */}
				<div className="flex flex-col max-w-xl">
					{[
						["logical layer, one file", `${bank.label} · ${regionSet.label} · ${formatId}`],
						[
							"per entry",
							regions.map((r) => `${r.role} ${fmtBytes(r.bytesPerEntry)}`).join(" · "),
						],
						["structure ahead of weights", `${fmtBytes(tablesBytes)}, padded to ${fmtBytes(firstOffset)}`],
						["weights", fmtBytes(payloadBytes)],
						["file", fmtBytes(totalBytes)],
					].map(([k, v]) => (
						<div
							key={k}
							className="grid grid-cols-[9rem_1fr] sm:grid-cols-[12rem_1fr] gap-6 items-baseline py-2 border-t"
							style={{ borderColor: "var(--color-mist)" }}
						>
							<span className="voice-evidence text-[10px] tracking-[0.1em] uppercase opacity-50">{k}</span>
							<span className="voice-evidence text-xs sm:text-sm">{v}</span>
						</div>
					))}
					<div className="border-t" style={{ borderColor: "var(--color-mist)" }} />
				</div>

				<p className="voice-system text-sm opacity-70 leading-relaxed max-w-2xl mt-8">
					Worked-example geometry: input and output 2048, intermediate 6144 — dimensions divisible by 256, so the
					block formats pack exactly. Change the format and only the payload changes. Change the region set and the
					schema count, entry table, and payload all follow. The structure never grows with the weights: parsing
					stays a few kilobytes, whatever the file weighs.
				</p>

				{/* Always-present text fallback. */}
				<p className="voice-evidence text-xs opacity-40 leading-relaxed max-w-2xl mt-6">
					A {bank.label} bank, {regionSet.label}, in {formatId}: {fmtBytes(tablesBytes)} of self-description, then{" "}
					{fmtBytes(payloadBytes)} of weights — {fmtBytes(totalBytes)} in all, every region offset 64-byte aligned.
				</p>
			</div>
		</section>
	);
}
