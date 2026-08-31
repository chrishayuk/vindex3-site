import type { Metadata } from "next";
import { CiteThis } from "@/components/CiteThis";
import { citeMeta } from "@/data/citation";
import { JsonLd } from "@chrishayuk/hause/components/JsonLd";
import { breadcrumbLd, techArticleLd } from "@chrishayuk/hause/seo";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Answer } from "@chrishayuk/hause/components/forms/Answer";
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { Observation } from "@chrishayuk/hause/components/forms/Observation";
import { Anatomy } from "@chrishayuk/hause/components/forms/Anatomy";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";
import { Compilation } from "@chrishayuk/hause/components/forms/Compilation";
import { ContainerExplorer } from "@/components/ContainerExplorer";
import { ClassTraffic } from "@/components/StoryFigures";
import { Procession } from "@chrishayuk/hause/components/forms/Procession";

export const metadata: Metadata = {
	title: "Inside an AI Model Container: Objects, Segments & the Index",
	alternates: { canonical: "/container" },
	description: "Every layer of a VINDEX3 container, explained — one directory, one root, the canonical graph shape and the five durable weight classes.",
	// The head surface of this chapter's publication record — citation_* tags,
	// built from the same object the Provenance line and the reference print.
	other: citeMeta("/container"),
};

/**
 * The anatomy exhibit: what each file and directory in model.vindex/
 * actually is. Grounded in the 3.0 Candidate §4–5 (the container model:
 * canonical graph shape, transitional bank shape, the class vocabulary),
 * §8–9, §15, and the Vindex3Index struct (format/vindex3/index.rs).
 */
