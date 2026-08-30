/**
 * THE VINDEX KNOWLEDGE GRAPH — what VINDEX3 *means*.
 *
 * Deliberately distinct from a container's SystemGraph, which records
 * what one particular model *is* (components, logical objects,
 * hidden-state edges) and lives inside the artifact. This graph holds
 * concepts, claims, evidence, gates, and explanations — the universe
 * Ask resolves against. The two are joined by stable semantic
 * identities (an operand role like FfnGate appears in a container's
 * facts and resolves here to its meaning), never by merging them:
 * one vocabulary, linked authorities.
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

export const SNAPSHOT = { id: "3.0-candidate", date: "2026-08-30" };

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

	{ id: "engines", kind: "concept", label: "both engines, one output", href: "/why" },
	{ id: "write-order", kind: "concept", label: "segments first, index.json last", href: "/graph" },
	{ id: "programme-manifest", kind: "concept", label: "moe_manifest.json — banks bound to programmes", href: "/container" },
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
	{ from: "vindex3", rel: "executes_on", to: "engines" },
	{ from: "ev-parity", rel: "witnesses", to: "engines" },
	{ from: "quantisation", rel: "held_to", to: "ev-parity" },
	{ from: "container", rel: "written_in_order", to: "write-order" },
	{ from: "container", rel: "given_meaning_by", to: "programme-manifest" },
	{ from: "five-classes", rel: "decides_residency_with", to: "profiles" },
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
		record: { status: "SUPPORTED", note: "G5 sealed — closure, golden parity and causal controls all landed; the controls found no hidden defaults" },
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
		patterns: ["how fast", "tokens per second", "tok/s", "m3 max", "on a laptop", "macbook", "what was measured"],
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
			"Since 2026-08-30 the specification is a Candidate, no longer a draft: production models encode, verify, and execute through the format byte-identically, containers serve real inference, and the LQL surface reached full parity — execution, tracing, mutation, compile, diff, compact. But no byte freezes until the pre-registered gates pass, and the default extractor still writes the previous generation — the flip is a named decision (M4), made in exactly one place, not yet made. The Record keeps the whole ledger, dated.",
		path: [e("vindex3", "adopted_via"), e("vindex3", "gated_by"), e("vindex3", "verified_by")],
		record: { status: "SUPPORTED", note: "3.0-candidate · M1–M3 passed · M4 (the flip) open · G5 sealed" },
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
		patterns: ["prove faithful", "provenance", "chain of custody", "faithful to its source", "faithful to the source"],
		answer:
			"Every canonical representation records the source payload hash computed while copying, and the encoded segment records its own; at verify time both ends are re-hashed and compared with what was recorded, so drift and corruption fail differently and by name. Variants carry fidelity graded against the source. The container is a chain of custody, not just a warehouse.",
		path: [e("vindex3", "verified_by"), e("authority", "proven_by")],
		record: { status: "PASSED", note: "G4 — both ends re-hashed, table compared entry by entry" },
		explore: ["four-authorities", "authority", "record"],
	},
];

export const CANON_EXTENSION: CanonEntry[] = [
	{
		id: "q-four-bit-isnt",
		summary: "a four-bit model is never four bits",
		entities: ["4-bit", "nvfp4", "scales", "scale", "4.5"],
		intent: "why",
		patterns: ["four bit", "four bits", "4 bits", "4-bit", "4.5", "bits does a model need", "how many bits"],
		answer:
			"Because the scales are never free. In NVFP4, sixteen weights share one eight-bit scale and each picks a four-bit slot on it — 72 bits per sixteen weights, 4.5 effective. Mix in the components a precision map protects at BF16 and the recorded granite artifact lands at 5.65 effective bits per weight. 'This is a 4-bit model' is an incomplete sentence; the complete one is a precision map.",
		path: [e("representation", "compiled_by"), e("quantisation", "disciplined_by")],
		record: { status: "SUPPORTED", note: "recorded — granite-4.1-3b: 4.5 uniform · 5.65 with the late-5 map" },
		explore: ["precision-map", "representation", "record"],
	},
	{
		id: "q-never-judge-token",
		summary: "never judge by the token",
		entities: ["token", "argmax", "judge", "output", "same"],
		intent: "why",
		patterns: ["judge quant", "by the token", "same answer", "same output", "argmax", "text is the same", "looks the same"],
		answer:
			"Because the token can survive damage that destroys the model. In a recorded run, a ×100 scaling bug in the output head produced the same top token at every position — one hundred percent top-1 agreement, zero flips — while the probability distribution was annihilated: 55.775% became 100%, and the KL divergence hit 284.8 bits at one position. Every test that compares strings passed. Fidelity is measured in probability space — KL, ΔNLL, top-k, margin — never by the token the model picked.",
		path: [e("quantisation", "held_to"), e("ev-parity", "protects")],
		record: { status: "SUPPORTED", note: "recorded — granite-4.1-3b, the bug arm of the quality bank" },
		explore: ["quantisation", "ev-parity", "record"],
	},
	{
		id: "q-what-is-vindex3",
		summary: "the model is the database",
		entities: ["vindex3", "vindex", "database"],
		intent: "what",
		patterns: ["what is vindex", "what's vindex", "whats vindex", "tell me about vindex", "explain vindex", "what is this"],
		answer:
			"VINDEX3 is a way of storing an AI model so the same copy can be run, questioned, and checked — nothing repackaged, nothing thrown away. An open container specification, defined by two public documents: a directory whose every part is named, addressable, and provable, where the weights themselves stay queryable. Five production models already round-trip through it byte-identically, and containers serve real inference — 106 tokens per second on one laptop, with the answer provably unchanged.",
		path: [e("vindex3", "compiled_into"), e("vindex3", "preserves"), e("vindex3", "queried_via"), e("vindex3", "verified_by")],
		record: { status: "SUPPORTED", note: "five models round-trip byte-identically · the Record keeps the ledger" },
		explore: ["container", "browse-surface", "record"],
	},
	{
		id: "q-quantisation-answers",
		summary: "changed numbers can change answers",
		entities: ["answers", "answer", "accuracy", "greedy", "identical", "degrade", "quality"],
		intent: "why",
		patterns: ["change the answer", "changes the answer", "change answers", "same answer", "affect the answer", "affect accuracy", "lose quality", "degrade"],
		answer:
			"It can — snapped numbers are changed numbers, and small moves compounded through every layer can change an answer. Which is why nothing ships unmeasured: across the whole optimisation ladder, 10.2 to 106 tokens per second, GPU and CPU produced the identical greedy output, re-verified at every rung. Faster is only accepted when it is provably the same — and when a representation does change results, its fidelity says so, recorded against the source.",
		path: [e("quantisation", "held_to"), e("ev-parity", "protects"), e("quantisation", "disciplined_by")],
		record: { status: "SUPPORTED", note: "identical greedy ids at every rung, 2026-08-10 → 2026-08-20" },
		explore: ["ev-parity", "quantisation", "record"],
	},
	{
		id: "q-analysis-only",
		summary: "analysis-only cannot execute completely",
		entities: ["analysis-only", "analysis"],
		intent: "what",
		patterns: ["analysis only", "analysis-only"],
		answer:
			"The bottom of the fidelity lattice: a profile incapable of complete forward execution — router and browse slices, kept for inspection rather than inference. It is an honest grade, not a defect: the omission is declared and folded into what the profile may claim. The browse surface ships today as an analysis-only profile, and the Record says so on the front page.",
		path: [e("authority", "graded_on"), e("vindex3", "queried_via")],
		record: { status: "OPEN", note: "expert-region browse parity — an open pre-freeze row" },
		explore: ["fidelity", "browse-surface", "record"],
	},
	{
		id: "q-always-resident",
		summary: "small decisive weights stay resident",
		entities: ["resident", "residency", "loaded", "memory"],
		intent: "what",
		patterns: ["always resident", "stays resident", "which parts are resident", "always loaded", "stay in memory"],
		answer:
			"The control class — token embeddings, normalisation weights, the LM head, and the routers — rides every token, so it is always resident and preserved at source precision, never approximated. Shared feed-forward weights stay resident too. The routed expert banks are the opposite case: paged, trimmed, or left on disk as a profile decides. The split rule cuts exactly where those decisions differ.",
		path: [e("container", "organised_as"), e("five-classes", "decides_residency_with"), e("claim-residency", "realised_by")],
		explore: ["five-classes", "profiles", "split-rule"],
	},
	{
		id: "q-independent-impl",
		summary: "an independent reader needs only documents",
		entities: ["independent", "implementation", "implement", "myself", "reader"],
		intent: "how",
		patterns: ["independent implementation", "implement vindex3", "another implementation", "read a container myself", "write my own"],
		answer:
			"Open index.json — the sole root; its version field is the only detection, never filename sniffing. Read system_graph.json, stored verbatim. Every LYRW file describes itself completely: a reader needs nothing but the bytes in front of it, and unknown tags are preserved rather than fatal. The format is defined by its two public documents, not by any tool — and the deletion invariant makes that structural.",
		path: [e("container", "ruled_by"), e("container", "stores_layers_as"), e("vindex3", "answers_to")],
		explore: ["index-json", "lyrw", "deletion-invariant"],
	},
	{
		id: "q-source-equivalent",
		summary: "fidelity levels are graded meanings",
		entities: ["source-equivalent", "source-exact", "levels", "lattice"],
		intent: "what",
		patterns: ["source equivalent", "source-equivalent", "source exact", "source-exact", "fidelity levels", "fidelity lattice"],
		answer:
			"The lattice, top down: source-exact — decoded values bit-identical to the checkpoint in its own encoding family. Source-equivalent — a different encoding whose decode reproduces the source values exactly. Numerically-approximate — same architecture, lossy representation. Structurally-approximate — components omitted or replaced, and the omission must be listed. Analysis-only — incapable of complete forward execution. Every variant's level is recorded against the source at extraction; a profile's claim is folded down from its selections.",
		path: [e("representation", "governed_by"), e("authority", "graded_on"), e("claim-derived", "protects")],
		explore: ["fidelity", "authority", "representation"],
	},
	{
		id: "q-programme-manifest",
		summary: "the manifest gives banks meaning",
		entities: ["programme", "programmes", "program", "manifest", "moe_manifest"],
		intent: "what",
		patterns: ["what is a programme", "moe_manifest", "bank mean", "what consumes"],
		answer:
			"Weight files describe storage only; moe_manifest.json says what the stored banks are for. It binds each bank to a programme — the small recipe of operations that consumes it, drawn from a named registry (gated-mlp-v1, gpt-oss-expert-v1, latent-moe-v1, …). The binary carries no programme identity of its own, and the manifest is the single authority for that fact.",
		path: [e("container", "given_meaning_by"), e("container", "ruled_by")],
		explore: ["programme-manifest", "container"],
	},
	{
		id: "q-write-order",
		summary: "a crash never fakes a container",
		entities: ["crash", "interrupted", "midway", "partial"],
		intent: "why",
		patterns: ["write order", "crashes midway", "crash during", "partially written", "half written"],
		answer:
			"The write order is deliberate: segments first, index.json last. A crash midway leaves a directory that never claimed to be a container — rather than one that claims to be and is missing its banks. The root is written only when everything it speaks for already exists.",
		path: [e("container", "written_in_order"), e("container", "ruled_by")],
		explore: ["write-order", "index-json"],
	},
	{
		id: "q-engines",
		summary: "the engine is a choice",
		entities: ["cpu", "gpu", "engine", "hardware", "metal"],
		intent: "what",
		patterns: ["run on cpu", "on a cpu", "without a gpu", "which hardware", "cpu and gpu"],
		answer:
			"A VINDEX3 container decodes on both engines — GPU and plain CPU — and the measured outputs are identical, token for token. At decode time both are mostly waiting on the same thing, bytes, so the format's job is to make the bytes addressable: mapped straight into memory, read in place, no unpacking. The engine is a choice. The bytes are not.",
		path: [e("vindex3", "executes_on"), e("ev-parity", "witnesses")],
		record: { status: "SUPPORTED", note: "GPU and CPU identical greedy output — accounted on the Record" },
		explore: ["engines", "ev-parity", "physics"],
	},
	// ── The quantisation vocabulary people arrive with, classified ──
	{
		id: "q-what-is-nf4",
		summary: "nf4 is a numeric format",
		entities: ["nf4", "normalfloat"],
		intent: "what",
		patterns: ["nf4", "normalfloat", "normal float"],
		answer:
			"NF4 is an alphabet, not a scheme: sixteen four-bit code levels placed where normally-distributed weights actually fall, instead of evenly. In the five-layer taxonomy — numeric format, scheme, method, container, execution — it sits in the first layer, beside BF16, FP8 and NVFP4. VINDEX3 treats any such alphabet as a representation encoding: chosen per component, recorded in the directory, never inferred from a filename.",
		path: [e("representation", "compiled_by"), e("quantisation", "disciplined_by")],
		explore: ["representation", "quantisation"],
	},
	{
		id: "q-what-is-q4k",
		summary: "q4_k is a block scheme",
		entities: ["q4_k", "q4k", "k-quant"],
		intent: "what",
		patterns: ["q4_k", "q4k", "k-quant", "kquant", "k quant"],
		answer:
			"Q4_K is a scheme — how weights share their metadata, not which alphabet they are written in: 256-weight superblocks of 32-weight blocks, each block carrying a scale and a minimum. Count those and its nominal four-bit codes land near 4.5 bits per weight — the same arithmetic lesson NVFP4 teaches by a different route, because scales are never free. In the five-layer taxonomy it sits in the second layer, above the numeric format and below the method that picks the codes.",
		path: [e("representation", "compiled_by"), e("quantisation", "disciplined_by")],
		explore: ["representation", "quantisation"],
	},
	{
		id: "q-what-is-gptq-awq",
		summary: "gptq and awq are methods",
		entities: ["gptq", "awq"],
		intent: "what",
		patterns: ["gptq", "awq"],
		answer:
			"GPTQ and AWQ are methods — ways of choosing the codes, not ways of storing them. Both use calibration data to decide which representable value each weight should snap to; they can feed the same scheme and the same numeric format and produce different bytes. That is exactly why the container records the outcome and its provenance: two artifacts can share every storage layer and differ only in how the codes were chosen.",
		path: [e("representation", "compiled_by"), e("quantisation", "disciplined_by")],
		explore: ["representation", "provenance"],
	},
	{
		id: "q-what-is-a-scale",
		summary: "a scale prices the codes",
		entities: ["scale", "scales", "zero point"],
		intent: "what",
		patterns: ["what is a scale", "what's a scale", "the scales", "group scale", "zero point", "zero-point", "zero points"],
		answer:
			"A scale converts small codes back into real magnitudes: a group of weights shares one, and each weight's code multiplies it. A zero point shifts the grid so it need not be centred on zero. They are the metadata a scheme spends its bytes on — and they are never free: NVFP4's one eight-bit scale per sixteen weights is precisely the half bit that turns 'four-bit' into 4.5 bits per weight.",
		path: [e("representation", "compiled_by"), e("quantisation", "disciplined_by")],
		record: { status: "SUPPORTED", note: "derived — 72 bits per 16 weights: 64 code bits + 8 scale bits" },
		explore: ["quantisation", "representation"],
	},
	{
		id: "q-what-is-p99",
		summary: "p99 is the tail",
		entities: ["p99", "tail", "percentile"],
		intent: "what",
		patterns: ["p99", "percentile", "the tail", "worst positions"],
		answer:
			"The 99th percentile of per-position divergence — the worst one percent of places a representation damaged, which a mean happily hides. Recorded: under uniform NVFP4, granite's mean KL is 0.2778 bits but its p99 is 4.6224 — the damage lives in the tail, and the tail is where a model says something wrong with confidence. That is why the Record reports both, and why representation decisions answer to p99, not to the average.",
		path: [e("quantisation", "held_to"), e("vindex3", "answers_to")],
		record: { status: "SUPPORTED", note: "recorded — granite-4.1-3b uniform NVFP4: mean 0.2778 · p99 4.6224" },
		explore: ["record", "quantisation"],
	},
	{
		id: "q-down-proj-protection",
		summary: "the obvious protection made it worse",
		entities: ["down_proj", "protection", "protect"],
		intent: "why",
		patterns: ["protecting down", "down-proj protection", "down proj protection", "protection fail", "why did protecting", "protect the obvious"],
		answer:
			"Recorded, and worth sitting with: keeping every down_proj at BF16 — the intuitive protection — cost over a gigabyte and moved granite's tail from 4.6224 to 4.8010. Worse. Keeping the last five FFN layers instead cost 431 MiB and moved it to 1.2826 — three and a half times better. Measurements can justify a map; VINDEX3 can express, compile and execute it; automatically discovering the right one remains open — four cheap screens have been tried against ground truth, and all four failed.",
		path: [e("representation", "compiled_by"), e("vindex3", "answers_to")],
		record: { status: "SUPPORTED", note: "recorded — granite-4.1-3b: all-down_proj 4.8010 · late-5 FFN 1.2826" },
		explore: ["precision-map", "record"],
	},
	{
		id: "q-who-writes-the-map",
		summary: "nothing can discover the map yet",
		entities: ["discover", "sensitivity", "screen", "automatic"],
		intent: "why",
		patterns: ["who writes the map", "who writes the precision", "discover the map", "automatic quantization", "automatically quantize", "be automated", "automated", "sensitivity screen", "auto-discover", "automatic precision"],
		answer:
			"Four cheap screens have been measured against ground truth, and all four failed. Weight error alone carries no semantic signal (ρ −0.313). Activation-weighted relative error is worse (−0.524) — the denominator rewards small outputs. Absolute local consequence almost works (+0.595) but confidently protects down_proj, the one tensor where protection measurably worsens the tail, because a local score cannot see where an error lands in the computation. Replaying errors downstream costs five times more than measuring the truth. Measurements can justify a map; VINDEX3 can express, compile and execute it; discovering it automatically remains open on the Record.",
		path: [e("quantisation", "held_to"), e("vindex3", "answers_to")],
		record: { status: "SUPPORTED", note: "recorded — SENSITIVITY-1A/1B/1B′/1C vs the banked granite sweep · FISHER open" },
		explore: ["precision-map", "record"],
	},
	{
		id: "q-install-vindex",
		summary: "install the vindex cli",
		entities: ["install", "vindex-cli", "binary", "download"],
		intent: "how",
		patterns: ["install", "get started", "getting started", "how do i start", "download the cli", "try it locally"],
		answer:
			"A prebuilt binary ships with each release, and any platform with stable Rust builds from source: cargo install --git github.com/chrishayuk/larql vindex-cli. Seven verbs — inspect, describe, representations, diff, represent, precision, verify — each answering from the artifact alone, each speaking --json. The get-started page walks all of them against a real container, with the recorded outputs.",
		path: [e("vindex3", "queried_via")],
		explore: ["record"],
	},
];
CANON.push(...CANON_EXTENSION);

export const SUGGESTIONS = [
	"Does quantisation change the answers a model gives?",
	"What does the gate projection actually do?",
	"What happens if I delete the original checkpoint?",
	"How would an independent implementation read a container?",
	"What is still open?",
];

/* ------------------------------------------------------------------
   THE ENTITY LAYER — the machinery vocabulary as graph authority.

   One entity per concept the site teaches; Ask definitions, the
   Explorer's semantic DESCRIBE, and the Anatomy chapter all answer
   from these records, so the three surfaces cannot disagree. Each
   carries a five-word semantic signature — the compact address layer
   over the graph — a one-sentence role, and its recorded relations.
   ------------------------------------------------------------------ */

