import type { Metadata } from "next";
import { JsonLd } from "@chrishayuk/hause/components/JsonLd";
import { breadcrumbLd, techArticleLd } from "@chrishayuk/hause/seo";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Answer } from "@chrishayuk/hause/components/forms/Answer";
import { Ladder } from "@chrishayuk/hause/components/forms/Ladder";
import { Question } from "@chrishayuk/hause/components/forms/Question";
import { Evidence } from "@chrishayuk/hause/components/forms/Evidence";
import { Timeline } from "@chrishayuk/hause/components/forms/Timeline";
import { Observation } from "@chrishayuk/hause/components/forms/Observation";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";

export const metadata: Metadata = {
	title: "VINDEX3 Conformance, Benchmarks & Evidence",
	alternates: { canonical: "/ladder" },
	description: "The status instrument — the guarantees ladder, the gate ladders, measured evidence, the history, and the open questions, kept honestly in one place.",
};

/**
 * Rung statuses reflect the 3.0 Candidate Specification and the living
 * spec as of 2026-08-30: the execution contract is implemented through
 * 5b-3, the LQL semantic catch-up closed 2026-08-22 (execution,
 * inference, browse, mutation, patching, compose, COMPILE, logical
 * DIFF, COMPACT), and the candidate names one canonical container
 * model. When the gates move in the source documents, this page moves —
 * a status instrument, not a description.
 */
