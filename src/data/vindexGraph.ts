/**
 * The public graph projection — VINDEX3's documentation as a database.
 *
 * This file IS the query universe: a versioned, immutable snapshot
 * compiled into the site at build time. The query engine can only
 * traverse what exists here; nothing internal leaks because nothing
 * internal was ever projected in. The agent cannot reveal a secret
 * that isn't in its universe.
 *
 * Every canonical entry is grounded in the specification documents
 * (vindex3-format.md, vindex3-format-spec.md) and the measured
 * ledgers accounted on the Record. Statuses are honest — including
 * the open ones.
 */

export const SNAPSHOT = { id: "3.0-draft-2", date: "2026-08-29" };

export type NodeKind = "concept" | "claim" | "model" | "evidence" | "chapter";

export type GraphNode = {
	id: string;
	kind: NodeKind;
	label: string;
	href?: string;
};

export type GraphEdge = { from: string; rel: string; to: string };

export const NODES: GraphNode[] = [
	{ id: "vindex3", kind: "concept", label: "VINDEX3", href: "/" },
	{ id: "container", kind: "concept", label: "the container", href: "/container" },
	{ id: "index-json", kind: "concept", label: "index.json — sole root authority", href: "/container" },
	{ id: "component-identity", kind: "concept", label: "semantic component identity", href: "/graph" },
	{ id: "system-graph", kind: "concept", label: "the system graph", href: "/graph" },
	{ id: "representation", kind: "concept", label: "representation variants", href: "/representation" },
	{ id: "precision-map", kind: "concept", label: "the precision map", href: "/representation" },
	{ id: "authority", kind: "concept", label: "graded authority", href: "/authority" },
	{ id: "fidelity", kind: "concept", label: "the fidelity lattice", href: "/authority" },
	{ id: "four-authorities", kind: "concept", label: "Declared ≡ Resolved ≡ Graph ≡ Encoded", href: "/authority" },
	{ id: "closure", kind: "concept", label: "operand closure", href: "/execution" },
	{ id: "execution-surface", kind: "concept", label: "the execution surface", href: "/execution" },
	{ id: "deletion-invariant", kind: "concept", label: "the deletion invariant", href: "/execution" },
	{ id: "lyrw", kind: "concept", label: "LYRW v2 — the layer file", href: "/bytes" },
	{ id: "segments", kind: "concept", label: "segments and group extents", href: "/bytes" },
	{ id: "five-classes", kind: "concept", label: "the five weight classes", href: "/container" },
	{ id: "split-rule", kind: "concept", label: "the split rule", href: "/container" },
	{ id: "browse-surface", kind: "concept", label: "the browse surface (WALK / DESCRIBE)", href: "/" },
	{ id: "profiles", kind: "concept", label: "execution profiles", href: "/representation" },
	{ id: "g-ladder", kind: "concept", label: "the G-ladder", href: "/ladder" },
	{ id: "migration", kind: "concept", label: "the migration to default (M1–M4)", href: "/ladder" },
	{ id: "e8", kind: "concept", label: "the held-out architecture test (E8)", href: "/ladder" },
	{ id: "gate-primitive", kind: "concept", label: "the attention output gate", href: "/execution" },
	{ id: "bandwidth", kind: "concept", label: "the memory-bandwidth wall", href: "/why" },
	{ id: "quantisation", kind: "concept", label: "quantisation", href: "/why" },

	{ id: "claim-database", kind: "claim", label: "the model is the database", href: "/" },
	{ id: "claim-bytes", kind: "claim", label: "decode speed is a bytes problem", href: "/why" },
	{ id: "claim-selection", kind: "claim", label: "profiles select bytes, never convert", href: "/representation" },
	{ id: "claim-derived", kind: "claim", label: "authority is derived, never asserted", href: "/authority" },
	{ id: "claim-refusal", kind: "claim", label: "ambiguity is refused, never guessed", href: "/graph" },
	{ id: "claim-residency", kind: "claim", label: "the routing is the model's; the residency is yours", href: "/why" },

	{ id: "gpt-oss", kind: "model", label: "gpt-oss-20b" },
	{ id: "granite", kind: "model", label: "Granite 4.1 (3B/8B/30B)" },
	{ id: "gemma", kind: "model", label: "Gemma 4 26B-A4B" },
	{ id: "k3", kind: "model", label: "K3 (2.8T, 896 experts)" },
	{ id: "glimmer", kind: "model", label: "the four-norm model (Glimmer)" },

	{ id: "ev-106", kind: "evidence", label: "106 tok/s · M3 Max · 2026-08-20", href: "/ladder" },
	{ id: "ev-bytes", kind: "evidence", label: "1,959 → 1,269 MB/token · 2026-08-14", href: "/ladder" },
	{ id: "ev-parity", kind: "evidence", label: "identical greedy ids at every rung", href: "/ladder" },
	{ id: "ev-roundtrip", kind: "evidence", label: "five models round-trip byte-identically", href: "/ladder" },
	{ id: "ev-gate", kind: "evidence", label: "52-layer refusal naming the gate primitive", href: "/execution" },

	{ id: "record", kind: "chapter", label: "the Record", href: "/ladder" },
	{ id: "physics", kind: "chapter", label: "the Physics", href: "/why" },
];

