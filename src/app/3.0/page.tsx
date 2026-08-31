import type { Metadata } from "next";
import { JsonLd } from "@chrishayuk/hause/components/JsonLd";
import { breadcrumbLd, citationLd } from "@chrishayuk/hause/seo";
import { citationMeta } from "@chrishayuk/hause/cite";
import { Provenance } from "@chrishayuk/hause/components/forms/Provenance";
import { Citation } from "@chrishayuk/hause/components/forms/Citation";
import { SPEC, SPEC_HISTORY } from "@/data/citation";
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
	// This page IS the citable object, so the head carries the specification's
	// own record — the tags a reference manager reads without being asked.
	other: citationMeta(SPEC),
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
			<JsonLd data={citationLd(SPEC)} />
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
				answer="VINDEX3 3.0 is a Candidate Specification for a self-describing, executable, queryable model container, promoted from draft on 2026-08-30 and carrying graph schema 6. The container model is settled: one canonical graph shape, a contract stack, compatibility rules, and a per-layer operator program that surfaces and state follow. Schema 6 has now executed both a pure SSM and a mixed Mamba2 / conv-QKV-attention model through the generic runtime with no family lookup and no further schema change — the hybrid matches its fp32 oracle across 468 positions and reproduces source-hidden LQL generation token-for-token. Lift 2 closed on 2026-08-31 inside the same schema: a 48-billion-parameter hybrid was re-encoded to carry the state facts it had been missing, and all five of its representation payload hashes came back byte-identical — meaning corrected without touching a single stored representation. Candidate means the model is settled, not that the bytes are frozen — the gates that remain before Final are named below, each with its status."
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
						detail: "Held live three times over: production models execute from the container alone; the pure-SSM witness generated through ordinary LQL with its source checkpoint deleted, reproducing the reference's greedy continuation word-for-word; and the mixed Mamba2 / conv-QKV-attention hybrid did the same id-for-id — its executor defined entirely by the persisted operator, with no family lookup anywhere in the path.",
					},
					{
						id: "PROGRAMMABLE",
						question: "Execution follows the encoded operator program.",
						gate: "closure + golden parity + causal mutation controls; since schema 6, surfaces follow the program",
						status: "PASSED",
						detail: "A binding is a closed operand-verified program — softmax, MLA, KDA, gated-delta, Mamba2, conv-QKV attention are vocabulary, not ontology. Both directions are executed evidence now: an architecture with no attention fabricates none, and one with selected non-standard attention gets that operator exactly where declared. The causal controls searched for hidden defaults and found none.",
					},
					{
						id: "STATE-COMPLETE",
						question: "Continuation requirements are explicit.",
						gate: "the program declares what persists between tokens; undeclared precision is refused, never chosen",
						status: "PASSED",
						detail: "Kimi-Linear-48B-A3B-Instruct was re-encoded under lift 2 with its representation payloads unchanged. Its 20 KDA layers declare recurrent state plus convolution history; its 7 MLA layers declare a growing latent cache. All operands close, including the MLA KV-A normalisation epsilon — a judged fact the container previously could not carry at all — and every reporting surface derives its account of continuation from the same plan the executor allocates from. One layer may carry a KV cache AND a convolution history; a consumer that holds only rows refuses such a layer rather than allocating half of it.",
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
				text="The ontology lift is closed on both halves — schema 6 on 2026-08-30, the typed continuation-state schema on 2026-08-31, the second additive within the first. Six named gates remain, none of them drift: the shape convergence executed; the required/optional RFC-2119 freeze; the independent reader (vindex-core) with a conformance harness; the held-out architecture test (E8), run after the freeze under a rule of zero format changes; the default flip (M4); and the remaining pre-registered bank-ABI rows. What remains is standards, conformance and release closure rather than architecture. Each gate's current status lives on the Record."
			/>

			<Observation
				label="WHAT IS NOT A 3.0 GATE — KIMI REAL-SCALE EXECUTION"
				text="Execution semantics close for Kimi-Linear-48B: every operand accounted, every continuation region declared, the plan built from the container alone. CPU reference execution of that model is nonetheless constrained by residency, not by meaning — the backend expands the 94 GB BF16 routed-expert bank to F32, which would need roughly 188 GB resident on a 137 GB machine. Device and streaming execution are the appropriate path. This is an execution-placement axis, and it is deliberately not counted against STATE-COMPLETE: model meaning, physical representation and residency are three separate things, and this is the third one refusing."
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
		
			<Provenance record={SPEC} history={SPEC_HISTORY} citeHref="#cite" />
			<Citation
				record={SPEC}
				kicker="CITE THE SPECIFICATION"
				note="Cite the version, not the website: this URL is durable, and 3.1 will be a different object rather than a silent edit of this one. No DOI appears above because none has been registered — a reference carrying an author, a date, a version and a canonical URL is complete without one."
			/>
		</main>
	);
}