export default function ContainerPage() {
	return (
		<main>
			<JsonLd
				data={techArticleLd({
					headline: "The Container",
					description:
						"The VINDEX3 container: one directory, one root authority, five weight classes, every part named and checkable.",
					url: "https://vindex3.org/container",
					siteUrl: "https://vindex3.org",
					siteName: "VINDEX3",
					dateModified: "2026-08-30",
					about: ["model container format"],
				})}
			/>
			<JsonLd
				data={breadcrumbLd([
					{ name: "VINDEX3", url: "https://vindex3.org" },
					{ name: "The Container", url: "https://vindex3.org/container" },
				])}
			/>
			<Hero
				kicker="THE CONTAINER · CANDIDATE SPEC §4–5"
				title="ONE DIRECTORY, ONE ROOT"
				dek="A VINDEX3 container is not a single blob. It is a directory whose every part is named, addressable, and explained — this page walks all of them."
			/>

			<Answer
				id="what-is-a-vindex3-container"
				question="What is a VINDEX3 container?"
				answer="A directory, not a blob: one root authority (index.json) speaking for version, identity, checksums and segments; a system graph recording what the model means; segments holding the bytes; and execution profiles selecting among physically present representations. Every part is named and checkable, so the same artifact can be understood, executed, transformed and verified — including after the source checkpoint is deleted."
			/>

			<Statement text="Today, changing your mind about a model means making another file." />

			<Observation
				label="WHAT THIS FIXES"
				text="You download a checkpoint: a folder of shards whose meaning lives in filename conventions. You quantize it: now there are two files, and the lineage between them is a commit message somewhere. A colleague needs another precision: three. Delete the original to save space, and no one can ever again prove what the copies are. The release was a system — a model, its tower, its drafter, its precisions. The folder is a rumor about it."
			/>

			<Observation
				label="THE QUESTIONS A FOLDER CANNOT ANSWER"
				text="What are these model objects? What operations can consume them? Which representations are equivalent? Which parts should be resident? What future computation will need them? A serving file answers one question — how do I store and run these tensors. The container is built to answer all of them."
			/>

			<Compilation
				kicker="THE BRIDGE — FROM CHECKPOINT TO CONTAINER"
				headline="Start from the files you already have. Compile down."
				sourceLabel="a checkpoint — what you download today"
				sources={[
					"config.json",
					"model-00001-of-00004.safetensors",
					"model-00002-of-00004.safetensors",
					"model-00003-of-00004.safetensors",
					"model-00004-of-00004.safetensors",
					"tokenizer.json",
				]}
				stages={[
					{ name: "inventory", gloss: "read what the source declares" },
					{ name: "plan", gloss: "judge it — typed findings, ambiguity refused" },
					{ name: "graph", gloss: "components · objects · edges" },
					{ name: "encode", gloss: "segments first, index.json last" },
					{ name: "verify", gloss: "Declared ≡ Resolved ≡ Graph ≡ Encoded" },
				]}
				resultLabel="model.vindex/ — written, then proven"
				results={[
					{ name: "system_graph.json" },
					{ name: "segments/ — one per logical object" },
					{ name: "tokenizer.json + capability snapshot" },
					{ name: "index.json", emphasis: true, note: "the root, written last" },
				]}
				verifiedLabel="verified — byte-faithful to its source"
				discardNote="may now be deleted — execution must not change"
				fallback="A checkpoint — config.json and safetensors shards — is inventoried, judged, formed into a graph, encoded in write order with index.json last, and verified against its source. Then the checkpoint may be deleted: execution must not change. That is the whole bridge, and it is crossed once."
			/>

			<Statement text="There is no second root. A second root creates competing authorities — whose checksums win? whose version controls compatibility?" />

			<ContainerExplorer />

			<Anatomy
				kicker="model.vindex/ — THE CANONICAL SHAPE"
				objectLabel="Four parts. One is in charge."
				layers={[
					{
						label: "index.json",
						note: "SOLE ROOT AUTHORITY",
						emphasis: true,
						detail:
							"The one file every reader opens first, and the only place the container speaks for itself. It names the model, declares the container generation, and carries the maps that make everything else findable and checkable. If a fact matters to loading the container, it is here or reachable from here.",
						children: [
							{ label: "version", detail: "the container generation — VINDEX3 spans schemas 3–4, and a fresh encode stamps 4; detection uses this field only, never filename sniffing" },
							{ label: "model · family", detail: "identity: which model this is, and its architecture family" },
							{ label: "hidden_size · num_layers", detail: "the geometry every consumer needs before touching a weight" },
							{ label: "system_graph · moe_manifest", detail: "which shape this container is: the canonical graph shape carries a graph and no manifest; the transitional bank shape carries the reverse. Absence of a manifest is not evidence a model is dense" },
							{ label: "representations", detail: "which physical encodings exist for which objects, with recorded fidelity" },
							{ label: "profiles · variants", detail: "the execution profiles — inline in the index, not a directory — and each region set's physically present variants with its baseline" },
							{ label: "segments", detail: "which files hold which payloads — the loader never globs the directory" },
							{ label: "authority", detail: "Canonical or Derived — a derived image cannot recompile itself, and says so; derived_from_model keeps the provenance link" },
							{ label: "precision_map", detail: "when present, the compiled policy saying what encoding each tensor is in" },
						],
					},
					{
						label: "system_graph.json",
						note: "THE SEMANTIC AUTHORITY",
						detail:
							"The SystemGraph, verbatim: components, logical objects, hidden-state edges, per-layer attention policies. Built once from source evidence when the container is made; from then on it is the only semantic authority — execution, verification, and the query surface all read the graph, never the checkpoint. The Graph chapter walks it in full.",
					},
					{
						label: "segments/",
						note: "THE PAYLOAD",
						detail:
							"One file per logical-object representation — target.decoder_stack.bin, target.embedding.bin — each carrying its own tensor table (name, dtype, shape, offset, length) and hashed twice in a single writing pass: the payload, and the whole file. Names inside a segment are object-relative, never artifact-global. The write order is deliberate — segments first, index.json last — so a crash midway leaves a directory that never claimed to be a container.",
					},
					{
						label: "tokenizer.json + capability snapshot",
						muted: true,
						detail:
							"The supporting cast: the tokenizer, tokenizer_config, special_tokens_map, generation_config, chat template. The encoder proper writes only what execution needs; this snapshot is what keeps a fresh container servable — without it, a container binds with token-id capability only and refuses text inference.",
					},
				]}
				caption="The canonical shape — what every mainline producer writes: encode, extract with an explicit V3 request, and the LQL and factory surfaces, all through one shared pipeline."
			/>

			<Observation
				label="THE TRANSITIONAL BANK SHAPE"
				text="One other shape exists, and since the 3.0 Candidate it is named and ranked rather than left ambient: the expert-bank import layout — index.json, a moe_manifest.json binding banks to programmes, and LYRW v2 bank files. It predates the graph authority; readers must accept it, new writers should not extend it, and its future is fixed by the convergence rule: the graph is the format, and a bank layout is an encoding a representation may use. The Bytes page walks its binary layout to the byte."
			/>

			<Anatomy
				kicker="THE FIVE DURABLE WEIGHT CLASSES — THE SERVING VOCABULARY"
				objectLabel="A classification, not a directory tree."
				layers={[
					{
						label: "class 1 — control & router",
						note: "SMALL, DECISIVE",
						detail:
							"Token embeddings, normalisation weights, the LM head, the routers that decide which experts see each token, and the recurrence and control parameters of linear-attention designs. Small, and routing errors compound — so this class is preserved at source precision, never approximated.",
					},
					{
						label: "class 2 — dense spine",
						note: "EVERY TOKEN",
						detail:
							"The backbone every token passes through: the attention projections — softmax attention, and the KDA, MLA and linear-attention families where a model uses them. A dense-only model is simply a container where this class carries the whole story.",
					},
					{
						label: "class 3 — shared FFN",
						note: "ALWAYS RESIDENT",
						detail:
							"Feed-forward weights every token uses regardless of routing: shared experts, and the shared pre/post projections of latent-space designs. Kept apart from the routed banks because they are always resident, while routed banks can be paged, trimmed, or left on disk.",
					},
					{
						label: "classes 4 & 5 — routed expert banks",
						note: "THE BULK",
						detail:
							"The bulk of a mixture-of-experts model: the per-layer expert banks — gate/up in one class, down-projections in the other. Stored as group extents, so experts can be fetched in useful units, and split into segment files when a layer outgrows the shard cap — the reason a fifty-gigabyte layer is not a fifty-gigabyte file.",
					},
				]}
				caption="Classes are the boundaries serving policy can decide about independently — fetch, place, quantise, omit, query. Draft-era layouts mandated one directory per class; the Candidate keeps the classes and withdraws the directory tree: storage references are container-relative paths, and there is no sixth class — hot sets, expert retention, cache sizing, and prefetch order are profile and runtime metadata, never new storage classes."
			/>

			<Observation
				label="WHY CLASSES AT ALL"
				text="A part gets its own physical identity only when the runtime may independently omit it, quantise it, place it, prefetch it, execute it — or query it. That is the split rule. The query clause is real: WALK reads gate rows without up or down, so on a browse-enabled index the gate role has an independent access pattern by construction. Query metadata itself stays derived and optional — its absence downgrades label richness, never correctness — because no query index is stored beside the weights: the weights are the query index."
			/>

			<section className="hause-grid py-16 sm:py-24">
				<div className="col-span-12 md:col-start-2 md:col-span-10 lg:col-span-9">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-8 opacity-50">
						THREE AXES — IDENTITY, REPRESENTATION, RESIDENCE
					</p>
					<pre
						className="voice-evidence text-xs sm:text-sm leading-relaxed whitespace-pre overflow-x-auto m-0 border px-5 py-4 sm:px-7 sm:py-6"
						style={{ borderColor: "var(--color-mist)" }}
					>
						{`LOGICAL OBJECT        what it is
      ↓
REPRESENTATION        how it is encoded
      ↓
RESIDENCE             where the useful bytes live right now`}
					</pre>
					<p className="voice-system text-sm opacity-70 leading-relaxed max-w-2xl mt-6">
						Residency is operational, not semantic: the same container means the same thing mmap-cold on NVMe,
						resident in unified memory, or split across devices. The Candidate pins the division — the format may
						carry portable residency facts (access class, zero-copy capability, evictability, co-use grouping),
						while placement belongs to a runtime plan that is never persisted: a device name in the format would
						age with the machine, not the model. Artifact size, resident-set size and bytes-touched-per-token are
						three independent quantities — which is the whole point for models larger than memory.
					</p>
				</div>
			</section>

			<ClassTraffic />

			<Procession
				stages={["inventory", "plan", "encode", "inspect", "verify", "execute", "serve"]}
				caption="one checkpoint — every stage, once"
			/>

			<Connection
				text="Named parts are a promise. The next chapter is whether you can check it — down to the byte."
				links={[
					{ href: "/graph", label: "THE SYSTEM GRAPH" },
					{ href: "/bytes", label: "LYRW, TO THE BYTE" },
					{ href: "/representation", label: "SELECTION, NOT CONVERSION" },
				]}
			/>

			<CiteThis slug="/container" />

			<section className="hause-grid pb-32 pt-8 border-t" style={{ borderColor: "var(--color-mist)" }}>
				<div className="col-span-12">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase opacity-50 mb-4">SOURCES</p>
					<ul className="voice-evidence text-sm opacity-60 flex flex-col gap-1">
						<li>vindex3-format-spec.md §4–5, §8–9, §15 (the 3.0 Candidate)</li>
						<li>reference implementation — index.rs (Vindex3Index)</li>
					</ul>
				</div>
			</section>
		</main>
	);
}
