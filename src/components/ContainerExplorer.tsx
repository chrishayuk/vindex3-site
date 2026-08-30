"use client";

import { useState } from "react";
import Link from "next/link";
import { tick } from "@chrishayuk/hause/sound";

/**
 * The playful instrument: a model.vindex/ you can rummage through.
 * The root is the canonical graph shape (index.json, system_graph.json,
 * segments/); the transitional bank shape is one doorway down, where
 * the manifest and the LYRW files live. Every size is computed from
 * the same worked-example geometry as the encoder (input/output 2048,
 * intermediate 6144, 32 experts, 24 layers, vocab 32768) — a worked
 * example, not a specific model, and the page says so.
 */

type Entry = {
	name: string;
	note: string;
	size?: string;
	view?: string; // key into VIEWS; absent = leaf with no deeper view
};

const ROOT: Entry[] = [
	{ name: "index.json", note: "sole root authority", size: "4 KiB", view: "index" },
	{ name: "system_graph.json", note: "the semantic authority", size: "18 KiB", view: "graph" },
	{ name: "segments/", note: "one file per logical object", size: "15.4 GiB", view: "segments" },
	{ name: "tokenizer.json · capability snapshot", note: "what keeps it servable", view: "receipts" },
	{ name: "profiles · variants", note: "inline in the index", view: "profiles" },
	{ name: "→ the transitional bank shape", note: "the other layout, named and ranked", view: "bank" },
];

const PROFILES: [string, string][] = [
	["exact", "the faithful default — every selected region at source fidelity"],
	["native-lowbit", "prefer the natively low-bit variants where they exist"],
	["mixed-precision", "different regions, different encodings — by policy"],
	["attn-local-ffn-remote", "attention resident here, experts served from elsewhere"],
	["partial-residency", "not everything loads — decode a model bigger than RAM"],
	["reduced-top-k", "consult fewer experts per token"],
	["shared-only", "routed banks omitted — honestly: structurally-approximate"],
	["router-browse", "no forward pass at all — analysis-only"],
	["compact-approximate", "smallest honest form of the whole system"],
];

const SEGMENT_FILES: Entry[] = [
	{ name: "target.embedding.bin", note: "vocab 32768 × 2048", size: "128 MiB", view: "segment" },
	{ name: "target.decoder_stack.bin", note: "24 layers — attention · ffn · norms", size: "15.2 GiB", view: "segment" },
	{ name: "target.final_norm.bin", note: "2048", size: "8 KiB", view: "segment" },
	{ name: "target.output_head.bin", note: "reuses embedding — 0 payload bytes", size: "1 KiB", view: "segment" },
];

const BANK_ROOT: Entry[] = [
	{ name: "index.json", note: "same root rule — moe_manifest set, no graph", size: "4 KiB", view: "index" },
	{ name: "moe_manifest.json", note: "bank → programme", size: "2 KiB", view: "manifest" },
	{ name: "layer_000.lyrw … layer_023.lyrw", note: "LYRW v2 bank files", size: "14.3 GiB", view: "routed" },
];

const LAYER_FILES: Entry[] = [
	{ name: "layer_000.lyrw", note: "one LYRW v2 file", size: "612 MiB", view: "lyrw" },
	{ name: "layer_001.lyrw", note: "…", size: "612 MiB", view: "lyrw" },
	{ name: "layer_012.seg0.lyrw", note: "segment 0 — experts 0..15", size: "306 MiB", view: "lyrw" },
	{ name: "layer_012.seg1.lyrw", note: "segment 1 — experts 16..31", size: "306 MiB", view: "lyrw" },
	{ name: "layer_023.lyrw", note: "one LYRW v2 file", size: "612 MiB", view: "lyrw" },
];

const MONO = "voice-evidence text-xs sm:text-sm";

