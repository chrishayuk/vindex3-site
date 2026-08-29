import type { Metadata } from "next";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { Observation } from "@chrishayuk/hause/components/forms/Observation";
import { Anatomy } from "@chrishayuk/hause/components/forms/Anatomy";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";
import { Compilation } from "@chrishayuk/hause/components/forms/Compilation";
import { ContainerExplorer } from "@/components/ContainerExplorer";

export const metadata: Metadata = {
	title: "The Container",
	description: "Every layer of a VINDEX3 container, explained — one directory, one root, five durable weight classes.",
};

/**
 * The anatomy exhibit: what each file and directory in model.vindex/
 * actually is. Layer notes and details are grounded in ABI §4–5, §8–9,
 * §15 and the Vindex3Index struct (format/vindex3/index.rs).
 */
export default function ContainerPage() {
	return (
		<main>
			<Hero
				kicker="THE CONTAINER · VINDEX3 ABI §4–5"
				title="ONE DIRECTORY, ONE ROOT"
				dek="A VINDEX3 container is not a single blob. It is a directory whose every part is named, addressable, and explained — this page walks all of them."
			/>

			<Statement text="Today, changing your mind about a model means making another file." />

			<Observation
				label="WHAT THIS FIXES"
				text="You download a checkpoint: a folder of shards whose meaning lives in filename conventions. You quantize it: now there are two files, and the lineage between them is a commit message somewhere. A colleague needs another precision: three. Delete the original to save space, and no one can ever again prove what the copies are. The release was a system — a model, its tower, its drafter, its precisions. The folder is a rumor about it."
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
					{ name: "control/ · dense/ · shared/" },
					{ name: "routed/" },
					{ name: "query/ · profiles/" },
					{ name: "moe_manifest.json" },
					{ name: "index.json", emphasis: true, note: "the root, written last" },
				]}
				verifiedLabel="verified — byte-faithful to its source"
				discardNote="may now be deleted — execution must not change"
				fallback="A checkpoint — config.json and safetensors shards — is inventoried, judged, formed into a graph, encoded in write order with index.json last, and verified against its source. Then the checkpoint may be deleted: execution must not change. That is the whole bridge, and it is crossed once."
			/>

			<Statement text="There is no second root. A second root creates competing authorities — whose checksums win? whose version controls compatibility?" />

			<ContainerExplorer />

			<Anatomy
				kicker="model.vindex/ — THE ANATOMY"
				objectLabel="Nine parts. One is in charge."
				layers={[
					{
						label: "index.json",
						note: "SOLE ROOT AUTHORITY",
						emphasis: true,
						detail:
							"The one file every reader opens first, and the only place the container speaks for itself. It names the model, declares the container generation (version 3), and carries the maps that make everything else findable and checkable. If a fact matters to loading the container, it is here or reachable from here.",
						children: [
							{ label: "version", detail: "the container generation — 3 means VINDEX3; detection uses this field only, never filename sniffing" },
							{ label: "model · family", detail: "identity: which model this is, and its architecture family" },
							{ label: "hidden_size · num_layers", detail: "the geometry every consumer needs before touching a weight" },
							{ label: "representations", detail: "which physical encodings exist for which objects" },
							{ label: "profiles · variants", detail: "the execution profiles, and each region set's physically present variants with its baseline" },
							{ label: "segments", detail: "which files hold which layers — the loader never globs the directory" },
							{ label: "authority", detail: "Canonical or Derived — a derived image cannot recompile itself, and says so" },
							{ label: "precision_map", detail: "when present, the compiled policy saying what encoding each tensor is in" },
						],
					},
					{
						label: "moe_manifest.json",
						note: "PROGRAMME",
						detail:
							"The meaning layer. Weight files describe storage only; this manifest says what the stored banks are for — it binds each bank to a programme, the small recipe of operations that consumes it. Storage holds regions; the manifest gives them meaning, and it is the single authority for that fact.",
						children: [
							{ label: "programme registry", detail: "gated-mlp-v1 · gated-mlp-fused-fc1-v1 · gpt-oss-expert-v1 · shared-routed-mlp-v1 · latent-moe-v1" },
							{ label: "bank_id → programme", detail: "the binding — the binary carries no programme identity of its own" },
						],
					},
					{
						label: "profiles/",
						note: "EXECUTION",
						detail:
							"Ways of running the same container. A profile selects which variants to load, what stays resident, and how much of the model participates — it never converts anything, and it cannot claim a fidelity above what its choices derive. The container ships standard profiles; a deployment adds its own.",
						children: [
							{ label: "standard names", detail: "exact · native-lowbit · mixed-precision · attn-local-ffn-remote · partial-residency · reduced-top-k · shared-only · router-browse · compact-approximate" },
						],
					},
					{
						label: "control/",
						note: "CLASS 1 — CONTROL & ROUTER",
						detail:
							"The small, decisive weights: token embeddings, normalisation weights, the LM head, and the routers that decide which experts see each token. Small, and routing errors compound — so this class is preserved at source precision, never approximated.",
					},
					{
						label: "dense/",
						note: "CLASS 2 — DENSE SPINE",
						detail:
							"The backbone every token passes through: the attention projections (softmax attention, and the linear-attention families where a model uses them), one LYRW v2 weight file per layer. A dense-only model is simply a container where this class carries the whole story.",
					},
					{
						label: "shared/",
						note: "CLASS 3 — SHARED FFN",
						detail:
							"Feed-forward weights every token uses regardless of routing: shared experts, and the shared pre/post projections of latent-space designs. Kept apart from the routed banks because they are always resident, while routed banks can be paged, trimmed, or left on disk.",
					},
					{
						label: "routed/",
						note: "CLASSES 4 & 5 — EXPERT BANKS",
						detail:
							"The bulk of a mixture-of-experts model: the per-layer expert banks — gate/up in one class, down-projections in the other. Stored as group extents, so experts can be fetched in useful units. Split into segment files when a layer outgrows the shard cap — the reason a fifty-gigabyte layer is not a fifty-gigabyte file.",
					},
					{
						label: "query/",
						note: "THE WEIGHTS ARE THE INDEX",
						detail:
							"Metadata sidecars for the query surface — labels and structure that make WALK and DESCRIBE fast. Deliberately never weights: no query index is stored beside the weights, because the weights are the query index. Delete this directory and nothing about execution changes.",
					},
					{
						label: "tokenizer.json · weight_manifest.json",
						muted: true,
						detail:
							"The supporting cast: the tokenizer that maps text to tokens, and the per-file manifest of weight payloads with their checksums — the receipts verification reads when proving the container faithful to its source.",
					},
				]}
				caption="Classes 1–5 are the five durable weight classes the serving ABI freezes. There is no sixth class: hot sets, expert retention, cache sizing, and prefetch order are profile and runtime metadata, never new storage classes."
			/>

			<Observation
				label="WHY CLASSES AT ALL"
				text="A part gets its own physical identity only when the runtime may independently omit it, quantise it, place it, prefetch it, execute it — or query it. That is the split rule. It is why the directory has exactly these parts: each one is something a profile can make a separate decision about."
			/>

			<Connection
				text="Named parts are a promise. The next chapter is whether you can check it — down to the byte."
				links={[
					{ href: "/bytes", label: "LYRW, TO THE BYTE" },
					{ href: "/representation", label: "SELECTION, NOT CONVERSION" },
				]}
			/>

			<section className="hause-grid pb-32 pt-8 border-t" style={{ borderColor: "var(--color-mist)" }}>
				<div className="col-span-12">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase opacity-50 mb-4">SOURCES</p>
					<ul className="voice-evidence text-sm opacity-60 flex flex-col gap-1">
						<li>vindex3-format-spec.md §4–5, §8–9, §15 (the ABI, 3.0-draft-2)</li>
						<li>reference implementation — index.rs (Vindex3Index)</li>
					</ul>
				</div>
			</section>
		</main>
	);
}