export default function LadderPage() {
	return (
		<main>
			<JsonLd
				data={techArticleLd({
					headline: "The Record",
					description:
						"The status instrument: guarantees, gate ladders, measured evidence and open questions — VINDEX3's canonical maturity answer.",
					url: "https://vindex3.org/ladder",
					siteUrl: "https://vindex3.org",
					siteName: "VINDEX3",
					dateModified: "2026-08-30",
					about: ["conformance", "benchmarks"],
				})}
			/>
			<JsonLd
				data={breadcrumbLd([
					{ name: "VINDEX3", url: "https://vindex3.org" },
					{ name: "The Record", url: "https://vindex3.org/ladder" },
				])}
			/>
			<Hero
				kicker="CONFORMANCE · CANDIDATE SPEC §0, §13–§21 · LIVING SPEC §2"
				title="THE RECORD"
				dek="Where this site keeps its honesty: what a VINDEX3 implementation guarantees, the gate ladders behind those guarantees, the measured evidence, the history, and the questions still open. Every claim on every other page answers to something here."
			/>

			<Answer
				id="is-vindex3-production-ready"
				question="Is VINDEX3 production ready?"
				answer="VINDEX3 is a 3.0 Candidate Specification (promoted 2026-08-30, graph schema 6). The format works today: production models encode, verify and execute byte-identically to their sources, containers serve real inference at recorded speeds, and every guarantee below is held by implementation gates. It is not yet Final: the named gates that remain — the shape convergence, the required/optional freeze, an independent reader, the held-out architecture test, the default flip, and the ontology lift's second half — are listed on this page with their statuses."
				cite="derived from the gate ladders below — not asserted"
			/>

			<Observation
				label="THE CURRENT STATE"
				text="VINDEX3 3.0 Candidate, promoted 2026-08-30. Graph schema 6 — the ontology lift's first half, landed the same day it was drilled: surfaces follow the declared operation program, the layer census fails closed, and operand closure is enforced at encode. The remaining Final gates are named below, each with its status; when they pass, this page will say 3.0 Final, and until they do, it will not."
			/>

			<Observation
				label="THE REFRAME"
				text="The early ladder tracked one question: can we make VINDEX3 work? That question is answered. The ladder that matters now is a different one — what guarantees does a VINDEX3 implementation provide? — and it is the first instrument below. Behind it, the older instruments keep their jobs: the pipeline ladder (G0–G8, living spec) tracks the compiler-shaped build; the V2-0…V2-4 gates are the ABI's pre-registered experiments; M1–M4 is the migration to VINDEX3 by default; and the kernel maturity ladder grades how real an implementation claim is. Nothing advances without its gate."
			/>

			<Ladder
				kicker="THE GUARANTEES — WHAT A VINDEX3 IMPLEMENTATION PROVIDES · 2026-08-30"
				rungs={[
					{
						id: "DESCRIBE",
						question: "The model can be represented: components, logical objects, representations, hidden-state edges.",
						gate: "inventory → plan → graph; admissible ⇔ blocking = 0 — unjudged is not admissible",
						status: "PASSED",
					},
					{
						id: "RECONSTRUCT",
						question: "The logical architecture is recoverable from the container alone.",
						gate: "inspect rebuilds the system with no source access; four-authority verify with both ends re-hashed",
						status: "PASSED",
					},
					{
						id: "EXECUTE",
						question: "The model executes from declared structure — zero architecture branches.",
						gate: "operand closure + independent golden parity + causal mutation controls",
						status: "PASSED",
						detail: "Closure proves the program is complete; parity proves it is correct; the controls prove the IR is in charge. Five model families execute end to end, including recurrent (KDA) and latent (MLA) attention.",
					},
					{
						id: "GENERATE",
						question: "Stateful autoregressive inference, served.",
						gate: "the KV seam's bit-identity chain; /v1 completions, chat completions, and responses share V2's wire shapes",
						status: "PASSED",
					},
					{
						id: "INSPECT",
						question: "The model is queryable as structured data.",
						gate: "WALK / DESCRIBE / SELECT in the whole-language sweep; the vindex reader answers from the artifact alone",
						status: "PASSED",
					},
					{
						id: "OBSERVE",
						question: "Execution can be traced without changing its result.",
						gate: "TRACE on a V3 binding runs observationally, in the same parity sweep",
						status: "PASSED",
					},
					{
						id: "MODIFY",
						question: "Effective model state changes through overlays; the base bytes never move.",
						gate: "mutation and patching parity; the base container stays bit-identical",
						status: "PASSED",
					},
					{
						id: "MATERIALISE",
						question: "Changes compile into a new standalone artifact.",
						gate: "COMPILE CURRENT INTO VINDEX — stamped derived, never canonical; equivalence gated through INFER, GENERATE, TRACE and WALK; real-model compose smoke green",
						status: "PASSED",
					},
					{
						id: "PROVE",
						question: "Transformations are provable: semantic diff, and maintenance that preserves identity.",
						gate: "logical DIFF operates over effective model state, not file bytes; COMPACT must preserve semantic identity",
						status: "PASSED",
					},
				]}
				caption="Every rung is held by the reference implementation's own gates today — the LQL semantic catch-up closed 2026-08-22, gated cross-platform. What no rung yet has is an independent conformance suite another implementation could run; promoting these from implementation gates to specification guarantees is a named gate on the road from Candidate to 3.0 Final."
			/>

			<Ladder
				kicker="THE PIPELINE — STATUS FROM THE LIVING SPEC, 2026-08-30"
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
						gate: "the five proofs: graph-driven generation, policy-table positions, component-wired perception, edge-discovered drafting, object-id-only lookup",
						status: "PASSED",
						detail: "The staged proof landed whole: the execution surface and operand closure, a reference executor sharing no arithmetic with production, parity against a deliberately literal golden oracle, three causal controls that mutate only the persisted graph — and container-driven execution surfaced as a CLI verb. The controls searched for hidden defaults and found none.",
					},
					{
						id: "G6",
						question: "Drafter parity.",
						gate: "speculative execution discovered from the HiddenStateEdge",
						status: "BUILDING",
						detail: "G6d — the plan lowered onto GPU-resident execution — has landed; full drafter parity is the remaining half.",
					},
					{
						id: "G7",
						question: "Performance baseline.",
						gate: "reference numbers on the target hardware class",
						status: "PASSED",
						detail: "Recorded — see the evidence below: 106 tokens per second, gpt-oss-20b on one M3 Max, greedy ids held on every arm.",
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

			<Ladder
				kicker="THE ONTOLOGY DRILL — FOUR ARCHITECTURES vs THE SCHEMA · RUN 2026-08-30"
				rungs={[
					{
						id: "SSM",
						question: "A pure SSM decoder — no attention anywhere.",
						gate: "zero attention surfaces can be valid; stateful operations need no fake attention or KV",
						status: "DISPROVED",
						detail: "The schema flinched, exactly where the lift predicted: the attention surface is mandatory and fabricated — a pure-recurrent stack already in the tree passes completeness carrying a softmax surface zero layers read — and a checkpoint declaring no layer types slips the census and encodes before closure can refuse. Confirmed: lift one, plus a fail-closed census and closure at encode time. Closed the same day: all three landed at graph schema 6, and the live witness below is the proof.",
					},
					{
						id: "HYBRID",
						question: "KDA + MLA + softmax — three continuation-state kinds in one program.",
						gate: "one program declares heterogeneous state; no family owns continuation globally",
						status: "DISPROVED",
						detail: "Not hypothetical — this is Kimi-Linear, executing in-tree. The state schema cannot yet declare KDA precision or MLA latent-KV geometry, and one judged fact the container cannot carry at all was found. The confirmation came with a gift: in the code, KvState is already an alias of ContinuationProvider, retiring at a named consolidation point — lift two is underway under its own name.",
					},
					{
						id: "SYSTEM",
						question: "Audio → perception → projector → text, plus a drafter.",
						gate: "components and interfaces compose without special multimodal topology rules",
						status: "PASSED",
						detail: "As stated, it composes today — roles, objects and the hidden-state edge cover it. The ceiling sits just past it and is named as a scope decision: three roles, one edge species, and refusals — never guesses — at every boundary beyond.",
					},
					{
						id: "CODEC",
						question: "An unknown low-bit sparse-MoE representation, permuted experts.",
						gate: "new codec vocabulary is additive; an older reader degrades, never lies",
						status: "PASSED",
						detail: "The additive claim is real: unknown encodings inspect clean, every execution fallthrough refuses by name, and COMPACT carries what it cannot decode byte-identically. The drill still earned its keep — two preservation defects against the spec's own compatibility rules were found, named, and closed the same day: unknown fields now survive the bake, and discard is sanctioned only when reported.",
					},
				]}
				caption="Hostile schema review against the real types, findings recorded before verdicts — sixteen findings, and every schema gap landed inside the two pinned lifts, nowhere else. The ontology question itself did not flinch. The full ledger is docs/vindex3-ontology-drill.md."
			/>

			<Ladder
				kicker="THE FIRST LIVE WITNESS — MAMBA2-780M · PURE SSM · 2026-08-30"
				rungs={[
					{
						id: "REFUSE",
						question: "Before the lift: does the format approximate an architecture it cannot represent?",
						gate: "admission itemises what is missing, or it is not admission",
						status: "PASSED",
						detail: "It did not approximate. The physical ontology held — decoder stack, embedding and final norm placed cleanly from 434 tensors — and admission refused with nineteen blocking findings: eighteen unrepresented SSM semantics and one incomplete execution surface. The container did not guess at an unsupported architecture; it itemised the missing semantics and refused. Even finding zero was real: the checkpoint's own config carries a bare Infinity that a strict JSON reader must judge, not fake.",
					},
					{
						id: "ADMIT",
						question: "After schema 6: does the pure case admit for semantic reasons — not by exemption?",
						gate: "19 blocking → 0 blocking, every key judged: consumed into the operator, declaration-only, or refused",
						status: "PASSED",
						detail: "A registered Mamba2 operator judgment consumes the SSM geometry — and the declared geometry must close over the tensor estate exactly: in_proj rows 2·d_inner + 2·groups·state + heads, the conv deliberately excluding the gate channels, per-head scalar decay. The five initialisation-only keys grade declaration-only. Nothing was waved through.",
					},
					{
						id: "ENCODE",
						question: "Does it encode with zero fabricated surfaces — and does closure hold at encode?",
						gate: "closure at encode: a container whose operands do not close is removed, not written",
						status: "PASSED",
						detail: "Encoded: 48 mamba2 operators, no attention surface anywhere, no FFN surface anywhere — the mixer is the whole block — one pre-mixer norm per layer, and all 434 operands closing against the declared geometry at encode time. The CI twin proves the negative too: drop one per-head tensor and the encode refuses, names the missing role, and removes its own output.",
					},
					{
						id: "OPEN",
						question: "Does ordinary LQL open it — with the source checkpoint deleted?",
						gate: "USE · STATS · SHOW LAYERS · EXPLAIN INFER from the container alone; refusal by name where no executor exists",
						status: "PASSED",
						detail: "With the source checkpoint gone, USE binds, STATS reports 0 sliding / 0 full / 48 recurrent and a continuation of recurrent state only — 18.9M elements, constant in sequence length — SHOW LAYERS names every layer mamba2, EXPLAIN INFER walks the mixer program operand by operand, and INFER refuses by name: represented but not executable, no executor exists for this operator. No Mamba2Model escape hatch anywhere in the chain.",
					},
					{
						id: "GENERATE",
						question: "Does the generic V3 execution path generate correctly — paritied against the reference?",
						gate: "prefill logits, first token, 16–32 recurrent steps, prompt lengths, state reset, chunked vs one-shot — against a captured fp32 oracle",
						status: "OPEN",
						detail: "The oracle is already banked: full per-position prefill logits, per-layer hidden states and 32 stepwise decode logits for three prompt lengths, one crossing the SSD chunk boundary — bitwise-deterministic, with token-by-token recurrence agreeing with the one-shot scan to 2e-4. What remains is the generic Mamba2 executor itself; until it lands, the operator stays honestly marked represented, not executable.",
					},
				]}
				caption="The witness the schema-6 delta was defined against, run live the day the lift landed — the refusal is as much a part of the record as the admission. Next in line: mamba2attn-2.7b, the surfaces-follow-the-program A/B — the same generic runtime, pure SSM against hybrid, differing only in their declared programs."
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
					{
						date: "2026-08-22",
						text: "The semantic catch-up closes: VINDEX3 reaches full LQL parity with VINDEX2 — execution, inference, browse, mutation, patching, compose, COMPILE, logical DIFF, COMPACT — gated cross-platform, with a real-model compose smoke green. The chat-completions and responses serving arms land the same week. VINDEX3 becomes the named candidate primary generation.",
					},
					{
						date: "2026-08-30",
						text: "3.0-candidate published — the promotion from draft. One canonical container model: the graph shape is normative, the bank-import shape is named, ranked and given a convergence rule; the contract stack is the spec's own structure; compatibility rules say what a conforming reader must understand, ignore, refuse and preserve.",
					},
					{
						date: "2026-08-30",
						text: "The same day: the four-architecture ontology drill runs, and its first half lands. Graph schema 6 — surfaces follow the declared operation program, presence means semantic presence, the census fails closed, closure moves to encode. The first pure-SSM witness goes from a nineteen-finding refusal to a zero-blocking admission with no fabricated surface anywhere, and opens through ordinary LQL with its source checkpoint deleted.",
					},
				]}
			/>

			<Ladder
				kicker="OPEN RESEARCH — AUTOMATIC PRECISION-MAP DISCOVERY · RECORDED · GRANITE-4.1-3B"
				rungs={[
					{
						id: "1A",
						question: "Weight error alone.",
						gate: "identifies late-FFN as highest-return AND rejects v/k/down as low-value",
						status: "DISPROVED",
						detail: "Spearman −0.313 against the banked ground truth. A fixed relative grid gives every tensor nearly the same relative error, so a per-byte score collapses into ranking by inverse size — the frozen negatives came first and second.",
					},
					{
						id: "1B",
						question: "Activation-weighted relative error.",
						gate: "the same frozen bar",
						status: "DISPROVED",
						detail: "Spearman −0.524 — worse. The normalising denominator rewards operands whose output is small, removing exactly the factor the activations supplied.",
					},
					{
						id: "1B′",
						question: "Absolute local consequence, pre-registered.",
						gate: "the same frozen bar, one shot, no revisions",
						status: "DISPROVED",
						detail: "Spearman +0.595, late5-ffn rank one, the knee recovered — and one structural counterexample: down_proj carries the largest local consequence in the model by twenty times, yet protecting it measurably worsens the tail. A local score cannot see where an error lands in the computation.",
					},
					{
						id: "1C",
						question: "Replay the error through the remaining layers.",
						gate: "cheaper than measuring the truth, or it is not a screen",
						status: "DISPROVED",
						detail: "Rejected on cost: 80.8 candidate-equivalents against 15 for the entire ground-truth sweep, and the executor's row axis is the causal position axis, so directions cannot be batched. Mathematically correct, wrong algorithm.",
					},
					{
						id: "FISHER",
						question: "Second-order KL curvature via a reverse-mode sketch.",
						gate: "reverse-mode execution — a research programme, not a feature",
						status: "OPEN",
						detail: "First-order sensitivity against KL is identically zero, so the leading term is curvature — and the curvature matrix factors exactly, giving every layer's sensitivity in one backward pass. Candidate, not built: the reference implementation has no reverse mode.",
					},
				]}
				caption="Four screens, four recorded deaths, one candidate — the full argument is the Discovering the Map exhibit."
			/>

			<Question
				status="OPEN"
				text="If production models already round-trip through VINDEX3 byte-identical, why does the default extractor still write VINDEX2?"
				detail="Because the flip is a decision, not a drift. VINDEX3 is the named candidate to become the primary generation, and the migration to it is nearly complete — M1 through M3 have passed. But making it the default is a single, deliberate change, made in exactly one place — and it has not been made yet. The format works. It just isn't yet what you get without asking."
			/>

			<Question
				status="OPEN"
				text="Is the ABI frozen?"
				detail="No — and it says so itself. Candidate means the model is settled, not that the bytes are frozen. The format already works: production models encode, verify, and execute byte-identically to their sources; containers serve real inference; representations compile beside their originals and a selection really does change which bytes load. What remains is named in the candidate itself: executing the shape-convergence rule, the required/optional freeze, an independent reader that no longer links the writer's own tree, the held-out architecture test, the default flip, the last pre-registered bank-ABI rows — and the ontology lift's second half. The first half is no longer pinned but landed: the four-architecture drill ran on 30 August, every schema gap fell inside the two lifts, and graph schema 6 shipped the same day with a live pure-SSM witness. The state-schema half — declared KDA precision, MLA latent geometry — remains, additive within the schema-6 span. Until those gates pass, candidate it stays."
			/>

			<Observation
				label="THE HONEST BAR"
				text="The strongest line in the specification is a concession written in advance. The conformance models cannot prove the format generalises — the ABI was designed against them. Only a held-out architecture, onboarded after the freeze under a rule of zero format changes, tests generalisation rather than fit. And if that test fails, the portable-substrate claim is downgraded — in the success criteria themselves, where everyone can see it. The bar cannot drift, because it is written down before the results are."
			/>

			<Observation
				label="AN OPEN SPECIFICATION"
				text="VINDEX3 is an independent container specification — since 2026-08-30, a Candidate Specification: a self-describing, executable and queryable model container. Reference tooling exists — an inventory, a planner, an encoder, a verifier, a server, a format-native reader — but the format is defined by its documents, not by any tool. This site is that specification, seen: what a container holds, who decides what is true about it, and what it takes to prove it faithful to its source."
			/>

			<Observation
				label="SCOPE"
				text="VINDEX3 is specified by companion documents, and this site draws on them all. The Candidate Specification owns the container model and the contract stack — one canonical layering, in which the graph shape is normative and the earlier bank-import shape is named, ranked, and given a convergence rule. The living spec tracks what is implemented and gated; the runtime document owns state and serving; the generation policy owns the migration. Where an exhibit shows the bank layout, it is showing a named transitional shape, not a rival definition."
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
							<a href="https://github.com/chrishayuk/larql/blob/main/crates/larql-vindex/docs/vindex3-format-spec.md" className="border-b pb-0.5" style={{ borderColor: "var(--color-accent)" }}>
								vindex3-format-spec.md — the 3.0 Candidate Specification →
							</a>
						</li>
						<li>
							<a href="https://github.com/chrishayuk/larql/blob/main/docs/vindex3-format.md" className="border-b pb-0.5" style={{ borderColor: "var(--color-accent)" }}>
								vindex3-format.md — the living spec →
							</a>
						</li>
						<li>
							<a href="https://github.com/chrishayuk/larql/blob/main/docs/vindex3-runtime.md" className="border-b pb-0.5" style={{ borderColor: "var(--color-accent)" }}>
								vindex3-runtime.md — the state and serving contract →
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
