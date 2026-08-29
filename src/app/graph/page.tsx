import type { Metadata } from "next";
import { Hero } from "@chrishayuk/house/components/forms/Hero";
import { Statement } from "@chrishayuk/house/components/forms/Statement";
import { Observation } from "@chrishayuk/house/components/forms/Observation";
import { Anatomy } from "@chrishayuk/house/components/forms/Anatomy";
import { Connection } from "@chrishayuk/house/components/forms/Connection";
import { GraphExplorer } from "@/components/GraphExplorer";

export const metadata: Metadata = {
	title: "The System Graph",
	description: "Components, logical objects, and edges — the semantic IR a VINDEX3 container carries, and how it is materialised.",
};

/**
 * The semantic-IR exhibit: the SystemGraph as the living spec §5
 * defines it, the identity rules, and the G3 materialisation that
 * writes it to disk. Field lists follow graph/{component,object,
 * surface}.rs and encode/segment.rs in the reference implementation.
 */
export default function GraphPage() {
	return (
		<main>
			<Hero
				kicker="THE SYSTEM GRAPH · LIVING SPEC §5–6 · GRAPH_SCHEMA 5"
				title="COMPONENTS, OBJECTS, EDGES"
				dek="Everything VINDEX3 knows about a model, it knows as a graph — judged once when the container is built, stored verbatim inside it, and read by everything downstream."
			/>

			<Observation text="The system graph is the container's understanding of the model: which sub-systems exist, what logical things they own, and how hidden states flow between them. It is built once, from source evidence, when the container is made. It is stored inside the container, verbatim. And from then on it is the only semantic authority — execution, verification, and the query surface all read the graph, never the checkpoint." />

			<GraphExplorer />

			<Anatomy
				kicker="SystemGraph — THREE ARRAYS"
				objectLabel="Components own objects. Edges connect components."
				layers={[
					{
						label: "components: [Component]",
						note: "WHAT SUB-SYSTEMS EXIST",
						detail:
							"One entry per sub-system of the release — the text model, a vision tower, a speculative drafter. Roles are evidence-derived, never declared: an artifact declaring target_layer_ids is a drafter; a nested *_config component is perception; otherwise primary_text. Ids are conceptual — target, vision, draft — and never directory names.",
						children: [
							{ label: "id", detail: "conceptual name: target, vision, draft" },
							{ label: "role", detail: "primary_text · perception · drafter — derived from evidence" },
							{ label: "source_artifact", detail: "which source artifact this component came from" },
							{ label: "num_layers · hidden_size", detail: "the component's own geometry" },
							{ label: "attention", detail: "per-layer AttentionLayerPolicy — position, span, and gating judged per layer" },
						],
					},
					{
						label: "objects: [LogicalObject]",
						note: "WHAT THINGS THEY OWN",
						detail:
							"The logical things a component owns, named in an architectural vocabulary, not a familial one. Identity is the pair {component}.{kind} — target.decoder_stack. Physical tensor names may bind an object, but they never define it. A representation's id is {object_id}@{encoding}.",
						children: [
							{ label: "id", detail: "{component}.{kind} — e.g. target.decoder_stack" },
							{ label: "kind", detail: "embedding · decoder_stack · final_norm · output_head · perception_tower · perception_adapter · feature_projector · expert_bank" },
							{ label: "source_bindings", detail: "[{ artifact, tensor_prefix, tensors, bytes }] — the physical trace back to the source" },
							{ label: "representations", detail: "[{ encoding, fidelity: canonical | approximate }] — encodings observed from shard headers, never invented" },
						],
					},
					{
						label: "edges: [HiddenStateEdge]",
						note: "HOW STATE FLOWS",
						detail:
							"The logical flow of residual states across a component boundary — a drafter tapping the target's layers, a projector consuming a perception tower's output. The edge's producer must be exactly one other component deep enough to own every declared tap. Zero candidates, or two: the interface is unresolved, and blocks. Never guessed.",
						children: [
							{ label: "producer_component · producer_layers", detail: "who produces the states, and which layers are tapped" },
							{ label: "consumer_component · consumer_object", detail: "who consumes them, through which object" },
							{ label: "block_size", detail: "optional — the capture granularity, when the consumer needs one" },
						],
					},
				]}
				caption="Graph schema 5. The graph is stored verbatim in the container — inspect prints it back from the bytes alone, with the source deleted."
			/>

			<Statement text="The edge is not the tensor." />

			<Observation text="A projector that implements an edge's consumer side is a separate object, referenced by id. The flow of states and the weights that transform them are distinct facts, never merged. The graph runs on six such distinctions, each load-bearing. An artifact is not a component. A tensor name is not a logical object. An interface is not its implementing tensor. NoPE is not rope with theta zero. A logical object is not its physical representation. And representable means judged — not merely parsed." />

			<section className="house-grid py-16 sm:py-24">
				<div className="col-span-12 md:col-start-2 md:col-span-10 lg:col-span-9">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-8 opacity-50">
						G3 — HOW THE GRAPH BECOMES A CONTAINER
					</p>
					<pre
						className="voice-evidence text-xs sm:text-sm leading-relaxed whitespace-pre overflow-x-auto m-0 border px-5 py-4 sm:px-7 sm:py-6"
						style={{ borderColor: "var(--color-mist)" }}
					>
						{`<container>/
├── index.json            sole root authority
├── system_graph.json     the SystemGraph, verbatim
└── segments/
    ├── target.decoder_stack.bin
    ├── target.embedding.bin
    ├── target.output_head.bin
    └── …                 one segment per logical object

segment framing:  [u64 LE header length][header JSON][payload bytes]

SegmentHeader {
  schema, representation,
  tensors: [ { name, dtype, shape, offset, len } ]
}`}
					</pre>
					<p className="voice-system text-sm opacity-70 leading-relaxed max-w-2xl mt-6">
						Offsets are relative to the payload. The table&apos;s order is the payload&apos;s order —
						deterministic, sorted by name. Names are object-relative (3.self_attn.q_proj.weight), never
						artifact-global. Two hashes are computed in one writing pass: the payload, and the whole file. And the
						write order is deliberate — segments first, index.json last — so a crash midway leaves a directory
						that never claimed to be a container, rather than one that claims to be and is missing its banks.
					</p>
					<p className="voice-system text-sm opacity-70 leading-relaxed max-w-2xl mt-4">
						This is the graph-encode layout, written by the encoder; the bank layout on the Bytes page is
						the LYRW v2 import layout for routed serving. Same root rule, same authorities, two physical shapes.
					</p>
				</div>
			</section>

			<Observation
				label="THE G3 GATE"
				text="Materialisation is proven, not assumed: after encode, inspect must reconstruct the entire system — components, objects, edges, policies — solely from the container. If a fact survives only in the source checkpoint, the encoding failed, whatever the bytes say."
			/>

			<Connection
				text="A graph says what the system is. What the generic operations need to run it is the execution surface."
				links={[
					{ href: "/execution", label: "FROM DESCRIPTION TO COMPUTATION" },
					{ href: "/container", label: "ONE DIRECTORY, ONE ROOT" },
				]}
			/>

			<section className="house-grid pb-32 pt-8 border-t" style={{ borderColor: "var(--color-mist)" }}>
				<div className="col-span-12">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase opacity-50 mb-4">SOURCES</p>
					<ul className="voice-evidence text-sm opacity-60 flex flex-col gap-1">
						<li>vindex3-format.md §5–6 (the living spec)</li>
						<li>reference implementation — graph/component.rs · graph/object.rs · encode/segment.rs</li>
					</ul>
				</div>
			</section>
		</main>
	);
}
