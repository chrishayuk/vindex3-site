import type { Metadata } from "next";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Ladder } from "@chrishayuk/hause/components/forms/Ladder";
import { Question } from "@chrishayuk/hause/components/forms/Question";
import { Evidence } from "@chrishayuk/hause/components/forms/Evidence";
import { Timeline } from "@chrishayuk/hause/components/forms/Timeline";
import { Observation } from "@chrishayuk/hause/components/forms/Observation";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";

export const metadata: Metadata = {
	title: "VINDEX3 Conformance, Benchmarks & Evidence",
	alternates: { canonical: "/ladder" },
	description: "The status instrument — gate ladders, measured evidence, the history, and the open questions, kept honestly in one place.",
};

/**
 * Rung statuses reflect the living spec as of 2026-08-11 (§1–§7
 * implemented and gated; §8 pins the design for the rung currently
 * being built, G5) and the ABI spec's own draft-status note. When the
 * gates move in the source documents, this page moves — a status instrument,
 * not a description.
 */
export default function LadderPage() {
	return (
		<main>
			<Hero
				kicker="CONFORMANCE · LIVING SPEC §2 · ABI §13, §16"
				title="THE RECORD"
				dek="Where this site keeps its honesty: the gate ladders, the measured evidence, the history, and the questions still open. Every claim on every other page answers to something here."
			/>

			<Observation
				label="THREE LADDERS, ONE KEY"
				text="G0 through G8 belong to the living spec: the semantic rungs, from reading a source to alternate physical plans. The V2-0 through V2-4 gates named below belong to the ABI's pre-registered experiments: what must pass before a byte freezes. M1 through M4 belong to the generation policy: the migration to VINDEX3 by default. And the maturity ladder is the kernel ledger's vocabulary for how real an implementation claim is. Four instruments, one habit: nothing advances without its gate."
			/>

			<Ladder
				kicker="THE LADDER — STATUS FROM THE LIVING SPEC, 2026-08-12"
				rungs={[
					{
						id: "G0",
						question: "What does the source declare?",
						gate: "the source inspector emits the inventory",
						status: "PASSED",
					},
					{
						id: "G1",
						question: "Can the schema describe it?",
						gate: "the representability planner — typed findings, non-zero exit on blockers",
						status: "PASSED",
					},
					{
						id: "G2",
						question: "Generalise the schema until reality fits.",
						gate: "blocking = 0, mismatched = 0, unknown = 0",
						status: "PASSED",
						detail: "Findings are typed twice — by category (representable / mismatched / unrepresented / interface) and by semantic class. Admissible ⇔ blocking == 0. Unjudged is not admissible.",
					},
					{
						id: "G3",
						question: "Materialise the graph.",
						gate: "encode, then inspect reconstructs the system solely from the container",
						status: "PASSED",
					},
					{
						id: "G4",
						question: "Prove source ≡ encoded.",
						gate: "four-authority comparison + payload-hash equality",
						status: "PASSED",
						detail: "Declared ≡ Resolved ≡ Graph ≡ Encoded, with both ends re-hashed at verify time so drift and corruption fail differently.",
					},
					{
						id: "G5",
						question: "Execute from the encoded description.",
						gate: "forward pass aimed at zero architecture branches — proven when the held-out architecture test lands",
						status: "BUILDING",
						detail: "Half sealed already: the execution surface and operand closure are implemented, and the reference executor matches its source exactly on the first stage. The gate itself is five proofs. Text generation driven by the graph's own semantics. Position handling read only from the per-layer attention policy. Perception wired through the component, never the model family. Drafter capture discovered only from the hidden-state edge. Lookup only by logical object id.",
					},
					{
						id: "G6",
						question: "Drafter parity.",
						gate: "speculative execution discovered from the HiddenStateEdge",
						status: "OPEN",
					},
					{
						id: "G7",
						question: "Performance baseline.",
						gate: "reference numbers on the target hardware class",
						status: "OPEN",
					},
					{
						id: "G8",
						question: "Alternate physical and execution plans.",
						gate: "implementation-specific layouts and prediction over the same logical system",
						status: "OPEN",
						detail: "G8 must not contaminate G0–G5: optimisation is an alternate plan over the same graph, never a schema change.",
					},
				]}
				caption="The compiler-shaped pipeline, as a ladder: inventory, representability, system graph, physical encoding, verification, execution — then and only then, performance."
			/>

			<Ladder
				kicker="KERNEL MATURITY — THE SERVING-FORMAT LEDGER"
				rungs={[
					{ id: "representable", question: "The format can be stored and described." },
					{ id: "reference", question: "A reference kernel decodes and executes it, slowly and surely." },
					{ id: "grouped", question: "Grouped dispatch works across expert extents." },
					{ id: "dispatched", question: "Production dispatch paths run it end to end." },
					{ id: "production", question: "Served, measured, supported." },
				]}
				caption="No criterion is met by a representable-only demonstration."
			/>

			<Ladder
				kicker="THE MIGRATION — RUNGS TO THE FLIP (GENERATION POLICY, 2026-08-23)"
				rungs={[
					{
						id: "M1",
						question: "The seam: an extraction-generation policy with a pinned default.",
						gate: "policy type + a test pinning that auto-extraction resolves to V2 until the flip is decided",
						status: "PASSED",
					},
					{
						id: "M2",
						question: "V3 production reachable from the extraction surfaces.",
						status: "PASSED",
					},
					{
						id: "M3",
						question: "Consumer readiness — every consumer supports V3 or refuses visibly.",
						gate: "support or refuse, never invisibility",
						status: "PASSED",
					},
					{
						id: "M4",
						question: "The flip: new extraction writes VINDEX3 by default.",
						gate: "DEFAULT_EXTRACTION_GENERATION = V3, changed together with its pinned test, in one commit",
						status: "OPEN",
					},
				]}
				caption="The flip is a named decision, made in exactly one place — never a side effect of a CLI default or a recipe template. After it, VINDEX2 receives no architectural expansion: compatibility, indefinitely; expansion, never."
			/>

			<Evidence
				items={[
					{
						label: "It is fast — gpt-oss-20b served from a VINDEX3 container",
						status: "SUPPORTED",
						detail:
							"106 tokens per second on a single M3 Max, measured 2026-08-20 — up from 91 after encode-ahead and kernel fusion, with a per-stage GPU ledger attributing every millisecond, and the same greedy ids held on every arm from 91 to 106. The same container also decodes on plain CPU. On every model where both generations exist, VINDEX3 meets or beats its predecessor.",
					},
					{
						label: "Selecting a representation pays in real bytes",
						status: "SUPPORTED",
						detail:
							"Switching one model's selected expert representation — from a 6.56 bits-per-weight transcode to native 4.25-bit banks — cut expert reads from 1,959 to 1,269 MB per token (gpt-oss-20b, M3 Max, measured 2026-08-14). No conversion happened. A profile simply selected different bytes that were already there.",
					},
					{
						label: "The speed never changed the answer",
						status: "SUPPORTED",
						detail:
							"Across the whole optimisation ladder — 10.2 to 77.2 tokens per second on one M3 Max, 2026-08-10 to 2026-08-14 — GPU and CPU produced the identical greedy output, re-verified at every rung; the later 91-to-106 arms held the same discipline. Faster is only accepted when it is provably the same.",
					},
				]}
			/>

			<Timeline
				entries={[
					{
						date: "Before 3.0",
						text: "VINDEX2 is the predecessor generation. VINDEX3 inherits its core premise — the weights stay queryable, not just loadable — and extends it with component addressing and graded representation authority.",
					},
					{
						date: "2026-08-01",
						text: "3.0-draft-2 published — three binary-layout corrections and two clarifications from the first LYRW v2 implementation. Five production models already round-trip through it byte-identically: gpt-oss-20b, Gemma 4 26B-A4B, and Granite 4.1 at 3B, 8B, and 30B.",
					},
					{
						date: "2026-08-04",
						text: "The c8 gate closes: a real Gemma 4 26B-A4B layer reopens and verifies clean, 256 of 256 regions byte-identical.",
					},
				]}
			/>

			<Question
				status="OPEN"
				text="If production models already round-trip through VINDEX3 byte-identical, why does the default extractor still write VINDEX2?"
				detail="Because the flip is a decision, not a drift. VINDEX3 is the named candidate to become the primary generation, and the migration to it is nearly complete. But making it the default is a single, deliberate change, made in exactly one place — and it has not been made yet. The format works. It just isn't yet what you get without asking."
			/>

			<Question
				status="OPEN"
				text="Is the ABI frozen?"
				detail="No — and it says so itself. Nothing freezes until the pre-registered gates pass. The format already works: five production models encode, verify, and execute byte-identically to their sources, and containers serve real inference today. What remains is proof, not function. Some pre-freeze rows have already closed — selecting an absent variant now refuses correctly, before any byte is read. Others stay open — browse parity, and steering: no writer produces a multi-variant container yet, so a selection cannot yet change which bytes load. Until every gate passes, the default extractor keeps writing VINDEX2."
			/>

			<Observation
				label="THE HONEST BAR"
				text="The strongest line in the specification is a concession written in advance. The conformance models cannot prove the format generalises — the ABI was designed against them. Only a held-out architecture, onboarded after the freeze under a rule of zero format changes, tests generalisation rather than fit. And if that test fails, the portable-substrate claim is downgraded — in the success criteria themselves, where everyone can see it. The bar cannot drift, because it is written down before the results are."
			/>

			<Observation
				label="AN OPEN SPECIFICATION"
				text="VINDEX3 is an independent container specification. Reference tooling exists — an inventory, a planner, an encoder, a verifier, a server — but the format is defined by its documents, not by any tool. This site is that specification, seen: what a container holds, who decides what is true about it, and what it takes to prove it faithful to its source."
			/>

			<Observation
				label="SCOPE"
				text="VINDEX3 is specified by two companion documents, and this site draws on both. The ABI spec governs the bytes on disk — behind the Container, Bytes, and Representation exhibits. The living spec governs the semantics — behind the Graph, Execution, Authority, and G-Ladder exhibits. Where the two describe different physical shapes, the exhibits say which is which."
			/>

			<Connection
				text="Two of those pre-freeze rows are exhibits here already."
				links={[
					{ href: "/representation", label: "SELECTION, NOT CONVERSION" },
					{ href: "/authority", label: "WHERE TRUTH COMES FROM" },
				]}
			/>

			<section className="hause-grid pb-32 pt-8 border-t" style={{ borderColor: "var(--color-mist)" }}>
				<div className="col-span-12">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase opacity-50 mb-4">SOURCES</p>
					<ul className="voice-evidence text-sm opacity-60 flex flex-col gap-1">
						<li>
							<a href="https://github.com/chrishayuk/larql/blob/main/docs/vindex3-format.md" className="border-b pb-0.5" style={{ borderColor: "var(--color-accent)" }}>
								vindex3-format.md — the living spec →
							</a>
						</li>
						<li>
							<a href="https://github.com/chrishayuk/larql/blob/main/crates/larql-vindex/docs/vindex3-format-spec.md" className="border-b pb-0.5" style={{ borderColor: "var(--color-accent)" }}>
								vindex3-format-spec.md — the ABI, 3.0-draft-2 →
							</a>
						</li>
						<li>
							<a href="https://github.com/chrishayuk/larql/blob/main/docs/vindex3-experiments.md" className="border-b pb-0.5" style={{ borderColor: "var(--color-accent)" }}>
								vindex3-experiments.md — the pre-registered programme, gates V2-0…V2-4 →
							</a>
						</li>
						<li>
							<a href="https://github.com/chrishayuk/larql/blob/main/docs/vindex-generation-policy.md" className="border-b pb-0.5" style={{ borderColor: "var(--color-accent)" }}>
								vindex-generation-policy.md — the migration contract →
							</a>
						</li>
						<li>
							<a href="https://github.com/chrishayuk/larql" className="border-b pb-0.5" style={{ borderColor: "var(--color-accent)" }}>
								github.com/chrishayuk/larql — the reference implementation →
							</a>
						</li>
					</ul>
				</div>
			</section>
		</main>
	);
}
