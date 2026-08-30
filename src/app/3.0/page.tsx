import type { Metadata } from "next";
import { JsonLd } from "@chrishayuk/hause/components/JsonLd";
import { breadcrumbLd, techArticleLd } from "@chrishayuk/hause/seo";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Answer } from "@chrishayuk/hause/components/forms/Answer";
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { Ladder } from "@chrishayuk/hause/components/forms/Ladder";
import { Observation } from "@chrishayuk/hause/components/forms/Observation";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";

export const metadata: Metadata = {
	title: "VINDEX3 3.0 — Version, Status & the Six Claims",
	alternates: { canonical: "/3.0" },
	description:
		"The durable version page: what VINDEX3 3.0 claims — self-describing, programmable, state-complete, representation-independent, fail-closed, verifiable — what already holds each claim up, and exactly what remains before Candidate becomes Final.",
};

/**
 * The durable version link. Today it says CANDIDATE and means it; when
 * the named gates pass, this page flips to FINAL — same URL, same six
 * claims, statuses moved by the Record rather than by copywriting.
 * Nothing here is asserted that the Record does not hold.
 */
export default function VersionPage() {
	return (
		<main>
			<JsonLd
				data={techArticleLd({
					headline: "VINDEX3 3.0 — Version, Status & the Six Claims",
					description:
						"What VINDEX3 3.0 claims, what already holds each claim up, and exactly what remains before Candidate becomes Final.",
					url: "https://vindex3.org/3.0",
					siteUrl: "https://vindex3.org",
					siteName: "VINDEX3",
					dateModified: "2026-08-30",
					about: ["model container format", "specification lifecycle", "conformance"],
				})}
			/>
			<JsonLd
				data={breadcrumbLd([
					{ name: "VINDEX3", url: "https://vindex3.org" },
					{ name: "3.0", url: "https://vindex3.org/3.0" },
				])}
			/>

			<Hero
				kicker="THE VERSION · 3.0 CANDIDATE · GRAPH SCHEMA 6 · 2026-08-30"
				title="VINDEX3 3.0"
				dek="One page, one answer: what 3.0 claims, what already holds each claim up, and exactly what remains before Candidate becomes Final. When the named gates pass, this page flips — same URL, same six claims."
			/>

			<Answer
				id="what-is-vindex3-3-0"
				question="What is VINDEX3 3.0, and what is its current status?"
				answer="VINDEX3 3.0 is a Candidate Specification for a self-describing, executable, queryable model container, promoted from draft on 2026-08-30 and carrying graph schema 6. The container model is settled: one canonical graph shape, a contract stack, compatibility rules, and a per-layer operator program that surfaces and state follow. Candidate means the model is settled, not that the bytes are frozen — the gates that remain before Final are named below, each with its status."
				cite="derived from the Record — /ladder"
			/>

			<Statement text="The destination sentence, and the bar this page answers to: the model is the authority." />

			<Ladder
				kicker="THE SIX CLAIMS — EACH HELD BY EVIDENCE, OR HONESTLY NOT YET"
				rungs={[
					{
						id: "SELF-DESCRIBING",
						question: "The source checkpoint is not required for execution.",
						gate: "the deletion invariant: remove the checkpoint, config, model type and architecture name — execution must not change",
						status: "PASSED",
						detail: "Held live twice over: production models execute from the container alone, and the pure-SSM witness opened through ordinary LQL with its source checkpoint deleted — structure, state story and refusals all from the artifact.",
					},
					{
						id: "PROGRAMMABLE",
						question: "Execution follows the encoded operator program.",
						gate: "closure + golden parity + causal mutation controls; since schema 6, surfaces follow the program",
						status: "PASSED",
						detail: "A binding is a closed operand-verified program — softmax, MLA, KDA, gated-delta, Mamba2 are vocabulary, not ontology. The causal controls searched for hidden defaults and found none.",
					},
					{
						id: "STATE-COMPLETE",
						question: "Continuation requirements are explicit.",
						gate: "the program declares what persists between tokens; undeclared precision is refused, never chosen",
						status: "BUILDING",
						detail: "The declaration side holds — each operation declares one or more typed state regions (KV, latent KV, or a folded state with its convolution history), witnessed by a three-state hybrid and a pure-SSM container whose layers each carry two. The typed state schema (declared KDA precision, MLA latent geometry) is the ontology lift's second half: additive within schema 6, and honestly open.",
					},
					{
						id: "REPRESENTATION-INDEPENDENT",
						question: "Logical identity survives physical encoding.",
						gate: "selection, not conversion — a profile selects among physically present variants",
						status: "PASSED",
						detail: "Measured, not asserted: switching one model's selected expert representation cut expert reads from 1,959 to 1,269 MB per token with no conversion — different bytes, same logical object, same recorded identity.",
					},
					{
						id: "FAIL-CLOSED",
						question: "Unknown semantics refuse rather than default.",
						gate: "unjudged keys block, undeclared families fail the census closed, closure is enforced at encode",
						status: "PASSED",
						detail: "The witness that proves the posture: a pure-SSM checkpoint was refused with nineteen itemised findings before its operator was judged — and a deliberately broken encode is removed, not written, with the missing role named.",
					},
					{
						id: "VERIFIABLE",
						question: "Conformance is evidence-backed — by an independent reader.",
						gate: "four-authority verify today; an independent conformance suite is a named Final gate",
						status: "BUILDING",
						detail: "Verification is real — both ends re-hashed, drift and corruption failing differently — but every guarantee is held by the reference implementation's own gates. Promoting them to specification guarantees an independent reader can run is exactly the vindex-core carve-out on the road to Final.",
					},
				]}
				caption="Statuses move with the Record, not with this page's copy. Two claims say BUILDING because they are building — that is what makes the other four worth believing."
			/>

			<Observation
				label="WHAT REMAINS BEFORE FINAL"
				text="Seven named gates, none of them drift: the shape convergence executed; the required/optional RFC-2119 freeze; the independent reader (vindex-core) with a conformance harness; the held-out architecture test (E8), run after the freeze under a rule of zero format changes; the default flip (M4); the remaining pre-registered bank-ABI rows; and the ontology lift's second half — the typed continuation-state schema. The first half landed 2026-08-30 as graph schema 6, with a live pure-SSM witness. Each gate's current status lives on the Record."
			/>

			<Connection
				text="The durable links."
				links={[
					{ href: "/ladder", label: "THE RECORD — STATUSES & EVIDENCE" },
					{ href: "/get-started", label: "GET STARTED — THE CLI" },
					{ href: "https://github.com/chrishayuk/larql/blob/main/crates/larql-vindex/docs/vindex3-format-spec.md", label: "THE CANDIDATE SPECIFICATION" },
					{ href: "https://github.com/chrishayuk/larql", label: "GITHUB — THE REFERENCE IMPLEMENTATION" },
				]}
			/>
		</main>
	);
}
