import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { Observation } from "@chrishayuk/hause/components/forms/Observation";
import { Transformation } from "@chrishayuk/hause/components/forms/Transformation";
import { Unfolding } from "@chrishayuk/hause/components/forms/Unfolding";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";
import { ContainerReveal } from "@/components/ContainerReveal";

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

			<Statement text="VINDEX3 does not add a query index next to the weights. It keeps the weights queryable." />

			<Observation
				label="THE QUERY SURFACE"
				text="Querying is not an add-on. It is specified alongside execution, as an equal. Every weight file declares, in its own header, whether its weights can be browsed. And no query index is ever stored beside the weights — the weights are the query index. Ask the model what it associates with a phrase. Filter what it knows like a table. Or run it. Same bytes, all three."
			/>

			<Observation
				label="AN OPEN SPECIFICATION"
				text="VINDEX3 is an independent container specification. Reference tooling exists — an inventory, a planner, an encoder, a verifier, a server — but the format is defined by its documents, not by any tool. This site is that specification, seen: what a container holds, who decides what is true about it, and what it takes to prove it faithful to its source."
			/>

			<section className="hause-grid py-16 sm:py-24">
				<div className="col-span-12 md:col-start-2 md:col-span-9">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-8 opacity-50">
						WHAT YOU DO WITH IT — THE PIPELINE, DELIBERATELY COMPILER-SHAPED
					</p>
					<div className="flex flex-col">
						{[
							["inventory", "read what the source checkpoint declares"],
							["plan", "judge whether the schema can describe it — typed findings, ambiguity refused"],
							["encode", "materialise the system into a container"],
							["inspect", "reconstruct the system from the container alone"],
							["verify", "prove source and container agree, hash by hash"],
							["execute", "run a forward pass from the encoded description — zero architecture branches"],
							["serve", "inference and the query surface over the same bytes"],
						].map(([verb, what]) => (
							<div
								key={verb}
								className="grid grid-cols-[6.5rem_1fr] sm:grid-cols-[9rem_1fr] gap-4 sm:gap-8 items-baseline py-3 border-t"
								style={{ borderColor: "var(--color-mist)" }}
							>
								<span className="voice-evidence text-sm" style={{ color: "var(--color-accent)" }}>
									{verb}
								</span>
								<span className="voice-system text-sm sm:text-base opacity-80">{what}</span>
							</div>
						))}
						<div className="border-t" style={{ borderColor: "var(--color-mist)" }} />
					</div>
				</div>
			</section>

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