export function ContainerExplorer() {
	// A path of view keys; [] = the root listing.
	const [path, setPath] = useState<{ view: string; label: string }[]>([]);
	const current = path[path.length - 1];

	const open = (view: string | undefined, label: string) => {
		if (view) setPath([...path, { view, label }]);
	};

	const row = (e: Entry, i: number) => (
		<button
			key={e.name}
			onClick={() => { open(e.view, e.name); if (e.view) tick(); }}
			disabled={!e.view}
			className="graph-pulse grid grid-cols-[minmax(0,1fr)_auto_auto] items-baseline gap-4 sm:gap-8 border px-4 sm:px-6 py-3 text-left disabled:cursor-default group"
			style={{ borderColor: "var(--fg)", background: "var(--bg)", animationDelay: `${i * 60}ms` }}
		>
			<span className={`${MONO} truncate group-hover:opacity-100`} style={{ color: e.view ? undefined : "var(--fg)" }}>
				{e.name}
			</span>
			<span className="voice-evidence text-[10px] tracking-[0.1em] uppercase opacity-50 whitespace-nowrap">{e.note}</span>
			<span className={`${MONO} opacity-60 w-20 text-right`}>{e.size ?? ""}</span>
		</button>
	);

	const back = () => setPath(path.slice(0, -1));

	const crumbs = (
		<div className="flex items-baseline gap-2 flex-wrap mb-6">
			<button onClick={() => setPath([])} className="voice-evidence text-xs tracking-[0.08em]" style={{ color: "var(--color-accent)" }}>
				model.vindex/
			</button>
			{path.map((p, i) => (
				<button
					key={i}
					onClick={() => setPath(path.slice(0, i + 1))}
					className="voice-evidence text-xs tracking-[0.08em]"
					style={{ color: i === path.length - 1 ? undefined : "var(--color-accent)" }}
				>
					{p.label.replace(/ · .*/, "")}
					{i < path.length - 1 ? " /" : ""}
				</button>
			))}
			{path.length > 0 && (
				<button onClick={back} className="voice-evidence text-xs tracking-[0.1em] uppercase opacity-50 ml-4">
					← up
				</button>
			)}
		</div>
	);

	const pre = (text: string) => (
		<pre
			key={text.slice(0, 24)}
			className="graph-pulse voice-evidence text-xs sm:text-sm leading-relaxed whitespace-pre overflow-x-auto m-0 border px-5 py-4 sm:px-7 sm:py-6"
			style={{ borderColor: "var(--color-mist)" }}
		>
			{text}
		</pre>
	);

	const note = (text: string) => (
		<p className="voice-system text-sm opacity-70 leading-relaxed max-w-2xl mt-5">{text}</p>
	);

	let body: React.ReactNode;
	switch (current?.view) {
		case "index":
			body = (
				<>
					{pre(`{
  "version": 4,
  "model": "worked-example",
  "family": "moe-decoder",
  "hidden_size": 2048,
  "num_layers": 24,
  "authority": "canonical",

  "system_graph": "system_graph.json",
  "moe_manifest": null,

  "representations": {
    "target.decoder_stack@bf16":
      { "fidelity": "canonical",
        "segment": "segments/target.decoder_stack.bin" }
  },

  "variants": {
    "region_set": "layer.12.routed.gate_up",
    "exact-q6k":    { "fidelity": "source-equivalent" },
    "native-mxfp4": { "fidelity": "source-exact" },
    "baseline": "exact-q6k"
  }
}`)}
					{note(
						"An abbreviated excerpt — the field names are the spec's; the arrangement is condensed to fit one screen. Detection reads version and nothing else — VINDEX3 spans schemas 3–4, and a fresh encode stamps 4. The system_graph and moe_manifest pointers are which shape this container is; a bank container carries the reverse pair. And the variants catalogue is the whole selection story in a few lines."
					)}
				</>
			);
			break;
		case "graph":
			body = (
				<>
					{pre(`components: [ { id: "target", role: "primary_text",
                num_layers: 24, hidden_size: 2048,
                attention: [ per-layer policy × 24 ] } ]

objects:    [ target.embedding · target.decoder_stack ·
              target.final_norm · target.output_head ]
              — each with source_bindings + representations

edges:      [ ]   (no drafter, no tower in this example)`)}
					{note(
						"The SystemGraph, verbatim — the container's understanding of the model, judged once at compile time. Execution, verification, and the query surface all read this, never the checkpoint. The Graph chapter walks every field."
					)}
				</>
			);
			break;
		case "segments":
			body = (
				<>
					<div className="flex flex-col gap-2 mb-2">{SEGMENT_FILES.map(row)}</div>
					{note(
						"One file per logical-object representation, named by identity — {component}.{kind} — never by source filename. Open one to see the framing."
					)}
				</>
			);
			break;
		case "segment":
			body = (
				<>
					{pre(`[u64 LE header length][header JSON][payload bytes]

SegmentHeader {
  schema, representation,
  tensors: [
    { name: "0.self_attn.q_proj.weight",
      dtype: "bf16", shape: [2048, 2048],
      offset: 0, len: 8388608 },
    …
  ]
}

hashes: payload sha256 · file sha256 — both recorded,
        both re-derived at verify time`)}
					{note(
						"Offsets are relative to the payload; the table's order is the payload's order — deterministic, sorted by name. Names are object-relative, never artifact-global: the checkpoint's naming disappears as an authority at encode."
					)}
				</>
			);
			break;
		case "manifest":
			body = (
				<>
					{pre(`bank 0  →  programme 2   gpt-oss-expert-v1
bank 1  →  programme 3   shared-routed-mlp-v1

registry:  0 gated-mlp-v1 · 1 gated-mlp-fused-fc1-v1
           2 gpt-oss-expert-v1 · 3 shared-routed-mlp-v1
           4 latent-moe-v1`)}
					{note(
						"The meaning layer of the bank shape: weight files describe storage only, and this manifest binds each bank to the programme that consumes it. The binary carries no programme identity of its own — one authority for that fact, never two. A graph container carries no manifest: its routing structure lives in the graph and the representations."
					)}
				</>
			);
			break;
		case "profiles":
			body = (
				<div className="flex flex-col gap-2">
					{PROFILES.map(([name, gloss], i) => (
						<div
							key={name}
							className="graph-pulse grid grid-cols-[8.5rem_1fr] sm:grid-cols-[12rem_1fr] items-baseline gap-4 sm:gap-8 border-t py-2.5"
							style={{ borderColor: "var(--color-mist)", animationDelay: `${i * 60}ms` }}
						>
							<span className={MONO} style={{ color: "var(--color-accent)" }}>
								{name}
							</span>
							<span className="voice-system text-xs sm:text-sm opacity-70">{gloss}</span>
						</div>
					))}
					{note(
						"Nine standard ways of running the same bytes — carried inline in index.json, because they are policy, not payload. A profile selects — variants, residency, how much of the model participates. It never converts, and it can never claim a fidelity above what its own choices derive."
					)}
				</div>
			);
			break;
		case "receipts":
			body = (
				<>
					{pre(`tokenizer.json           text ↔ tokens
tokenizer_config.json    the tokenizer's declared behaviour
special_tokens_map.json  BOS · EOS · padding, as the source said
generation_config.json   the source's own generation defaults
chat_template            when the source shipped one`)}
					{note(
						"The capability snapshot. The encoder proper writes only what execution needs; this is what keeps a fresh container servable — without it, a container binds with token-id capability only and refuses text inference. The BOS fact comes from here, never from reconstructed architecture."
					)}
				</>
			);
			break;
		case "bank":
			body = (
				<>
					<div className="flex flex-col gap-2 mb-2">{BANK_ROOT.map(row)}</div>
					{note(
						"The transitional bank shape — the LYRW v2 import layout for routed expert banks, written by the expert-bank importer. Same root rule, no graph: a moe_manifest.json gives the banks meaning. Readers must accept it; new writers should not extend it; the convergence rule fixes its future — the graph is the format, and a bank layout is an encoding a representation may use."
					)}
				</>
			);
			break;
		case "routed":
			body = (
				<>
					<div className="flex flex-col gap-2 mb-2">{LAYER_FILES.map(row)}</div>
					{note(
						"The bulk of the model — 32 experts per layer here. Layer 12 is segmented: two files, each carrying half the experts, because its bytes outgrew the shard cap. Open any file to see inside it."
					)}
				</>
			);
			break;
		case "lyrw":
			body = (
				<>
					<div className="flex flex-col gap-2">
						{[
							["header — 24 B", 'magic "LYRW" · format_version 2 · logical_layer · counts'],
							["bank descriptor — 24 B", "bank_id · kind · schema count · browse flags · entries · dims"],
							["segment descriptor — 12 B", "which slice of the layer this file holds"],
							["region schemas — 2 × 20 B", "role · format · packing · pair · layout · rows × cols — once per bank, not per expert"],
							["entry table — 32 × 2 × 16 B", "offset and length per region per entry — pure arithmetic"],
						].map(([name, gloss], i) => (
							<div
								key={name}
								className="graph-pulse grid grid-cols-[10rem_1fr] sm:grid-cols-[14rem_1fr] items-baseline gap-4 sm:gap-8 border px-4 sm:px-6 py-3"
								style={{ borderColor: "var(--fg)", animationDelay: `${i * 60}ms` }}
							>
								<span className={MONO} style={{ color: "var(--color-accent)" }}>
									{name}
								</span>
								<span className="voice-system text-xs sm:text-sm opacity-70">{gloss}</span>
							</div>
						))}
						<div
							className="graph-pulse relative border h-14 sm:h-16 overflow-hidden"
							style={{ borderColor: "var(--fg)", animationDelay: "300ms" }}
							aria-hidden="true"
						>
							<div
								className="absolute inset-0"
								style={{
									backgroundImage:
										"repeating-linear-gradient(45deg, var(--color-accent) 0, var(--color-accent) 1px, transparent 1px, transparent 5px)",
									opacity: 0.75,
								}}
							/>
							<div
								className="absolute inset-0"
								style={{
									backgroundImage: `repeating-linear-gradient(90deg, var(--bg) 0, var(--bg) 1px, transparent 1px, transparent ${100 / 32}%)`,
								}}
							/>
							<span className="absolute bottom-1 left-2 voice-evidence text-[9px] tracking-[0.06em] uppercase">
								payload — the weights, one tick per expert, every offset 64-byte aligned
							</span>
						</div>
					</div>
					<p className="voice-system text-sm opacity-70 leading-relaxed max-w-2xl mt-5">
						That is the whole file: a few hundred bytes of self-description, then the weights.{" "}
						<Link href="/bytes" className="border-b pb-0.5" style={{ borderColor: "var(--color-accent)" }}>
							Read every field on the Bytes page →
						</Link>
					</p>
				</>
			);
			break;
		default:
			body = <div className="flex flex-col gap-2">{ROOT.map(row)}</div>;
	}

	return (
		<section className="hause-grid py-20 sm:py-28">
			<div className="col-span-12 md:col-start-2 md:col-span-10 lg:col-span-9">
				<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-3 opacity-50">
					EXPLORE — CLICK YOUR WAY INTO A CONTAINER
				</p>
				<p className="voice-editorial text-2xl sm:text-3xl mb-10">Go on. Open things.</p>

				{crumbs}
				<div key={path.map((p) => p.view).join("/") || "root"}>{body}</div>

				<p className="voice-evidence text-xs opacity-40 leading-relaxed max-w-2xl mt-10">
					A worked example — the same geometry as the encoder below on the Bytes page, not a specific model. Every
					size is computed with the spec&apos;s own arithmetic. Nothing here is a screenshot.
				</p>
			</div>
		</section>
	);
}
