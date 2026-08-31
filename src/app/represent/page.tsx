import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { Observation } from "@chrishayuk/hause/components/forms/Observation";
import { Evidence } from "@chrishayuk/hause/components/forms/Evidence";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";
import { Answer } from "@chrishayuk/hause/components/forms/Answer";
import { JsonLd } from "@chrishayuk/hause/components/JsonLd";
import { breadcrumbLd, techArticleLd } from "@chrishayuk/hause/seo";
import { TopologyExplorer, CompositionFigure, LedgerFigure } from "@/components/RepresentFigures";

export const metadata: Metadata = {
	title: "REPRESENT: Behaviour-Contract Search for Mixed-Precision LLMs",
	alternates: { canonical: "/represent" },
	description:
		"Don't choose a quantization — declare the behaviour to preserve. How REPRESENT searches candidate representations under a frozen behavioural contract, why individually safe substitutions fail together, and the recorded Kimi Linear 48B topology.",
};

/**
 * The optimizer chapter — the sequel Discovery asks for. Every number
 * is a recorded run against Kimi-Linear-48B-A3B-Instruct from the
 * banked precision-ladder records: the frozen kimi-logit-v3 contract
 * (its six criteria and 8,192-position authority scale), the
 * 256-position diagnostics, the composed-map measurements, and the
 * in-session decode benchmark. CLI surfaces shown as worked shapes
 * are labelled exactly that; roadmap items are labelled roadmap.
 */