export type EntityGroup = "layer" | "attention" | "attention-families" | "feed-forward" | "moe" | "format";

export type Entity = {
	id: string;
	/** The resolution surface — every name a question might use. */
	names: string[];
	display: string;
	/** The five-word semantic signature. */
	five: string;
	/** One sentence: what it does. */
	role: string;
	/** System-voice explanation. */
	detail: string;
	group: EntityGroup;
	relations: { rel: string; to: string }[];
	href: string;
	/** The Explorer command that shows it. */
	explorer?: string;
};

export const ENTITIES: Entity[] = [
	{
		id: "layer",
		names: ["layer", "layers", "block", "transformer block"],
		display: "LAYER",
		five: "attention then feed-forward, repeated",
		role: "One pass of the machine — in a conventional decoder layer: look backwards along the sentence, then transform what was found, repeated dozens of times per token.",
		detail: "A layer does exactly two things. Attention reads every earlier token; the feed-forward network transforms what attention gathered. Each result is added to a running stream rather than replacing it, which is why a layer's contribution can be measured, attributed, or skipped.",
		group: "layer",
		relations: [
			{ rel: "contains", to: "attention" },
			{ rel: "contains", to: "feed-forward" },
			{ rel: "disciplined_by", to: "residual" },
			{ rel: "kept_in_range_by", to: "norm" },
		],
		href: "/anatomy",
		explorer: "TREE layer.12",
	},
	{
		id: "residual",
		names: ["residual", "residual stream", "stream", "skip connection"],
		display: "RESIDUAL",
		five: "results added, never overwritten",
		role: "The discipline that every layer adds its contribution to a running representation instead of replacing it.",
		detail: "Because everything is added to the stream, a layer can be skipped, measured, or attributed without the story falling apart — the reason per-layer accounting is possible at all.",
		group: "layer",
		relations: [{ rel: "disciplines", to: "layer" }],
		href: "/anatomy",
	},
	{
		id: "norm",
		names: ["norm", "norms", "layernorm", "rmsnorm", "normalization", "normalisation"],
		display: "NORM",
		five: "keeps numbers in workable range",
		role: "A thermostat, not a thinker: keeps the stream's numbers in range before each move.",
		detail: "Norms appear before attention and before the feed-forward network. They carry the source precision in a VINDEX3 container — small, precision-sensitive, always resident.",
		group: "layer",
		relations: [{ rel: "guards", to: "layer" }],
		href: "/anatomy",
	},
	{
		id: "embedding",
		names: ["embedding", "embeddings", "embed", "vocab"],
		display: "EMBEDDING",
		five: "words become vectors of numbers",
		role: "The table that turns a token into the hidden-width vector the layers operate on.",
		detail: "One row per vocabulary entry. In the worked example the output head reuses the embedding — bound, not duplicated — which the system graph records as a relationship, not a naming convention.",
		group: "layer",
		relations: [{ rel: "feeds", to: "layer" }],
		href: "/anatomy",
	},
	{
		id: "attention",
		names: ["attention", "self-attention", "attn"],
		display: "ATTENTION",
		five: "each token reads the past",
		role: "The first move of a layer: every token asks questions of the tokens before it, and information flows back where the questions match.",
		detail: "Attention gives each token three faces made by three tensors — a query, a key, a value — plus an output projection that writes the gathered result back to the stream.",
		group: "attention",
		relations: [
			{ rel: "contains", to: "q" },
			{ rel: "contains", to: "k" },
			{ rel: "contains", to: "v" },
			{ rel: "contains", to: "o" },
			{ rel: "belongs_to", to: "layer" },
		],
		href: "/anatomy",
		explorer: "DESCRIBE layer.12.attention",
	},
	{
		id: "q",
		names: ["q", "query", "q_proj", "qproj", "queries"],
		display: "Q — q_proj",
		five: "what am I looking for",
		role: "Turns this token's state into the questions it asks of every token before it.",
		detail: "A verb asking for its subject; a pronoun asking who it stands for. The query is compared against every earlier token's key, and where they agree strongly, that token's value flows back.",
		group: "attention",
		relations: [
			{ rel: "belongs_to", to: "attention" },
			{ rel: "compared_against", to: "k" },
		],
		href: "/anatomy",
		explorer: "DESCRIBE layer.12.attention.q",
	},
	{
		id: "k",
		names: ["k", "key", "k_proj", "kproj", "keys"],
		display: "K — k_proj",
		five: "what do I contain",
		role: "Gives every earlier token an answerable surface — the description queries are compared against.",
		detail: "A strong query–key match means: this token matters to you. The key is the matching surface; the information itself travels through the value.",
		group: "attention",
		relations: [
			{ rel: "belongs_to", to: "attention" },
			{ rel: "answers", to: "q" },
		],
		href: "/anatomy",
		explorer: "DESCRIBE layer.12.attention.k",
	},
	{
		id: "v",
		names: ["v", "value", "v_proj", "vproj", "values"],
		display: "V — v_proj",
		five: "what do I return",
		role: "Carries the actual information that flows back when a query matches a key.",
		detail: "Keys are for matching; values are what is returned. When attention decides an earlier token matters, it is the value projection of that token that joins the current one.",
		group: "attention",
		relations: [{ rel: "belongs_to", to: "attention" }],
		href: "/anatomy",
		explorer: "DESCRIBE layer.12.attention.v",
	},
	{
		id: "o",
		names: ["o", "output", "o_proj", "oproj", "output projection"],
		display: "O — o_proj",
		five: "write the answer back",
		role: "Collects what attention gathered across all heads and writes it into the stream, sized to fit.",
		detail: "The closing move of attention: everything the heads collected, combined and projected back to the hidden width so the residual stream can absorb it.",
		group: "attention",
		relations: [{ rel: "closes", to: "attention" }],
		href: "/anatomy",
		explorer: "DESCRIBE layer.12.attention.output",
	},
	{
		id: "feed-forward",
		names: ["ffn", "feed-forward", "feedforward", "mlp", "feed forward"],
		display: "FEED-FORWARD",
		five: "expand, judge, compress, add",
		role: "The second move of a layer, and where most of a model's weight lives: make the space bigger, decide what gets through, bring it back home.",
		detail: "Three tensors — gate, up, down — are the entire mechanism. Up expands the hidden state into a wider working space, gate judges every channel of it, the two multiply, and down compresses the result back into the stream.",
		group: "feed-forward",
		relations: [
			{ rel: "contains", to: "gate" },
			{ rel: "contains", to: "up" },
			{ rel: "contains", to: "down" },
			{ rel: "belongs_to", to: "layer" },
		],
		href: "/anatomy",
		explorer: "DESCRIBE layer.12.ffn",
	},
	{
		id: "gate",
		names: ["gate", "gate_proj", "gateproj", "ffngate", "gate projection", "gating"],
		display: "GATE — gate_proj",
		five: "controls feed-forward feature activation",
		role: "Builds a second wide vector whose job is judgement: it scores every expanded channel for how much it should matter right now.",
		detail: "The gate's output multiplies the up projection's output, channel by channel — scored channels pass, the rest fade. That single multiplication is the whole trick the literature calls a gated unit (SwiGLU).",
		group: "feed-forward",
		relations: [
			{ rel: "paired_with", to: "up" },
			{ rel: "belongs_to", to: "feed-forward" },
			{ rel: "represented_by", to: "gate-up" },
		],
		href: "/anatomy",
		explorer: "DESCRIBE layer.12.ffn.gate",
	},
	{
		id: "up",
		names: ["up", "up_proj", "upproj", "ffnup", "up projection"],
		display: "UP — up_proj",
		five: "expands hidden representation dimensionality",
		role: "Expands the hidden state into a much wider intermediate space — more room to transform information than the stream itself allows.",
		detail: "In the worked example, 2,048 numbers become 6,144. The width is temporary: after the gate's judgement applies, the down projection returns the result to the stream's width.",
		group: "feed-forward",
		relations: [
			{ rel: "paired_with", to: "gate" },
			{ rel: "belongs_to", to: "feed-forward" },
			{ rel: "represented_by", to: "gate-up" },
		],
		href: "/anatomy",
		explorer: "DESCRIBE layer.12.ffn.up",
	},
	{
		id: "down",
		names: ["down", "down_proj", "downproj", "ffndown", "down projection"],
		display: "DOWN — down_proj",
		five: "returns intermediate representation home",
		role: "Compresses the judged wide representation back to the hidden width, and the result joins the stream for the next layer.",
		detail: "The closing move of the feed-forward network. In a VINDEX3 container it is stored as its own bank — unlike gate and up, which are consumed together and stored together.",
		group: "feed-forward",
		relations: [
			{ rel: "belongs_to", to: "feed-forward" },
			{ rel: "stored_apart_from", to: "gate-up" },
		],
		href: "/anatomy",
		explorer: "DESCRIBE layer.12.ffn.down",
	},
	{
		id: "gate-up",
		names: ["gate_up", "gateup", "gate-up", "routed.gate_up", "expertgateup"],
		display: "GATE_UP — the paired bank",
		five: "stores paired expert gate-up weights",
		role: "The physical representation that stores gate and up together, because the gated feed-forward programme consumes them together.",
		detail: "A semantic fact became a physical layout: gate and up are read in the same operation, so the container stores them as one bank per expert — and down separately, because it is consumed separately. The layout is an argument, not a habit.",
		group: "feed-forward",
		relations: [
			{ rel: "represents", to: "gate" },
			{ rel: "represents", to: "up" },
			{ rel: "physical_reason", to: "feed-forward" },
		],
		href: "/representation",
		explorer: "DESCRIBE layer.12.routed.gate_up",
	},
	{
		id: "router",
		names: ["router", "routing", "route"],
		display: "ROUTER",
		five: "reads token, picks few experts",
		role: "A small tensor that reads each token and chooses which few experts answer it.",
		detail: "In the worked example: 32 candidates, 4 chosen, per token. The router's weights are preserved at source precision — small, load-bearing, always resident. The routing is the model's; the residency is yours.",
		group: "moe",
		relations: [
			{ rel: "selects", to: "expert" },
			{ rel: "belongs_to", to: "moe" },
		],
		href: "/anatomy",
		explorer: "DESCRIBE layer.12.router",
	},
	{
		id: "expert",
		names: ["expert", "experts"],
		display: "EXPERT",
		five: "another gate-up-down, kept many times",
		role: "In the gated-MLP form, nothing exotic: one more feed-forward triple — gate, up, down — kept dozens of times so a router can choose per token. Other expert programmes exist; the manifest names which one a bank runs.",
		detail: "A mixture-of-experts layer grows many ordinary feed-forward networks instead of one enormous one. Most experts stay dark on any given token, which is why residency policy exists at all.",
		group: "moe",
		relations: [
			{ rel: "is_a", to: "feed-forward" },
			{ rel: "selected_by", to: "router" },
		],
		href: "/anatomy",
		explorer: "TREE layer.12",
	},
	{
		id: "moe",
		names: ["moe", "mixture of experts", "mixture-of-experts"],
		display: "MIXTURE OF EXPERTS",
		five: "many feed-forwards, chosen per token",
		role: "The way models grew: not one enormous feed-forward network, but many ordinary ones with a router choosing a handful per token.",
		detail: "Because most of the model sits idle on any one token, the format stores experts as addressable banks — and a profile decides what stays resident, what pages in, and what never loads.",
		group: "moe",
		relations: [
			{ rel: "contains", to: "router" },
			{ rel: "contains", to: "expert" },
		],
		href: "/anatomy",
		explorer: "TREE layer.12",
	},

	// ── The format vocabulary — grounded in the chapter exhibits ──
	{
		id: "container-dir",
		names: ["container", "model.vindex", "directory"],
		display: "THE CONTAINER",
		five: "a directory, not a blob",
		role: "A VINDEX3 container is a directory whose every part is named, addressable, and checkable — one root authority, five durable weight classes, profiles, manifests, and the system graph.",
		detail: "Compiled once from a checkpoint — inventory, plan, graph, encode, verify — and proven byte-faithful before the source may be deleted. Written segments-first, index.json last, so a crash never leaves something claiming to be a container.",
		group: "format",
		relations: [
			{ rel: "ruled_by", to: "index-file" },
			{ rel: "organised_as", to: "weight-classes" },
			{ rel: "carries", to: "system-graph-e" },
		],
		href: "/container",
		explorer: "SHOW COMPONENTS",
	},
	{
		id: "index-file",
		names: ["index.json", "index", "root", "root authority"],
		display: "index.json — THE ROOT",
		five: "one file speaks for everything",
		role: "The sole root authority: the one file every reader opens first, and the only place the container speaks for itself.",
		detail: "Version (3 — the only detection, never filename sniffing), identity, geometry, the representation catalogue, profiles and variants, the segment map, and the authority declaration. If a fact matters to loading the container, it is here or reachable from here. There is no second root: a second root creates competing authorities.",
		group: "format",
		relations: [{ rel: "rules", to: "container-dir" }],
		href: "/container",
		explorer: "SHOW AUTHORITY",
	},
	{
		id: "weight-classes",
		names: ["classes", "weight classes", "control", "dense", "shared", "routed"],
		display: "THE FIVE WEIGHT CLASSES",
		five: "five classes, one split rule",
		role: "Control and routers; the dense spine; shared FFN; and the two routed expert classes — the exact boundaries inference policy may treat independently.",
		detail: "A part gets its own physical identity only when the runtime may independently omit, quantise, place, prefetch, execute — or query it. That is the split rule; a taxonomy distinction is never a reason to split. There is no sixth class: hot sets and cache sizing are profile metadata, never storage classes.",
		group: "format",
		relations: [
			{ rel: "belongs_to", to: "container-dir" },
			{ rel: "decided_by", to: "profile-e" },
		],
		href: "/container",
		explorer: "SHOW COMPONENTS",
	},
	{
		id: "representation-e",
		names: ["representation", "representations", "variant", "variants", "region set"],
		display: "REPRESENTATION",
		five: "physical encoding of semantic component",
		role: "A region set may carry multiple physically present variants of one identity; a profile selects a present variant — selection, not conversion.",
		detail: "Every copy lives beside its original as a named variant with its fidelity recorded against the source at extraction. Selecting an absent variant fails closed before any byte is read. New variants arrive as incremental packs beside the baseline — adding a representation costs the pack's bytes, not the container's.",
		group: "format",
		relations: [
			{ rel: "selected_by", to: "profile-e" },
			{ rel: "graded_by", to: "fidelity-e" },
		],
		href: "/representation",
		explorer: "SHOW REPRESENTATIONS",
	},
	{
		id: "profile-e",
		names: ["profile", "profiles"],
		display: "PROFILE",
		five: "a way of running, chosen",
		role: "A profile selects which variants load, what stays resident, and how much of the model participates — it never converts anything, and it cannot claim a fidelity above what its choices derive.",
		detail: "The container ships standard profiles — exact, native-lowbit, mixed-precision, partial-residency, shared-only, router-browse, and more — and a deployment adds its own. The routing is the model's; the residency is yours.",
		group: "format",
		relations: [
			{ rel: "selects", to: "representation-e" },
			{ rel: "claim_capped_by", to: "fidelity-e" },
		],
		href: "/representation",
		explorer: "SHOW AUTHORITY",
	},
	{
		id: "fidelity-e",
		names: ["fidelity", "fidelities"],
		display: "FIDELITY",
		five: "what a copy is worth",
		role: "Every variant's fidelity is recorded against the source at extraction — the baseline's own included, which closes the loophole where a lossy copy becomes exact by being promoted.",
		detail: "The lattice runs source-exact, source-equivalent, numerically-approximate, structurally-approximate, analysis-only. A profile's authority is the weakest fidelity across its selections, capped further by declared omissions — derived, never asserted.",
		group: "format",
		relations: [
			{ rel: "grades", to: "representation-e" },
			{ rel: "folds_into", to: "authority-e" },
		],
		href: "/authority",
	},
	{
		id: "authority-e",
		names: ["authority", "authorities"],
		display: "AUTHORITY",
		five: "derived by fold, never asserted",
		role: "What a profile may claim is derived — folded down from the fidelity of everything it selected — and a container itself is Canonical or Derived, and says which.",
		detail: "A derived image cannot recompile itself, and declaring that is the difference between an artifact missing something and one that never promised it. Kernel maturity affects speed and support status — never fidelity.",
		group: "format",
		relations: [
			{ rel: "derived_from", to: "fidelity-e" },
			{ rel: "proven_by", to: "verification-e" },
		],
		href: "/authority",
		explorer: "SHOW AUTHORITY",
	},
	{
		id: "verification-e",
		names: ["verification", "verify", "verified", "four-authority", "declared", "resolved", "encoded"],
		display: "VERIFICATION — G4",
		five: "four views must agree pairwise",
		role: "Four independently derived views of the same system — Declared, Resolved, Graph, Encoded — compared pairwise, so a failure names the two that disagree.",
		detail: "Both ends are re-hashed at verify time, so a drifted checkpoint fails differently from a corrupted container. The tensor table is compared entry by entry, because a relabelled dtype over identical bytes is invisible to every hash. And consistency is not sufficiency — the other half of the proof is closure.",
		group: "format",
		relations: [
			{ rel: "proves", to: "authority-e" },
			{ rel: "completed_by", to: "closure-e" },
		],
		href: "/authority",
		explorer: "SHOW PROVENANCE",
	},
	{
		id: "provenance-e",
		names: ["provenance", "lineage", "hashes", "checksums"],
		display: "PROVENANCE",
		five: "hashes recorded, re-checked forever",
		role: "Every canonical representation records the source payload hash computed while copying, and the encoded segment records its own — a chain of custody, not just a warehouse.",
		detail: "At verify time both ends are re-hashed and compared with what was recorded, so drift and corruption fail differently and by name. Variants carry fidelity graded against the source.",
		group: "format",
		relations: [{ rel: "feeds", to: "verification-e" }],
		href: "/authority",
		explorer: "SHOW PROVENANCE",
	},
	{
		id: "closure-e",
		names: ["closure", "operand closure", "operand", "operands"],
		display: "OPERAND CLOSURE",
		five: "every operand accounted, or refused",
		role: "Every stored tensor must map to a generic operation, every operation must carry judged semantics, and per-layer accounting must be total — a missing operand is a named refusal, never a silently skipped step.",
		detail: "The proof is causal: mutate a stored fact and the computation must change; where mutation changes nothing, a hidden default was hiding. The gate primitive entered the IR exactly this way — 52 layers refused by name until the semantics were judged.",
		group: "format",
		relations: [
			{ rel: "completes", to: "verification-e" },
			{ rel: "reads", to: "execution-surface-e" },
		],
		href: "/execution",
	},
	{
		id: "execution-surface-e",
		names: ["execution surface", "surface", "surfaces"],
		display: "EXECUTION SURFACE",
		five: "what generic operations need, resolved",
		role: "A component says what part of the system it is; its execution surface says what the generic operations need to run it — every value fully resolved when the container was built.",
		detail: "Seven surfaces — attention, ffn/moe, norm, head, and the linear-attention, KDA and MLA families — with no family knowledge in any of them. An executor reads; it never defaults.",
		group: "format",
		relations: [
			{ rel: "read_by", to: "closure-e" },
			{ rel: "enables", to: "deletion-invariant-e" },
		],
		href: "/execution",
		explorer: "EXPLAIN EXECUTION layer.12",
	},
	{
		id: "deletion-invariant-e",
		names: ["deletion invariant", "deletion"],
		display: "THE DELETION INVARIANT",
		five: "the source stops being authority",
		role: "Removing the original checkpoint, config.json, the model type and the architecture name must not change execution.",
		detail: "The format's climax: the container has fully absorbed the meaning, and the runtime sees container → system graph → operation plan → generic kernels, nothing else.",
		group: "format",
		relations: [{ rel: "enabled_by", to: "execution-surface-e" }],
		href: "/execution",
	},
	{
		id: "system-graph-e",
		names: ["system graph", "graph"],
		display: "THE SYSTEM GRAPH",
		five: "meaning judged once, stored verbatim",
		role: "Everything VINDEX3 knows about a model, it knows as a graph — components, logical objects, and hidden-state edges — judged once from source evidence when the container is built, and stored verbatim inside it.",
		detail: "From then on it is the only semantic authority: execution, verification, and the query surface read the graph, never the checkpoint. Ambiguity blocks — an edge whose producer has zero candidates, or two, is unresolved and refuses.",
		group: "format",
		relations: [
			{ rel: "contains", to: "component-e" },
			{ rel: "contains", to: "logical-object-e" },
		],
		href: "/graph",
		explorer: "SHOW COMPONENTS",
	},
	{
		id: "component-e",
		names: ["components"],
		display: "COMPONENT",
		five: "a sub-system, role derived",
		role: "One entry per sub-system of the release — the text model, a vision tower, a speculative drafter — with roles derived from evidence, never declared.",
		detail: "An artifact declaring target_layer_ids is a drafter; a nested config component is perception; otherwise primary_text. Ids are conceptual — target, vision, draft — and never directory names.",
		group: "format",
		relations: [{ rel: "belongs_to", to: "system-graph-e" }],
		href: "/graph",
		explorer: "SHOW COMPONENTS",
	},
	{
		id: "logical-object-e",
		names: ["logical object", "logical objects", "objects"],
		display: "LOGICAL OBJECT",
		five: "identity conceptual, never a filename",
		role: "The logical things a component owns, named in an architectural vocabulary — identity is {component}.{kind}, like target.decoder_stack. Physical tensor names may bind an object; they never define it.",
		detail: "Kinds run embedding, decoder_stack, final_norm, output_head, perception_tower, expert_bank and more. A representation's id is {object}@{encoding}, and encodings are observed from shard headers, never invented.",
		group: "format",
		relations: [{ rel: "owned_by", to: "component-e" }],
		href: "/graph",
	},
	{
		id: "lyrw-e",
		names: ["lyrw", "layer file", "weight file"],
		display: "LYRW v2",
		five: "a file that explains itself",
		role: "The layer-weight format: one binary file holds one layer's weights, organised as banks of entries, and describes itself completely — a reader needs nothing but the bytes in front of it.",
		detail: "Five structures in file order: header, bank descriptors, segment descriptors, region schemas, entry table. Unknown tags are preserved, not rejected — refusal belongs at capability-check time, to the operation that actually needs what a reader cannot do.",
		group: "format",
		relations: [{ rel: "scales_by", to: "segment-e" }],
		href: "/bytes",
	},
	{
		id: "segment-e",
		names: ["segment", "segments", "extent", "extents"],
		display: "SEGMENTS & EXTENTS",
		five: "two scales, two measurements",
		role: "A segment file answers to file management — the shard cap; a group extent answers to hardware — the unit one grouped dispatch reads. Boundaries always agree.",
		detail: "K3's 22.61 GiB routed layer exceeds the 20 GiB cap, so it ships as two segments of 448 experts. Segments split only on extent edges; conflating the scales would turn a two-file layer into fourteen for no read benefit.",
		group: "format",
		relations: [{ rel: "shapes", to: "lyrw-e" }],
		href: "/bytes",
	},
	{
		id: "walk-e",
		names: ["walk", "describe", "browse"],
		display: "WALK & DESCRIBE",
		five: "browse straight at weights",
		role: "The ABI's own browse surface: no query index is stored beside the weights, because the weights are the query index — gate regions walked in place under mmap.",
		detail: "The query/ directory holds only metadata sidecars that make browsing fast; delete it and nothing about execution changes. Honestly graded: it ships today as an analysis-only profile, and expert-region browse parity is an open row on the Record.",
		group: "format",
		relations: [{ rel: "reads", to: "system-graph-e" }],
		href: "/explorer",
		explorer: 'WALK "the capital of France" TOP 3',
	},
	{
		id: "nope-e",
		names: ["nope", "positionpolicy", "position policy", "no position"],
		display: "PositionPolicy::None — NoPE",
		five: "no position is not zero rotation",
		role: "A layer with no positional encoding is a judged semantic — NoPE — and it is not rope with theta zero, which would be nonsense wearing a number.",
		detail: "The spec's own worked example of the four-authority invariant: layer_rope_theta[3] = 0 must resolve to PositionPolicy::None all the way to the encoded container. A resolver that guesses rope(theta = 0) instead breaks Declared ≡ Resolved — and the comparison catches it.",
		group: "format",
		relations: [{ rel: "guarded_by", to: "verification-e" }],
		href: "/authority",
	},
	{
		id: "precision-map-e",
		names: ["precision map", "precision maps", "mixed precision"],
		display: "THE PRECISION MAP",
		five: "a compiled program of encodings",
		role: "Not 'the model is four-bit' — a program: these tensors at one precision, those at another, an effective rate derived from the whole, stored as a physical fact inside the file.",
		detail: "A default encoding, role-based eligibility, and exceptions matched in declaration order — first match decides. Execution honours it over the backend's blanket request: in the recorded granite artifact, sixteen tensors run above the requested format because the pack says so, at an effective 5.65 bits per weight.",
		group: "format",
		relations: [
			{ rel: "compiles", to: "representation-e" },
			{ rel: "answers_to", to: "fidelity-e" },
		],
		href: "/quantization",
		explorer: "SHOW PRECISION",
	},
	{
		id: "effective-bits",
		names: ["effective bits", "effective precision", "bits per weight"],
		display: "EFFECTIVE BITS / WEIGHT",
		five: "the scales are never free",
		role: "The honest rate: nominal bits plus the shared scales, metadata, and every component preserved at higher precision, divided over all the weights.",
		detail: "NVFP4 is nominally four bits, but sixteen weights share an eight-bit scale — 72 bits per 16 weights, 4.5 effective. Mix in protected BF16 components and the recorded granite map lands at 5.65. A four-bit model is never four bits.",
		group: "format",
		relations: [{ rel: "derived_from", to: "precision-map-e" }],
		href: "/quantization",
	},
	{
		id: "byte-floor-e",
		names: ["byte floor", "bandwidth", "memory bandwidth"],
		display: "THE BYTE FLOOR",
		five: "bytes divided by bandwidth, floor",
		role: "Divide the bytes a token needs by the memory bandwidth and you have the byte floor — the fastest that token can possibly arrive, before any computation counts.",
		detail: "Decode speed is a bytes problem before it is a compute problem, which is why precision, residency, and placement are the levers that matter — and why the file format is where they are all decided.",
		group: "format",
		relations: [{ rel: "grounds", to: "representation-e" }],
		href: "/why",
	},
	{
		id: "quantisation-e",
		names: ["quantisation", "quantization", "quantised", "quantized"],
		display: "QUANTISATION",
		five: "fewer bits, fidelity recorded",
		role: "Storing each number in fewer bits — fewer allowed values, every weight snapped to its nearest level — trading exactness for bandwidth returned.",
		detail: "In one measured case 1,959 MB per token became 1,269. But snapped numbers are changed numbers, and changed numbers can change answers — so in VINDEX3 a quantised copy is a named variant with recorded fidelity beside its original, never a fork, and nothing ships unmeasured.",
		group: "format",
		relations: [
			{ rel: "is_a", to: "representation-e" },
			{ rel: "disciplined_by", to: "fidelity-e" },
		],
		href: "/why",
		explorer: "SHOW REPRESENTATIONS",
	},
	{
		id: "linear-attention",
		names: ["linear attention", "linear_attention", "linear attn", "recurrent attention"],
		display: "LINEAR ATTENTION",
		five: "the past folded into state",
		role: "An attention family that carries the past as a fixed-size recurrent state instead of a growing cache — constant cost per token, however long the context.",
		detail: "Carried as a first-class execution surface — key_heads · key_head_dim · value_heads · value_head_dim · conv_kernel · state_dtype — present only when a model uses it, never inferred from a model name. What changes is not the container's discipline but the memory the layer carries forward.",
		group: "attention-families",
		relations: [
			{ rel: "sibling_of", to: "attention" },
			{ rel: "carries", to: "recurrent-state" },
			{ rel: "specialised_by", to: "gated-deltanet" },
			{ rel: "specialised_by", to: "kda" },
		],
		href: "/execution",
	},
	{
		id: "gated-deltanet",
		names: ["gated deltanet", "deltanet", "gated delta", "gated_deltanet", "delta rule"],
		display: "GATED DELTANET",
		five: "nine operands, closure needs all",
		role: "A linear-attention operator whose recurrent state is updated by a gated delta rule — write what changed, forget by gate.",
		detail: "Its operand vocabulary is nine roles: the fused QKV projection, the A and B in-projections, Z, a short convolution, A_log and dt_bias, the output norm and the out-projection. Operand closure requires every one — a stack shipping eight of nine refuses by name rather than executing a guess.",
		group: "attention-families",
		relations: [
			{ rel: "belongs_to", to: "linear-attention" },
			{ rel: "carries", to: "recurrent-state" },
			{ rel: "verified_by", to: "closure-e" },
		],
		href: "/execution",
	},
	{
		id: "kda",
		names: ["kda", "kimi delta attention", "kimi-delta-attention"],
		display: "KDA — KIMI DELTA ATTENTION",
		five: "fifteen operands, per-channel forgetting",
		role: "A delta-attention operator with per-channel gating — a linear-attention family carried as its own execution surface, with its own declared geometry.",
		detail: "Fifteen operand roles: the Q, K and V projections and their short convolutions, the F-A/F-B and G-A/G-B gate pairs, a B projection, A_log and dt_bias, the output norm and the out-projection — plus kda_gate_lower_bound on the surface. Real stacks interleave it with full attention, and the interleave is read from the per-layer policy table, never from layer arithmetic.",
		group: "attention-families",
		relations: [
			{ rel: "belongs_to", to: "linear-attention" },
			{ rel: "sibling_of", to: "mla" },
			{ rel: "carries", to: "recurrent-state" },
			{ rel: "governed_by", to: "hybrid-attention-policy" },
		],
		href: "/execution",
	},
	{
		id: "mla",
		names: ["mla", "multi-head latent attention", "latent attention", "multihead latent attention"],
		display: "MLA — MULTI-HEAD LATENT ATTENTION",
		five: "the cache compressed through latents",
		role: "An attention family that stores its key/value past through a low-rank latent bottleneck — full-attention memory at a fraction of the cache bytes.",
		detail: "Its surface declares num_heads · kv_lora_rank · qk_nope_head_dim · qk_rope_head_dim · v_head_dim: the rope and no-rope halves of the key are separate declared facts, and the latent A/B projections with their norm are operands like any others. It keeps true KV state — compressed, not replaced.",
		group: "attention-families",
		relations: [
			{ rel: "sibling_of", to: "attention" },
			{ rel: "sibling_of", to: "kda" },
			{ rel: "distinguished_by", to: "kv-vs-recurrent-state" },
		],
		href: "/execution",
	},
	{
		id: "recurrent-state",
		names: ["recurrent state", "recurrent-state", "delta state", "conv state"],
		display: "RECURRENT STATE",
		five: "a fixed-size carried memory",
		role: "The continuation memory of linear-attention families: a fixed-size tensor per layer, updated every token, replacing the growing key/value cache.",
		detail: "Its geometry is a container fact — state dtype and shape come from the plan, never from architecture inference. A session's recurrent state crosses the runtime the way KV rows do: prepared from the plan's declared geometry, owned by the caller, resumed exactly.",
		group: "attention-families",
		relations: [
			{ rel: "belongs_to", to: "linear-attention" },
			{ rel: "contrasted_with", to: "kv-vs-recurrent-state" },
		],
		href: "/execution",
	},
	{
		id: "hybrid-attention-policy",
		names: ["hybrid attention", "hybrid attention policy", "attention interleave", "layer interleave", "attention policy"],
		display: "HYBRID ATTENTION POLICY",
		five: "each layer declares its family",
		role: "A stack that mixes attention families — delta then full, sliding then global — declared layer by layer in the persisted policy table, never computed from a layer index.",
		detail: "The per-layer AttentionLayerPolicy is the single authority: span, window, position, family. No layer-modulo arithmetic exists on the execution path — the interleave is unrolled into the table at compile time, and mutating one row provably changes execution. That is how a 3:1 delta-to-full stack executes with zero architecture branches.",
		group: "attention-families",
		relations: [
			{ rel: "read_by", to: "execution-surface-e" },
			{ rel: "governs", to: "kda" },
			{ rel: "governs", to: "attention" },
		],
		href: "/execution",
	},
	{
		id: "kv-vs-recurrent-state",
		names: ["kv state vs recurrent state", "kv state", "kv cache", "kv"],
		display: "KV STATE vs RECURRENT STATE",
		five: "growing memory or folded memory",
		role: "Two kinds of continuation memory: softmax attention keeps every past key and value and grows with context; linear families fold the past into a fixed-size state.",
		detail: "A hybrid stack carries both at once, layer by layer, and the plan declares which — row geometry and windows for KV layers, state shape for recurrent layers. MLA sits between them: true KV state, stored through a latent bottleneck. The runtime's rule covers all of it: state geometry is a container fact.",
		group: "attention-families",
		relations: [
			{ rel: "distinguishes", to: "recurrent-state" },
			{ rel: "belongs_to", to: "attention" },
		],
		href: "/execution",
	},
	{
		id: "query-score-scale",
		names: ["query scaling", "score scaling", "query scale", "score scale", "qk scale", "qk_scale_factor"],
		display: "QUERY SCALE vs SCORE SCALE",
		five: "two multiplies, two addresses",
		role: "Query and score scales are separate operations: the declared factor multiplies the normalised query before position encoding; the canonical head_dim^-0.5 is a score-time multiply.",
		detail: "Folding them into one multiply is algebra-equivalent but not fp-equivalent — moving a multiply across RoPE and a matmul is exactly the silent normalisation that later surfaces as a parity mystery. So the surface keeps them unfolded: query_scale, score_scale, and logit softcapping, each applied at its own declared point.",
		group: "attention",
		relations: [
			{ rel: "belongs_to", to: "execution-surface-e" },
			{ rel: "belongs_to", to: "attention" },
		],
		href: "/execution",
	},
	{
		id: "pf-qk-norm",
		names: ["parameter-free qk norm", "parameter free qk normalisation", "parameter free qk normalization", "parameter_free_qk_norm", "qk norm without weights"],
		display: "PARAMETER-FREE QK NORM",
		five: "a judged fact, no weights",
		role: "Some models normalise Q and K while shipping no norm weights at all — a semantic no tensor evidence can reveal, judged from the reference implementation and persisted on the surface.",
		detail: "It lives on the surface as parameter_free_qk_norm, distinct from weighted QK-norm — and it is the standing proof that a container cannot be reconstructed from bytes alone: some execution semantics must be judged at compile time, which is exactly what the compiler boundary exists for.",
		group: "attention",
		relations: [
			{ rel: "belongs_to", to: "execution-surface-e" },
			{ rel: "belongs_to", to: "attention" },
		],
		href: "/execution",
	},
	{
		id: "attn-output-gate",
		names: ["attention output gate", "attention output gating", "output gate", "output gating", "attn output gate"],
		display: "ATTENTION OUTPUT GATE",
		five: "a primitive earned by refusal",
		role: "A sigmoid gate on the aggregated attention output, multiplied in before the output projection — a generic primitive of the vocabulary, not a family quirk.",
		detail: "It entered the format by refusal: the first real four-norm model shipped a gate weight in all 52 layers, and the closure gate refused every one, naming the missing primitive. Its semantics were judged from the reference — sigmoid of the gate projection of the attention input, scaling the head output before o_proj — the primitive entered the IR, and the model closed at twelve of twelve operands per layer.",
		group: "attention",
		relations: [
			{ rel: "belongs_to", to: "attention" },
			{ rel: "discovered_by", to: "closure-e" },
		],
		href: "/execution",
	},
];

