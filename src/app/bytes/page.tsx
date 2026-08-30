import type { Metadata } from "next";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { Observation } from "@chrishayuk/hause/components/forms/Observation";
import { ByteMap } from "@chrishayuk/hause/components/forms/ByteMap";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";
import { FileEncoder } from "@/components/FileEncoder";
import { SegmentationFigure } from "@/components/StoryFigures";

export const metadata: Metadata = {
	title: "The VINDEX3 Binary Layout: How Model Bytes Are Framed",
	alternates: { canonical: "/bytes" },
	description: "LYRW v2, the layer-weight binary format, explained to the byte — header, banks, segments, region schemas, entry table.",
};

/**
 * The engineering-drawing exhibit, held to the standard that a reader
 * could implement a LYRW v2 parser from this page alone: structures in
 * their actual file order, every field with its width, every enum with
 * its wire value. All of it is ABI spec §6–7 verbatim.
 */
export default function BytesPage() {
	return (
		<main>
			<Hero
				kicker="THE BYTES · CANDIDATE SPEC §6–7 · LYRW v2"
				title="DOWN TO THE BYTE"
				dek="LYRW v2 is the expert-bank codec of VINDEX3 — a binary format simple enough to read with a ruler. This page is that ruler."
			/>

			<Statement text="A blob you cannot check is a promise you cannot keep." />

			<Observation
				label="WHAT THIS FIXES"
				text="Most weight files are a header you must trust, followed by bytes you cannot question. When a reader meets something it does not recognise, it guesses or it dies; when a writer changes a layout, every old reader finds out at parse time, in production. LYRW was shaped so neither ever happens: the file carries its whole description, unknown tags are preserved and reported rather than fatal, and refusal waits for the operation that actually needs the thing a reader cannot do."
			/>

			<Observation text="LYRW is the layer-weight bank format. One binary file holds one layer's weights — or one segment of a very large layer — organised as banks of entries. A file describes itself completely: a reader needs nothing but the bytes in front of it to know what regions exist, in what encoding, at what offsets. Five structures, in the order they appear in the file: header, bank descriptors, segment descriptors, region schemas, entry table. Its place in the container model is stated by the Candidate: this is one segment codec — today the layout of the transitional bank shape's expert banks, under the convergence rule an encoding a graph container's representation may use. A graph container's plain tensor-table segments are the other codec, on the Container page." />

			<ByteMap
				kicker="STRUCTURE 1 — ONCE PER FILE"
				title="The header — 24 bytes"
				fields={[
					{ name: "magic", type: "u32", bytes: 4, value: "0x4C595257", meaning: "the four ASCII bytes “LYRW” — the file introduces itself" },
					{ name: "format_version", type: "u32", bytes: 4, value: "2", meaning: "a v1 reader fails fast here with a precise “requires VINDEX3 loader” — never a parse error" },
					{ name: "logical_layer", type: "u32", bytes: 4, meaning: "which layer of the model this file belongs to" },
					{ name: "num_banks", type: "u16", bytes: 2, meaning: "how many bank descriptors follow — dense layers have one bank, MoE layers more" },
					{ name: "num_segments", type: "u16", bytes: 2, meaning: "segments described by this file's tables — at least 1" },
					{ name: "flags", type: "u32", bytes: 4, meaning: "bit 0: this file is one segment of a multi-segment layer; other bits reserved" },
					{ name: "reserved", type: "u32", bytes: 4, meaning: "kept zero — room without a version bump" },
				]}
				totalLabel="24 bytes · all integers little-endian · all region offsets 64-byte aligned from the start of the containing segment file"
			/>

			<ByteMap
				kicker="STRUCTURE 2 — num_banks ×"
				title="The bank descriptor — 24 bytes each"
				fields={[
					{ name: "bank_id", type: "u16", bytes: 2, meaning: "the bank's identity — what the MoE manifest binds a programme to" },
					{ name: "bank_kind", type: "u16", bytes: 2, meaning: "0 = dense, 1 = routed, 2 = shared" },
					{ name: "region_schema_count", type: "u16", bytes: 2, meaning: "how many records this bank owns in the region-schema table — where one bank's schemas end" },
					{ name: "flags", type: "u16", bytes: 2, meaning: "bits 0–1: browse mode — 00 = none, 01 = direct, 10 = strided; rest reserved" },
					{ name: "num_entries", type: "u32", bytes: 4, meaning: "1 for a dense bank, or the expert count for a routed one" },
					{ name: "input_dim", type: "u32", bytes: 4, meaning: "the entry's own operand width — a latent bank says its latent width, not the residual width" },
					{ name: "intermediate_dim", type: "u32", bytes: 4, meaning: "the inner feed-forward width" },
					{ name: "output_dim", type: "u32", bytes: 4, meaning: "the entry's output width" },
				]}
				totalLabel="24 bytes × num_banks · a dense layer is a bank with num_entries = 1 — one format for dense and MoE alike"
				caption="The descriptor says what is stored, never what it means: the binary carries no programme identity. The MoE manifest in the container root binds bank_id to a programme, so the same fact is never declared in two places."
			/>

			<ByteMap
				kicker="STRUCTURE 3 — num_segments ×"
				title="The segment descriptor — 12 bytes each"
				fields={[
					{ name: "bank_id", type: "u16", bytes: 2, meaning: "which bank this segment carves" },
					{ name: "segment_index", type: "u16", bytes: 2, meaning: "which slice of the logical layer this file holds" },
					{ name: "first_entry", type: "u32", bytes: 4, meaning: "the first expert in this segment" },
					{ name: "entry_count", type: "u32", bytes: 4, meaning: "how many experts it holds — this file's entry table covers only these, never the whole logical bank" },
				]}
				totalLabel="12 bytes × num_segments · a single-file layer has one segment covering [0, num_entries)"
				caption="Multi-segment layers repeat the header in every segment file with flags bit 0 set, and index.json lists the segment files per logical layer — the loader never globs a directory."
			/>

			<ByteMap
				kicker="STRUCTURE 4 — region_schema_count × PER BANK, NOT PER EXPERT"
				title="The region schema — 20 bytes each"
				fields={[
					{ name: "schema_index", type: "u16", bytes: 2, meaning: "position in this bank's schema list" },
					{ name: "role", type: "u16", bytes: 2, meaning: "what the region is to the computation — the numbered vocabulary below" },
					{ name: "format", type: "u16", bytes: 2, meaning: "the encoding — the numbered vocabulary below" },
					{ name: "packing", type: "u16", bytes: 2, meaning: "0 = row_major, 1 = blocks_with_scales_inline, 2 = blocks_values, 3 = blocks_scales" },
					{ name: "pair_id", type: "u16", bytes: 2, meaning: "links a blocks_values schema to its blocks_scales schema; 0xFFFF = unpaired" },
					{ name: "layout", type: "u16", bytes: 2, meaning: "the payload's internal order — 0 = unspecified, 1 = contiguous_halves, 2 = interleaved. Draft-2's reserved pad, claimed: the record stayed 20 bytes, which is exactly why the index schema bumped 3 → 4" },
					{ name: "rows", type: "u32", bytes: 4, meaning: "region height" },
					{ name: "cols", type: "u32", bytes: 4, meaning: "region width" },
				]}
				totalLabel="20 bytes × region_schema_count, per bank · expert banks are homogeneous, so the layout is declared once and every entry shares it"
				caption="The quiet trick of the format: every expert in a bank has the same shape, so the layout is declared once. Per-expert layout information collapses to two numbers each. And per-expert codec variation — which no grouped kernel supports — becomes unrepresentable by construction, not forbidden by convention."
			/>

			<ByteMap
				kicker="STRUCTURE 5 — THE ENTRY TABLE"
				title="One row per entry per region — 16 bytes each"
				fields={[
					{ name: "offset", type: "u64", bytes: 8, meaning: "where this region's bytes start — from the start of the containing segment file, 64-byte aligned" },
					{ name: "length", type: "u64", bytes: 8, meaning: "how many bytes it runs" },
				]}
				totalLabel="entry_count × region_schema_count rows of 16 bytes, entry-major — for each entry, one row per region schema, in schema order"
				caption="Parsing cost is O(schemas), not O(entries × regions): the shape is read once per bank, then the table is pure arithmetic. Physical expert order need not match logical order — the table is the indirection."
			/>

			<section className="hause-grid py-16 sm:py-24">
				<div className="col-span-12 md:col-start-2 md:col-span-10 lg:col-span-9">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-8 opacity-50">
						THE NUMBERED VOCABULARIES — WIRE VALUES, VERBATIM
					</p>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
						<div>
							<p className="voice-evidence text-xs tracking-[0.1em] uppercase mb-3" style={{ color: "var(--color-accent)" }}>
								role — u16
							</p>
							<pre className="voice-evidence text-xs sm:text-sm leading-relaxed whitespace-pre overflow-x-auto m-0">
								{`0  gate
1  up
2  gate_up_fused
3  down
4  bias
5  scales
6  latent_in
7  latent_out
8..255   reserved-registered
256..    vendor / experimental`}
							</pre>
						</div>
						<div>
							<p className="voice-evidence text-xs tracking-[0.1em] uppercase mb-3" style={{ color: "var(--color-accent)" }}>
								format — u16
							</p>
							<pre className="voice-evidence text-xs sm:text-sm leading-relaxed whitespace-pre overflow-x-auto m-0">
								{`0  f32        6  q8_0
1  f16        7  fp4_larql
2  bf16       8  mxfp4
3  q4_0       9  nvfp4
4  q4_k      10  mxfp8
5  q6_k       …  extensible`}
							</pre>
						</div>
					</div>
					<p className="voice-system text-sm opacity-70 leading-relaxed max-w-2xl mt-8">
						New roles and formats do not bump format_version. Known kernels may require exactly gate_up_fused +
						down (or gate + up + down); the presence of other roles never invalidates a file, and the absence of a
						role a programme requires makes the file un-executable for that programme — not invalid.
					</p>
				</div>
			</section>

			<FileEncoder />

			<Statement text="Unknown tags are preserved, not rejected. Refusal belongs at capability-check time — a reader reports what it does not understand, and only the operations that need it are refused." />

			<Observation
				label="SEGMENTATION — WHY A LAYER IS SOMETIMES SEVERAL FILES"
				text="The spec's own worked example: one routed layer of K3, at exact Q6_K, is 33,030,144 parameters per expert × 896 experts — about 22.61 GiB. That exceeds the 20 GiB shard cap. So the layer ships as two segment files of 448 experts each, about 11.3 GiB apiece. Inside a segment, experts are grouped into extents of 8, 16, or 32 — the unit of disk reads, prefetch, and grouped kernels. Two rules keep the scales honest: segment boundaries fall on group-extent boundaries, and group width divides segment width. Segment width serves file management. Group width serves the hardware."
			/>

			<SegmentationFigure />

			<Observation
				label="GREENFIELD, DELIBERATELY"
				text="LYRW v2 owes no binary compatibility to the layer files inside VINDEX2 containers — those were never a public contract. There is no adapter and no in-place upgrade. Each generation's loader reads its own format. The magic and version field exist so an old reader fails fast with a precise message, never a parse error. And the compatibility promise lives one level up: one reader supports both generations, indefinitely."
			/>


			<Connection
				text="Which encoding a region is stored in — and which stored variant a profile may select — is the representation story."
				links={[
					{ href: "/representation", label: "SELECTION, NOT CONVERSION" },
					{ href: "/container", label: "ONE DIRECTORY, ONE ROOT" },
				]}
			/>

			<section className="hause-grid pb-32 pt-8 border-t" style={{ borderColor: "var(--color-mist)" }}>
				<div className="col-span-12">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase opacity-50 mb-4">SOURCES</p>
					<ul className="voice-evidence text-sm opacity-60 flex flex-col gap-1">
						<li>vindex3-format-spec.md §6–7 (the 3.0 Candidate)</li>
						<li>reference implementation — lyrw2/region_format.rs and the format constants</li>
					</ul>
				</div>
			</section>
		</main>
	);
}