export const EDGES: GraphEdge[] = [
	{ from: "vindex3", rel: "preserves", to: "component-identity" },
	{ from: "vindex3", rel: "supports", to: "representation" },
	{ from: "vindex3", rel: "answers_to", to: "record" },
	{ from: "vindex3", rel: "compiled_into", to: "container" },
	{ from: "container", rel: "ruled_by", to: "index-json" },
	{ from: "container", rel: "organised_as", to: "five-classes" },
	{ from: "five-classes", rel: "justified_by", to: "split-rule" },
	{ from: "container", rel: "stores_layers_as", to: "lyrw" },
	{ from: "lyrw", rel: "scales_by", to: "segments" },
	{ from: "component-identity", rel: "recorded_in", to: "system-graph" },
	{ from: "system-graph", rel: "guards", to: "claim-refusal" },
	{ from: "representation", rel: "governed_by", to: "authority" },
	{ from: "representation", rel: "selected_by", to: "profiles" },
	{ from: "representation", rel: "compiled_by", to: "precision-map" },
	{ from: "authority", rel: "graded_on", to: "fidelity" },
	{ from: "authority", rel: "proven_by", to: "four-authorities" },
	{ from: "four-authorities", rel: "completed_by", to: "closure" },
	{ from: "closure", rel: "reads", to: "execution-surface" },
	{ from: "closure", rel: "discovered", to: "gate-primitive" },
	{ from: "gate-primitive", rel: "witnessed_by", to: "ev-gate" },
	{ from: "execution-surface", rel: "enables", to: "deletion-invariant" },
	{ from: "quantisation", rel: "answers", to: "bandwidth" },
	{ from: "quantisation", rel: "disciplined_by", to: "authority" },
	{ from: "vindex3", rel: "queried_via", to: "browse-surface" },
	{ from: "browse-surface", rel: "supports", to: "claim-database" },
	{ from: "vindex3", rel: "measured_by", to: "ev-106" },
	{ from: "ev-106", rel: "measured_on", to: "gpt-oss" },
	{ from: "representation", rel: "measured_by", to: "ev-bytes" },
	{ from: "vindex3", rel: "verified_by", to: "ev-roundtrip" },
	{ from: "vindex3", rel: "gated_by", to: "g-ladder" },
	{ from: "vindex3", rel: "generalisation_tested_by", to: "e8" },
	{ from: "vindex3", rel: "adopted_via", to: "migration" },
	{ from: "claim-bytes", rel: "grounds", to: "quantisation" },
	{ from: "claim-selection", rel: "protects", to: "representation" },
	{ from: "claim-derived", rel: "protects", to: "authority" },
	{ from: "claim-residency", rel: "realised_by", to: "profiles" },
	{ from: "k3", rel: "validates_not_defines", to: "vindex3" },
	{ from: "glimmer", rel: "taught", to: "gate-primitive" },
	{ from: "ev-parity", rel: "protects", to: "ev-106" },
];

export type Intent = "compare" | "why" | "what" | "how" | "status" | "show";

export type CanonEntry = {
	id: string;
	/** The five-word canonical form — the semantic cache key. */
	summary: string;
	entities: string[];
	intent: Intent;
	/** Extra trigger fragments beyond entity/summary tokens. */
	patterns?: string[];
	answer: string;
	/** Edge indices into EDGES — the visible graph path. */
	path: number[];
	record?: { status: "PASSED" | "BUILDING" | "OPEN" | "SUPPORTED"; note: string };
	explore: string[];
};

const e = (from: string, relOrTo: string) => {
	const i = EDGES.findIndex((x) => x.from === from && (x.rel === relOrTo || x.to === relOrTo));
	if (i < 0) throw new Error(`no edge ${from}→${relOrTo}`);
	return i;
};