export default function RepresentPage() {
	return (
		<main>
			<JsonLd
				data={techArticleLd({
					headline: "REPRESENT",
					description:
						"Behaviour-contract search over physical representations: candidate encodings, composition-aware search, and whole-model verification.",
					url: "https://vindex3.org/represent",
					siteUrl: "https://vindex3.org",
					siteName: "VINDEX3",
					dateModified: "2026-08-31",
					about: ["mixed precision", "quantization search", "behavioural contract"],
				})}
			/>
			<JsonLd
				data={breadcrumbLd([
					{ name: "VINDEX3", url: "https://vindex3.org" },
					{ name: "REPRESENT", url: "https://vindex3.org/represent" },
				])}
			/>
			<Hero
				kicker="REPRESENT · RECORDED RUNS · KIMI-LINEAR-48B-A3B"
				title="DON'T CHOOSE A QUANTIZATION. DECLARE THE BEHAVIOUR YOU WANT TO PRESERVE."
				dek="Quantization asks you to pick a format and hope. REPRESENT inverts it: freeze a behavioural contract, let a composition-aware search discover the cheapest physical topology that provably satisfies it — and verify the composed model, not tensor by tensor."
			/>

			<Answer
				id="what-is-represent"
				question="What is REPRESENT?"
				answer="REPRESENT is VINDEX3's optimizer: it searches over candidate physical representations (BF16, Q8_0, Q6_K, Q4-class…) for each region of a model, subject to a frozen behavioural contract, and returns the cheapest topology whose COMPOSED behaviour passes at authority scale. Quantization is one of the mechanisms it uses; the decision-making — which representation, where, in which combination — is the point."
			/>

			<Answer
				id="represent-vs-quantization"
				question="How is REPRESENT different from quantization?"
				answer="Quantization converts a model into one format and measures afterwards. REPRESENT declares what must be preserved first — a contract over KL divergence, displaced probability mass, and routing consequence at a fixed evidence scale — then treats every format as a candidate and every region independently. The output is not a converted file but an earned topology: BF16 where behaviour demands it, cheaper encodings where evidence permits them, verified as a whole model."
			/>

			<Statement text="The search is real, and its first earned topology is three layers wide." />

			<Observation
				label="THE RECORDED RESULT — STRICT"
				text="Kimi Linear 48B under the frozen kimi-logit-v3 contract. Uniform Q6 at the probed depths: refused. The discovered strict topology keeps layers 0–23 at BF16 and takes layers 24–26 to Q8_0 — earned at 8,192 teacher-forced positions with KL p99 4.153e-4 against a 1e-3 limit, removing 5.1 GB, decoding 2.1–2.8% faster beside its own in-session BF16 baseline. Small on purpose: strict is the fidelity reference profile, and every layer it excludes was excluded by measurement."
			/>

			<TopologyExplorer />

			<Statement text="Individually safe ≠ safe together." />

			<Answer
				id="why-composition-fails"
				question="Why can individually safe quantizations fail when combined?"
				answer="Because a model is not a bag of independent tensors. Each substitution displaces the hidden state; later routing decisions read that displaced state; errors interact through the model's own control flow. Measured on Kimi Linear: three composed maps whose every member passed alone all failed the contract — one super-additively, its composed displacement 1.9× the sum of its members. A per-layer sensitivity table cannot see this. Only measuring the composed model can."
			/>

			<CompositionFigure />

			<Observation
				label="WHY THIS IS NOT A SENSITIVITY SPREADSHEET"
				text="The layer the search left out is the proof. L26's cheapest individually-passing representation was Q6_K — and Q6_K at L26 belongs to no admissible composed map, because it consumes most of the whole behavioural budget by itself. Q8_0 there is seven times cheaper behaviourally and composes nearly free, since no later routed layer exists to amplify it. A recipe built from isolated measurements would have shipped the wrong bytes."
			/>

			<Answer
				id="what-is-a-behavioural-contract"
				question="What is a behavioural fidelity contract?"
				answer="A frozen, versioned gate the candidate must pass — not a vibe, a program. kimi-logit-v3 requires at least 4,096 teacher-forced positions and bounds KL p99, covered probability mass, displaced top-1 and top-10 mass, and routed-mixture movement. It judges consequence, not counts: at authority scale a passing map showed 1,041 top-10 reorderings, almost all near-ties — a count-based gate would have refused a good map, and diagnostic-scale counts were measured too noisy to certify anything. The contract is the authority; the search only proposes."
			/>

			<Statement text="Representation topology isn't limited to experts." />

			<Answer
				id="represent-beyond-experts"
				question="Does REPRESENT only quantize expert weights?"
				answer="No — and this is where the decode economics live. On Kimi Linear, routed experts are 47.4% of decode bytes; the KDA recurrent projections are another 25.4%. Both families are now opened: KDA projections at Q8_0 measured CHEAPER behaviourally than expert weights at the same depth (KL p99 8.8e-5 vs 2.3e-4), because their error enters through a smooth recurrence instead of a discrete routing boundary — and the first cross-family map, experts plus KDA together, passed the full contract at 8,192 positions with the two families' errors composing sub-additively."
			/>

			<LedgerFigure />

			<Evidence
				items={[
					{
						label: "The contract catches what diagnostics cannot — RECORDED · 8,192 POSITIONS",
						status: "SUPPORTED",
						detail:
							"A balanced-bracket candidate that looked benign at 256 positions (two near-tie argmax flips) produced 63 argmax flips at authority scale, the worst surrendering 18% of its answer's probability. Small-sample consequence counts are noise; the contract's evidence-scale floor is what makes 'preserved behaviour' a checkable claim rather than a hope.",
					},
					{
						label: "Depth is a structural signal, in both families — RECORDED",
						status: "SUPPORTED",
						detail:
							"Expert Q8_0 passes from L20 back and collapses toward the front. KDA Q8_0 is nearly free in the late tower, marginal at L16, and refuses by L13 — where a new mechanism appears: displacement accumulating across token distance through the recurrent state. Same contract, different physics per family; the search inherits both maps.",
					},
					{
						label: "The byte ledger is predictive, not aspirational — RECORDED · IN-SESSION BENCH",
						status: "SUPPORTED",
						detail:
							"The earned cross-family map removes ~3.7% of decode traffic and measured 1.036–1.043× decode beside its own same-session BF16 baseline, GPU time 27.2–27.4 → 26.4–26.5 ms/token — the reduction the ledger predicted. Four sessions, two power states, reproduced after a full container re-encode (the strict authority run reproduced to the last digit).",
					},
				]}
			/>

			<Statement text="Search once. Keep the result forever." />

			<Observation
				label="THE SHAPE OF THE SURFACE — A WORKED SHAPE, NOT A RECORDED RUN"
				text="The CLI surface this chapter is heading toward: `vindex represent search model.vindex3 --contract fidelity --objective min-bytes` returning the earned topology with its composed verdict, then `vindex represent save kimi.represent` persisting identity, topology, evidence and benchmark as one durable object. Today the search runs as instrumented harnesses and the artifact is assembled by hand; the object it produces — source identity, contract hash, evidence-bank identity, per-cell verdicts, composition history, benchmark — already exists for the Kimi result. The verbs are being productized in that order."
			/>

			<Observation
				label="ROADMAP — ONE CANONICAL MODEL, MANY EVIDENCE-DERIVED FORMS"
				text="Design direction, not shipped: a REPRESENT result is small enough to publish beside the canonical checkpoint — topology, contract, evidence — with derived physical banks cached content-addressed and shared between profiles that select the same bytes. One canonical model on the Hub; many evidence-derived physical representations materialized on demand; no zoo of hand-named quant files. The exported forms can include stock containers: a discovered per-layer map is expressible as a GGUF recipe, so the optimizer's answer travels beyond this runtime."
			/>

			<Answer
				id="represent-save-reuse"
				question="Can a REPRESENT result be saved and reused?"
				answer="That is the design's centre of gravity: the search is expensive once and amortized forever. The result object carries the source identity, the frozen contract, the evidence-bank identity, every per-cell verdict, the composition history and the benchmark — and it was re-earned unchanged after the canonical container was re-encoded, which is the property that makes it durable model knowledge rather than an experiment log. The packaged .represent artifact and its registry distribution are roadmap; the object's contents are already real."
			/>

			<Answer
				id="represent-gguf-export"
				question="Can REPRESENT export to GGUF?"
				answer="Per-layer and per-projection topologies are expressible in stock GGUF, whose tensors each carry their own type — so a discovered map at that granularity can compile down to a recipe that runs in llama.cpp unmodified. Finer granularity (per-expert, sub-tensor, or representation-times-residency plans) exceeds what stock containers can carry and stays native. Export is roadmap; the granularity analysis is done."
			/>

			<section className="hause-grid py-10">
				<div className="col-span-12 md:col-start-2 md:col-span-9">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase opacity-50 mb-4">
						TRY IT — THE NEIGHBOURING FACTS, IN THE EXPLORER
					</p>
					<div className="flex flex-wrap gap-2">
						{["SHOW PRECISION", "SHOW REPRESENTATIONS", "EXPLAIN REPRESENTATION layer.37.mlp.down"].map((cmd) => (
							<Link
								key={cmd}
								href={`/explorer?run=${encodeURIComponent(cmd)}`}
								className="voice-evidence text-[11px] px-3 py-1.5 border opacity-80 hover:opacity-100"
								style={{ borderColor: "var(--color-accent)" }}
							>
								{cmd} →
							</Link>
						))}
					</div>
				</div>
			</section>

			<Statement text="Quantization is a mechanism. REPRESENT is the optimizer." />

			<Connection
				text="The map the quantization chapter could store and the discovery chapter could not write — this is what writes it: a contract that judges, a search that composes, and evidence that outlives the container it was measured in."
				links={[
					{ href: "/quantization", label: "THE PRECISION MAP — WHAT IT STORES" },
					{ href: "/discovery", label: "WHY CHEAP DISCOVERY FAILED" },
					{ href: "/representation", label: "SELECTION, NOT CONVERSION" },
				]}
			/>
		</main>
	);
}
