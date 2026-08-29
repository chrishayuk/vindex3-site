import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { Observation } from "@chrishayuk/hause/components/forms/Observation";
import { Transformation } from "@chrishayuk/hause/components/forms/Transformation";
import { Unfolding } from "@chrishayuk/hause/components/forms/Unfolding";
import { Procession } from "@chrishayuk/hause/components/forms/Procession";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";
import { ContainerReveal } from "@/components/ContainerReveal";
import { Film } from "@chrishayuk/hause/components/forms/Film";

/**
 * The thesis exhibit, with an on-ramp: what VINDEX3 is and does comes
 * before what it believes. Grounded in the actual specs in
 * the specification documents — every quoted question and figure below
 * is verbatim or near-verbatim from those documents, not illustrative.
 * See the Scope note and Sources at the bottom.
 */
export default function Home() {
	return (
		<main>
			<ContainerReveal />

			<Hero
				kicker="VINDEX3 · SPEC 3.0-DRAFT-2"
				title="THE MODEL IS THE DATABASE"
				dek="A way of storing an AI model so the same copy can be run, questioned, and checked — nothing repackaged, nothing thrown away."
			/>

			<Observation text="An AI model is billions of learned numbers. Today they ship as a sealed box: you may run it, and nothing more. VINDEX3 keeps the same numbers as an open catalogue — every part named, findable, checkable — so one copy can be executed, searched, and proven faithful to the original." />

			<Statement text="A modern model release is not a weights file. It is a system." />

			<Observation
				label="THE QUESTIONS"
				text="A serving file needs to answer one question: how do I store and run these tensors? VINDEX3 is built to answer more. What are these model objects? What operations can consume them? Which representations are equivalent? Which parts should be resident? What future computation will need them?"
			/>

			<Transformation
				kicker="ONE RELEASE — TWO INTERPRETATIONS"
				objectLabel="the same checkpoint, byte-identically preserved either way"
				blockLabels={["EMBEDDINGS", "ATTENTION", "EXPERTS", "ROUTER", "LM HEAD"]}
				from={{
					label: "A WEIGHTS FILE",
					properties: [
						"Loaded whole, or not at all",
						"One precision, chosen once at conversion",
						"Answers one request: run",
					],
				}}
				to={{
					label: "A DATABASE",
					properties: [
						"Component-addressed — load what you need",
						"Multiple representations, selected per profile",
						"Run it, query it, verify it — the same bytes",
					],
				}}
			/>

			<Film
				title="Extract once"
				description="A checkpoint compiles down into a container, is proven byte-faithful — and the checkpoint ghosts away, no longer needed. Thirty seconds, from the format's own performance."
				src="/films/extract-once.mp4"
				poster="/films/extract-once-poster.jpg"
			/>

			<Statement text="VINDEX3 does not add a query index next to the weights. It keeps the weights queryable." />

			<Observation
				label="THE QUERY SURFACE"
				text="No query index is ever stored beside the weights — the weights are the query index. Ask the model what it associates with a phrase. Filter what it knows like a table. Or run it. Same bytes, all three."
			/>

			<Procession
				stages={["inventory", "plan", "encode", "inspect", "verify", "execute", "serve"]}
				caption="one checkpoint — every stage, once"
			/>

			<Observation text="Extract a supported checkpoint once, into a stable, component-addressed layout. Then vary what is loaded, where it resides, what precision it uses, and whether a component is executed or queried — without ever rebuilding the index." />

			<Unfolding
				kicker="model.vindex/ — ONE CONTAINER, FIVE DURABLE WEIGHT CLASSES"
				source={{ label: "model.vindex/", detail: "A directory, not a single blob — component-addressed from the start." }}
				parts={[
					{ label: "1 — CONTROL & ROUTER", detail: "Embeddings, norms, LM head, routers." },
					{ label: "2 — DENSE SPINE", detail: "The non-routed backbone layers." },
					{ label: "3 — SHARED FFN", detail: "Feed-forward blocks shared across experts." },
					{ label: "4 & 5 — ROUTED BANKS", detail: "The expert weights, gate-up and down — segmented, independently addressable." },
				]}
				result={{ label: "index.json", detail: "Sole root authority — version, identity, provenance, checksums, class map, segment lists." }}
			/>

			<Statement text="106 tokens per second, from one container, on one laptop — and the answer, provably unchanged." />

			<Connection
				text="The spec's load-bearing ideas each have their own exhibit."
				links={[
					{ href: "/why", label: "THE PHYSICS — START AT FIRST PRINCIPLES" },
					{ href: "/container", label: "ONE DIRECTORY, ONE ROOT" },
					{ href: "/bytes", label: "DOWN TO THE BYTE" },
					{ href: "/graph", label: "COMPONENTS, OBJECTS, EDGES" },
					{ href: "/execution", label: "FROM DESCRIPTION TO COMPUTATION" },
					{ href: "/representation", label: "SELECTION, NOT CONVERSION" },
					{ href: "/authority", label: "WHERE TRUTH COMES FROM" },
					{ href: "/ladder", label: "THE RECORD — STATUS, PROOF, HISTORY" },
				]}
			/>
		</main>
	);
}