export const CANON: CanonEntry[] = [
	{
		id: "q-not-quantisation",
		summary: "VINDEX3 differs from quantisation formats",
		entities: ["quantisation", "quantization", "quantised", "quantized", "format"],
		intent: "compare",
		patterns: ["just another", "different from quant", "not quantisation", "not quantization"],
		answer:
			"VINDEX3 is not fundamentally a quantisation format — quantisation is one possible physical representation of a logical object, and the format's job is to keep every representation catalogued beside the original with its fidelity recorded against the source. A quantised file is a fork; a VINDEX3 variant is an entry in a ledger.",
		path: [e("vindex3", "supports"), e("representation", "governed_by"), e("authority", "graded_on")],
		record: { status: "SUPPORTED", note: "1,959 → 1,269 MB/token by selecting a present variant — no conversion" },
		explore: ["representation", "authority", "record"],
	},
	{
		id: "q-multiple-representations",
		summary: "VINDEX3 preserves multiple physical representations",
		entities: ["representation", "representations", "variants", "precision", "precisions"],
		intent: "why",
		patterns: ["multiple representations", "several encodings", "more than one precision"],
		answer:
			"Because a serving decision is not a storage decision. The bandwidth wall makes precision a lever you want to keep pulling — per role, per deployment, per experiment — and a format that seals one choice at conversion forces a fork every time you change your mind. VINDEX3 stores variants physically beside the baseline; a profile selects among present bytes and can never request a format that was not extracted.",
		path: [e("vindex3", "supports"), e("representation", "selected_by"), e("claim-selection", "protects")],
		record: { status: "SUPPORTED", note: "selection, not conversion — enforced before any byte is read" },
		explore: ["representation", "profiles", "physics"],
	},
	{
		id: "q-what-is-container",
		summary: "container is a named directory",
		entities: ["container", "directory", "model.vindex", "structure", "layout"],
		intent: "what",
		patterns: ["what is a container", "what is vindex3", "what is the container"],
		answer:
			"A VINDEX3 container is a directory whose every part is named, addressable, and checkable: one root authority (index.json), a manifest that gives stored banks their meaning, execution profiles, and the five durable weight classes — each one something a runtime may independently place, quantise, omit, or query. Not a blob: a catalogue.",
		path: [e("vindex3", "compiled_into"), e("container", "ruled_by"), e("container", "organised_as")],
		explore: ["container", "index-json", "five-classes"],
	},
	{
		id: "q-one-root",
		summary: "one root prevents competing authorities",
		entities: ["root", "index.json", "authority", "superblock"],
		intent: "why",
		patterns: ["one root", "single root", "sole root"],
		answer:
			"A second root creates competing authorities — whose checksums win, whose version controls compatibility? index.json is the one file that speaks for the container: version, identity, provenance, checksums, the segment lists. Everything else is reachable from it, and nothing else may claim its job.",
		path: [e("container", "ruled_by")],
		explore: ["index-json", "container"],
	},
	{
		id: "q-five-classes",
		summary: "five classes follow independent treatment",
		entities: ["classes", "class", "five", "control", "dense", "shared", "routed"],
		intent: "why",
		patterns: ["five classes", "weight classes", "why classes"],
		answer:
			"The five classes are the boundaries inference policy may ever want to treat independently — fetch, place, quantise, omit, or query. Control weights ride every token and stay precision-sensitive; routed banks are touched a sliver at a time. The split rule cuts only where a profile can make a separate decision; a taxonomy distinction is never a reason to split.",
		path: [e("container", "organised_as"), e("five-classes", "justified_by")],
		explore: ["five-classes", "split-rule", "container"],
	},
	{
		id: "q-lyrw",
		summary: "LYRW files describe themselves completely",
		entities: ["lyrw", "bytes", "binary", "file", "header"],
		intent: "what",
		patterns: ["layer file", "binary format", "read with a ruler"],
		answer:
			"LYRW v2 is the layer-weight file: a 24-byte header, bank descriptors, segment descriptors, one region schema per bank (experts are homogeneous, so layout is declared once), and an entry table of offsets and lengths. A reader needs nothing but the bytes in front of it, unknown tags are preserved rather than fatal, and refusal waits for the operation that actually needs what a reader cannot do.",
		path: [e("container", "stores_layers_as"), e("lyrw", "scales_by")],
		explore: ["lyrw", "segments", "container"],
	},
	{
		id: "q-segments",
		summary: "segments and extents differ deliberately",
		entities: ["segments", "segment", "extents", "groups", "shard", "cap"],
		intent: "why",
		patterns: ["several files", "20 gib", "split into files"],
		answer:
			"Two scales, two measurements. A segment file answers to file management — K3's 22.61 GiB routed layer exceeds the 20 GiB cap, so it ships as two segments of 448 experts. A group extent answers to hardware — the unit one grouped dispatch reads. Boundaries always agree: segments split only on extent edges, and conflating the scales would turn a two-file layer into fourteen for no read benefit.",
		path: [e("lyrw", "scales_by")],
		explore: ["segments", "lyrw"],
	},
	{
		id: "q-names-not-semantics",
		summary: "tensor names are not semantics",
		entities: ["names", "name", "tensor", "graph", "semantics", "meaning"],
		intent: "why",
		patterns: ["names aren", "graph exists", "why a graph", "system graph"],
		answer:
			"A tensor path is a name, not a meaning — and every runtime that guesses meaning from names carries the guess forever as a family branch. VINDEX3 judges meaning once, from evidence, at compile time, and stores it as the system graph: components with derived roles, objects whose identity is conceptual, edges whose producer must be exactly one candidate. Zero or two candidates refuse; ambiguity is never guessed.",
		path: [e("component-identity", "recorded_in"), e("system-graph", "guards")],
		explore: ["system-graph", "component-identity", "claim-refusal"],
	},
	{
		id: "q-deletion-invariant",
		summary: "deleting the checkpoint changes nothing",
		entities: ["deletion", "delete", "checkpoint", "original", "source"],
		intent: "what",
		patterns: ["deletion invariant", "delete the original", "without the checkpoint"],
		answer:
			"The deletion invariant: removing the original checkpoint, config.json, the model type and the architecture name must not change execution. The runtime sees container → system graph → operation plan → generic kernels, nothing else. It is the format's climax — the moment the container has fully absorbed the meaning and the source is no longer an authority.",
		path: [e("closure", "reads"), e("execution-surface", "enables")],
		explore: ["deletion-invariant", "execution-surface"],
	},
	{
		id: "q-hidden-defaults",
		summary: "closure hunts for hidden defaults",
		entities: ["closure", "operand", "defaults", "execution", "sufficiency"],
		intent: "how",
		patterns: ["hidden default", "operand closure", "sufficiency"],
		answer:
			"Consistency cannot prove sufficiency — four authorities can faithfully agree on an under-specified model. Operand closure is the independent witness: every stored tensor must map to a generic operation, every operation must carry judged semantics, and per-layer accounting must be total. The proof is causal: mutate a stored fact and the computation must change; where mutation changes nothing, a default was hiding.",
		path: [e("four-authorities", "completed_by"), e("closure", "reads")],
		record: { status: "BUILDING", note: "G5 half sealed — surface and closure implemented, parity staged" },
		explore: ["closure", "execution-surface", "record"],
	},
	{
		id: "q-gate-story",
		summary: "refusal taught the gate primitive",
		entities: ["gate", "refusal", "primitive", "glimmer", "52"],
		intent: "show",
		patterns: ["taught the format", "gate story", "attention output gate", "refused all 52"],
		answer:
			"The format's best story: the first real four-norm model shipped an attention-gate weight in all 52 layers, and the closure gate refused every one — naming the missing primitive rather than skipping the tensor. The gate's semantics were then judged from the reference implementation, the primitive entered the IR, and the model closed at 12/12 operands per layer. The format learns by refusing to guess.",
		path: [e("closure", "discovered"), e("gate-primitive", "witnessed_by"), e("glimmer", "taught")],
		record: { status: "PASSED", note: "sealed at 52 × 12/12 once the gate was judged" },
		explore: ["gate-primitive", "closure", "ev-gate"],
	},
	{
		id: "q-authority-derived",
		summary: "authority derives from recorded fidelity",
		entities: ["authority", "fidelity", "exact", "derived", "claim"],
		intent: "how",
		patterns: ["authority derived", "cannot claim", "baseline loophole", "exact by promotion"],
		answer:
			"Every variant's fidelity is recorded against the source at extraction — the baseline's own fidelity included, which closes the loophole where a lossy copy becomes exact merely by being promoted. A profile's authority is then the weakest fidelity across its selections, capped further when required operands are absent. Derived, never asserted: a profile cannot claim above its level, only voluntarily below it.",
		path: [e("representation", "governed_by"), e("authority", "graded_on"), e("claim-derived", "protects")],
		explore: ["authority", "fidelity", "representation"],
	},
	{
		id: "q-four-authorities",
		summary: "four authorities must agree structurally",
		entities: ["verification", "verify", "declared", "resolved", "encoded", "authorities"],
		intent: "how",
		patterns: ["four authorities", "verified against", "prove faithful"],
		answer:
			"Verification compares four independently derived views — what the source declared, what the reader resolved, what the graph recorded, what the container encodes — as pairwise links, so a failure names the two that disagree. Payloads are re-hashed at both ends, so a drifted checkpoint fails differently from a corrupted container, and the tensor table is compared entry by entry because a relabel over identical bytes is invisible to every hash.",
		path: [e("authority", "proven_by"), e("four-authorities", "completed_by")],
		record: { status: "PASSED", note: "G4 — four-authority comparison plus payload-hash equality" },
		explore: ["four-authorities", "authority", "record"],
	},
	{
		id: "q-query-surface",
		summary: "weights serve as query index",
		entities: ["query", "walk", "describe", "browse", "search", "knn"],
		intent: "how",
		patterns: ["query the weights", "weights are the query", "ask the model", "browse surface"],
		answer:
			"No query index is stored beside the weights — the gate regions inside the banks are the index, walked in place under mmap so browsing a full container reads only gate bytes. WALK and DESCRIBE are the ABI's own browse surface. Honestly graded: it ships today as an analysis-only profile, and expert-region browse parity is still an open row on the Record.",
		path: [e("vindex3", "queried_via"), e("browse-surface", "supports")],
		record: { status: "OPEN", note: "WALK/DESCRIBE parity — an open pre-freeze row" },
		explore: ["browse-surface", "claim-database", "record"],
	},
	{
		id: "q-speed",
		summary: "speed is evidence, not thesis",
		entities: ["fast", "speed", "tokens", "performance", "106"],
		intent: "status",
		patterns: ["how fast", "tokens per second", "tok/s"],
		answer:
			"106 tokens per second — gpt-oss-20b on one M3 Max, measured 2026-08-20, with a per-stage GPU ledger attributing every millisecond and the same greedy ids held on every arm. But speed is evidence, not the thesis: the thesis is that an artifact keeps its identity, semantics, provenance and representation choices for its whole life, and stays fast anyway.",
		path: [e("vindex3", "measured_by"), e("ev-106", "measured_on"), e("ev-parity", "protects")],
		record: { status: "SUPPORTED", note: "accounted on the Record, dated, with parity" },
		explore: ["ev-106", "record", "physics"],
	},
	{
		id: "q-safetensors",
		summary: "storage formats keep bytes only",
		entities: ["safetensors", "gguf", "checkpoint", "storage", "difference", "existing"],
		intent: "compare",
		patterns: ["different from safetensors", "versus safetensors", "existing formats", "other formats"],
		answer:
			"Storage formats do their job well: they keep the numbers, inspectably and portably. What they do not carry is a durable semantic, query, and execution model — which parts are which, what may consume them, which precisions remain the same model, what was proven about any of it. VINDEX3 compiles a source checkpoint's semantics in once, proves the result, and keeps both bytes and meaning for the artifact's life.",
		path: [e("vindex3", "compiled_into"), e("vindex3", "preserves"), e("vindex3", "verified_by")],
		explore: ["container", "component-identity", "four-authorities"],
	},
	{
		id: "q-bandwidth",
		summary: "decode is bandwidth-bound, not compute-bound",
		entities: ["bandwidth", "memory", "bytes", "wall", "slow"],
		intent: "why",
		patterns: ["bytes problem", "memory bandwidth", "byte floor"],
		answer:
			"To produce one token, every participating weight must cross from memory to compute, and that trip has a hard speed limit. Divide bytes per token by bandwidth and you have the byte floor — the fastest a token can possibly arrive before computation counts at all. That single fact is why precision, residency, and placement are the levers that matter, and why the file format is where they are all decided.",
		path: [e("claim-bytes", "grounds"), e("quantisation", "answers")],
		explore: ["bandwidth", "physics", "quantisation"],
	},
	{
		id: "q-moe-residency",
		summary: "routing selects; residency is policy",
		entities: ["moe", "experts", "routing", "residency", "resident", "ram"],
		intent: "how",
		patterns: ["bigger than ram", "mixture of experts", "fan out", "partial residency"],
		answer:
			"A mixture-of-experts model touches a sliver of its routed banks per token — top-k of hundreds. VINDEX3 stores experts as addressable banks in grouped extents, so a profile decides what stays resident, what pages in, and what never loads: how a model larger than memory still decodes. The routing is the model's; the residency is yours.",
		path: [e("claim-residency", "realised_by"), e("representation", "selected_by")],
		explore: ["profiles", "five-classes", "physics"],
	},
	{
		id: "q-k3",
		summary: "K3 validates, never defines VINDEX3",
		entities: ["k3", "envelope", "conformance", "models"],
		intent: "what",
		patterns: ["stress test", "conformance envelope", "which models"],
		answer:
			"K3 — 2.8 trillion parameters, 896 latent-space experts — is the stress test, but the conformance envelope holds five architectures precisely so that no K3-ism becomes the ABI. GPT-OSS, Kimi-Linear, Inkling-Small and a control each contribute a capability nothing else exercises. K3 validates the format; it does not define it.",
		path: [e("k3", "validates_not_defines"), e("vindex3", "gated_by")],
		explore: ["k3", "g-ladder", "record"],
	},
	{
		id: "q-e8",
		summary: "held-out architecture tests generalisation",
		entities: ["e8", "generalisation", "generalization", "falsify", "held-out"],
		intent: "status",
		patterns: ["honest bar", "falsify", "held out"],
		answer:
			"The strongest line in the spec is a concession written in advance: the conformance models cannot prove generalisation, because the ABI was designed against them. Only a held-out architecture, onboarded after freeze under zero format changes, tests fit versus generality — and if it fails, the portable-substrate claim is downgraded in the success criteria themselves. The bar cannot drift; it is written down before the results are.",
		path: [e("vindex3", "generalisation_tested_by"), e("vindex3", "answers_to")],
		record: { status: "OPEN", note: "E8 — runs after the freeze, by design" },
		explore: ["e8", "record"],
	},
	{
		id: "q-status",
		summary: "format works; default not flipped",
		entities: ["status", "frozen", "ready", "production", "default", "migration"],
		intent: "status",
		patterns: ["is it ready", "abi frozen", "current status", "can i use"],
		answer:
			"Five production models already encode, verify, and execute through the format byte-identically, and containers serve real inference. But no byte freezes until the pre-registered gates pass, and the default extractor still writes the previous generation — the flip is a named decision (M4), made in exactly one place, not yet made. The Record keeps the whole ledger, dated.",
		path: [e("vindex3", "adopted_via"), e("vindex3", "gated_by"), e("vindex3", "verified_by")],
		record: { status: "BUILDING", note: "M1–M3 passed · M4 (the flip) open · G5 building" },
		explore: ["migration", "g-ladder", "record"],
	},
	{
		id: "q-who-defines",
		summary: "documents define; tools implement",
		entities: ["larql", "tool", "documents", "spec", "defines", "independent"],
		intent: "what",
		patterns: ["who defines", "proprietary", "reference implementation", "independent of"],
		answer:
			"The format is defined by its documents — the ABI and the living spec, both public — not by any tool. A reference implementation compiles, verifies, and serves it, and proves the claims on the Record; but nothing in the format's contract requires that implementation, and the deletion invariant makes the point structural: execution depends only on what the container itself declares.",
		path: [e("vindex3", "answers_to"), e("execution-surface", "enables")],
		explore: ["record", "deletion-invariant"],
	},
	{
		id: "q-provenance",
		summary: "provenance survives every transformation",
		entities: ["provenance", "lineage", "hash", "checksum", "faithful"],
		intent: "how",
		patterns: ["prove faithful", "provenance", "chain of custody"],
		answer:
			"Every canonical representation records the source payload hash computed while copying, and the encoded segment records its own; at verify time both ends are re-hashed and compared with what was recorded, so drift and corruption fail differently and by name. Variants carry fidelity graded against the source. The container is a chain of custody, not just a warehouse.",
		path: [e("vindex3", "verified_by"), e("authority", "proven_by")],
		record: { status: "PASSED", note: "G4 — both ends re-hashed, table compared entry by entry" },
		explore: ["four-authorities", "authority", "record"],
	},
];

export const SUGGESTIONS = [
	"Why isn't VINDEX3 just another quantised model format?",
	"Why does VINDEX3 preserve multiple representations?",
	"What happens if I delete the original checkpoint?",
	"How do I know a container is faithful to its source?",
	"Is it ready to use today?",
];