export function findEntities(queryTokens: string[], queryLower: string): Entity[] {
	const hits: Entity[] = [];
	for (const ent of ENTITIES) {
		const hit = ent.names.some((n) => (n.includes(" ") ? queryLower.includes(n) : queryTokens.includes(n)));
		if (hit) hits.push(ent);
	}
	return hits;
}

export function entity(id: string): Entity | undefined {
	return ENTITIES.find((e) => e.id === id);
}

/* ------------------------------------------------------------------
   THE STATUS LAYER — the Record's gates as graph nodes, so a status
   question derives its answer instead of asserting one.
   ------------------------------------------------------------------ */

export type GateNode = {
	id: string;
	label: string;
	status: "PASSED" | "BUILDING" | "OPEN";
	note: string;
};

export const GATE_NODES: GateNode[] = [
	{ id: "G0", label: "read the source's declarations", status: "PASSED", note: "the source inspector emits the inventory" },
	{ id: "G1", label: "the schema can describe it", status: "PASSED", note: "typed findings, non-zero exit on blockers" },
	{ id: "G2", label: "generalise until reality fits", status: "PASSED", note: "blocking = mismatched = unknown = 0" },
	{ id: "G3", label: "materialise the graph", status: "PASSED", note: "inspect reconstructs the system from the container alone" },
	{ id: "G4", label: "prove source ≡ encoded", status: "PASSED", note: "four-authority comparison + payload-hash equality" },
	{ id: "G5", label: "execute from the description", status: "PASSED", note: "closure + golden parity + causal controls; exec surfaced as a CLI verb" },
	{ id: "G6", label: "drafter parity", status: "BUILDING", note: "G6d (GPU-lowered plan) landed; full drafter parity open" },
	{ id: "G7", label: "performance baseline", status: "PASSED", note: "106 tok/s recorded — gpt-oss-20b, one M3 Max" },
	{ id: "G8", label: "alternate physical plans", status: "OPEN", note: "must not contaminate G0–G5" },
	{ id: "M4", label: "the flip to default", status: "OPEN", note: "a named decision, made in one place — not yet made" },
	{ id: "browse-parity", label: "expert-region browse parity", status: "OPEN", note: "an open pre-freeze row" },
	{ id: "E8", label: "held-out architecture test", status: "OPEN", note: "runs after the freeze, by design" },
];
