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
import { Procession } from "@chrishayuk/hause/components/forms/Procession";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";
import { Lens } from "@chrishayuk/hause/components/forms/Lens";
import { specSection } from "@/data/corpus";
import { SpecClause } from "@/components/SpecClause";

export const metadata: Metadata = {
	title: "The Container Lifecycle: Run, Observe, Modify, Prove",
	alternates: { canonical: "/lifecycle" },
	description: "What a VINDEX3 container can do over its life — bind, query, execute, trace, overlay, diff, compile, compact — and the guarantees each operation carries.",
	// The head surface of this chapter's publication record — citation_* tags,
	// built from the same object the Provenance line and the reference print.
	other: citeMeta("/lifecycle"),
};

/**
 * The operations exhibit: the container's life after encoding, verb by
 * verb. Grounded in the LQL spec (statements and the V3 backend
 * capability table), the generation policy's consumer matrix, and the
 * Candidate's mutation and equivalence contracts (§18–20). The verbs
 * shown are the implemented ones; nothing here is aspiration.
 */
/** The clause this chapter's SPEC depth quotes — projected from the corpus, never retyped. */
const SPEC_18_1 = specSection("vindex3-format-spec.md", "18.1");

export default function LifecyclePage() {
	return (
		<main>
			<JsonLd
				data={techArticleLd({
					headline: "The Lifecycle",
					description:
						"What a container's life looks like after encoding: bound, questioned, executed, changed, compiled, diffed, compacted — each verb with a guarantee.",
					url: "https://vindex3.org/lifecycle",
					siteUrl: "https://vindex3.org",
					siteName: "VINDEX3",
					dateModified: "2026-08-30",
					about: ["model lifecycle"],
				})}
			/>
			<JsonLd
				data={breadcrumbLd([
					{ name: "VINDEX3", url: "https://vindex3.org" },
					{ name: "The Lifecycle", url: "https://vindex3.org/lifecycle" },
				])}
			/>
			<Hero
				kicker="THE LIFECYCLE · CANDIDATE SPEC §18–20 · LQL"
				title="A CONTAINER HAS A LIFE"
				dek="Encoding is where a container is born, not where the story ends. The same artifact is bound, questioned, executed, watched, changed, compared, made durable, and maintained — each verb with a stated guarantee."
			/>

			<Answer
				id="what-is-the-lifecycle"
				question="What can you do with a VINDEX3 container after encoding?"
				answer="Everything a model's life requires, through one query language: bind it, question its structure, run inference, trace execution observationally, change effective state through overlays that never move the base bytes, compile changes into new standalone artifacts, diff two containers semantically, and compact for durability under a preservation rule — discard only when reported. Each verb carries a stated guarantee, and every guarantee answers to the Record."
			/>

			<Statement text="A format that only stores is a warehouse. This one has query semantics, execution semantics, mutation semantics — and equivalence semantics." />

			<Observation
				label="WHAT THIS FIXES"
				text="Today, changing a model means exporting it into another tool's universe and losing the lineage; observing it means instrumenting a runtime by hand; proving two copies equivalent means trusting whoever renamed the file. Here, every one of those is an operation over the same container, and every operation says in advance what it guarantees — what it reads, what it never touches, and what it must prove."
			/>

			<Procession
				stages={["load", "query", "execute", "observe", "modify", "compare", "compile", "compact"]}
				caption="one container — the whole life, in order"
			/>

			<Lens
				kicker="THE OPERATIONS SURFACE — THREE DEPTHS"
				concept="The operations surface"
				caption="Eight verbs over one container: what makes them operations rather than format, what each one promises, and the surface as the specification states it."
				depths={[
					{
						id: "learn",
						label: "LEARN",
						hint: "operations, not format",
						content: (
							<Observation
								label="WHY THIS IS NOT MORE FILE FORMAT"
								text="Almost none of this adds bytes to the format. The test the Candidate applies: can an independent implementation determine it purely from the artifact? Then it is format. Does it describe how an engine operates on the artifact? Runtime contract. Is it an operator interaction? Operations contract — unless it persists state another implementation must understand, like a compiled container's derived authority stamp, which is exactly when it re-enters the format. That test is why the specification can be stable while the engine keeps moving."
							/>
						),
					},
					{
						id: "inspect",
						label: "INSPECT",
						hint: "what each verb promises",
						content: (
							<Anatomy
								kicker="THE VERBS — WHAT EACH ONE PROMISES"
								objectLabel="Eight moves. Every one answers from the container."
								layers={[
									{
										label: "USE — bind",
										note: "LOAD",
										detail:
											"Binding is a single decision: the container's own schema version selects the generation — no filename sniffing, no fallback from a failed load. A V3 container binds as a closed, operand-verified program plus its operand bytes; a program that does not close refuses to open, naming its defects. Nothing downstream re-detects the format.",
									},
									{
										label: "WALK · DESCRIBE · SELECT — understand",
										note: "QUERY",
										detail:
											"The model as structured data — features walked from the stored gate rows themselves, objects described from the graph, no separate index anywhere. The same facts are available engine-free through the vindex reader: inspect, describe, representations, precision.",
									},
									{
										label: "INFER · GENERATE — execute",
										note: "EXECUTE",
										detail:
											"A forward pass, then stateful autoregressive generation, driven by the container's own semantics — zero architecture branches, state geometry read from the plan. Served, the same runtime answers the standard completion, chat and responses surfaces, sharing every wire shape with the previous generation.",
									},
									{
										label: "TRACE — observe",
										note: "OBSERVE",
										detail:
											"The residual stream, watched without being perturbed: on a V3 binding, TRACE runs observationally — execution's result is the same with the instrument on or off. Observation that changes the thing observed is not observation; that is the guarantee.",
									},
									{
										label: "overlay · patch — modify",
										note: "MODIFY",
										detail:
											"Mutation is overlay, never rewrite. Patches change the effective operands a session executes with; the base container's bytes never move. The effective state is real — INFER, TRACE and the query surface all see the model as mutated — but nothing is destroyed, and unwinding a change is dropping its overlay.",
									},
									{
										label: "DIFF — compare",
										note: "COMPARE",
										detail:
											"A semantic comparison, not a file comparison: DIFF operates over effective model state — objects, representations, values — between two containers, or between a container and the current mutated session. Error is derived, value by value, never asserted. The vindex reader carries the artifact-only projection of the same guarantee.",
									},
									{
										label: "COMPILE — make it durable",
										note: "PERSIST",
										detail:
											"COMPILE CURRENT INTO VINDEX materialises the effective operands into a new standalone container — a sibling artifact, never an in-place upgrade. The result is stamped derived, keeps its provenance link, and must answer INFER, GENERATE, TRACE and WALK equivalently to the state it materialised: equivalence is gated, not presumed.",
									},
									{
										label: "COMPACT — maintain",
										note: "MAINTAIN",
										detail:
											"Physical reorganisation under a semantic-identity obligation: same graph, same effective values, same answers — and no silent discarding of container contents the operation does not understand. Storage may improve; meaning may not move.",
									},
								]}
								caption="GENERATE is a clause of INFER, overlays are statements of the mutation surface, and every verb above is implemented — the LQL whole-language sweep guarantees a V3 binding either serves a statement meaningfully or refuses it by name. What does not exist yet is also recorded: COMPILE INTO MODEL — container back to checkpoint — is specified but unimplemented on V3."
							/>
						),
					},
					{
						id: "spec",
						label: "SPEC",
						hint: "the clause that governs it",
						content: <SpecClause quotes={[SPEC_18_1]} />,
					},
				]}
			/>

			<Observation
				label="TWO TOOLS, ONE BOUNDARY"
				text="VINDEX interrogates the artifact; LARQL operates on the model. The standalone vindex reader answers every artifact question with no inference runtime attached — that separation is what makes the format's independence credible. The moment you want a forward pass, a trace, an overlay or a compile, you have crossed into engine territory, and the boundary is deliberate: understanding an artifact must never require the engine."
			/>

			<Observation
				label="THE REFUSAL MODEL"
				text="Every statement on a V3 binding is in one of two states: it works meaningfully, or it refuses naming the generation and the reason. Hidden, not-found, and an empty listing are failures of this contract, not neutral outcomes — a container that exists must never silently disappear from a consumer surface. Refusal is how the format learns: the vocabulary's newest primitive entered it because a closure gate refused fifty-two layers by name rather than guessing."
			/>

			<Connection
				text="The lifecycle stands on the execution contract beneath it — and everything above answers to the Record."
				links={[
					{ href: "/execution", label: "FROM DESCRIPTION TO COMPUTATION" },
					{ href: "/representation", label: "SELECTION, NOT CONVERSION" },
					{ href: "/ladder", label: "THE RECORD — THE GUARANTEES LADDER" },
				]}
			/>

			<CiteThis slug="/lifecycle" />

			<section className="hause-grid pb-32 pt-8 border-t" style={{ borderColor: "var(--color-mist)" }}>
				<div className="col-span-12">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase opacity-50 mb-4">SOURCES</p>
					<ul className="voice-evidence text-sm opacity-60 flex flex-col gap-1">
						<li>vindex3-format-spec.md §18–20 (the 3.0 Candidate — operations, mutation, equivalence)</li>
						<li>larql-lql spec — statements, the V3 backend capability table</li>
						<li>vindex-generation-policy.md — the consumer matrix: support or refuse, never invisibility</li>
					</ul>
				</div>
			</section>
		</main>
	);
}
