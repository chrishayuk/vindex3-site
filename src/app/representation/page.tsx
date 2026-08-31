import type { Metadata } from "next";
import { CiteThis } from "@/components/CiteThis";
import { citeMeta } from "@/data/citation";
import { JsonLd } from "@chrishayuk/hause/components/JsonLd";
import { breadcrumbLd, techArticleLd } from "@chrishayuk/hause/seo";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Answer } from "@chrishayuk/hause/components/forms/Answer";
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { Observation } from "@chrishayuk/hause/components/forms/Observation";
import { Variants } from "@chrishayuk/hause/components/forms/Variants";
import { Ladder } from "@chrishayuk/hause/components/forms/Ladder";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";
import { Film } from "@chrishayuk/hause/components/forms/Film";

export const metadata: Metadata = {
	title: "LLM Weight Representations & Mixed Precision Explained",
	alternates: { canonical: "/representation" },
	description: "Region-set variants, the eligibility policy, and the promotion ladder — selection, not conversion.",
	// The head surface of this chapter's publication record — citation_* tags,
	// built from the same object the Provenance line and the reference print.
	other: citeMeta("/representation"),
};

/**
 * The signature exhibit. Everything below is lifted from the ABI spec
 * §9.1–9.2 and the represent/ reference module — the region-set example
 * is the spec's own JSON example, the refusal fields are the ones the
 * spec promises, and the eligibility table is quoted policy.
 */
export default function RepresentationPage() {
	return (
		<main>
			<JsonLd
				data={techArticleLd({
					headline: "Representation",
					description:
						"Selection, not conversion: multiple physical representations catalogued beside the original, chosen by profile.",
					url: "https://vindex3.org/representation",
					siteUrl: "https://vindex3.org",
					siteName: "VINDEX3",
					dateModified: "2026-08-30",
					about: ["mixed precision", "quantization"],
				})}
			/>
			<JsonLd
				data={breadcrumbLd([
					{ name: "VINDEX3", url: "https://vindex3.org" },
					{ name: "Representation", url: "https://vindex3.org/representation" },
				])}
			/>
			<Hero
				kicker="REPRESENTATION · VINDEX3 ABI §9.1–9.2"
				title="SELECTION, NOT CONVERSION"
				dek="A region set may carry multiple physically present variants. A profile selects a present variant. That is the only legal representation model — a profile saying a format cannot conjure bytes into it."
			/>

			<Answer
				id="what-is-a-representation"
				question="What is a VINDEX3 representation?"
				answer="A representation is a physical encoding of a logical model object. One object — target.decoder_stack, an expert bank — can carry several representations with different precision, storage and execution characteristics, catalogued beside the original with fidelity recorded against the source. Its semantic identity never changes with the encoding: a profile selects among physically present variants, and can never request bytes that were not extracted."
			/>

			<Answer
				id="what-is-mixed-precision"
				question="What is mixed-precision quantization?"
				answer="Mixed precision keeps different parts of a model at different numerical precisions — sensitive tensors at BF16, tolerant ones at four-bit — instead of forcing one width on everything. In VINDEX3 that decision is a compiled precision map carried by the artifact: each semantic component is bound to a physically present representation, selection fails closed if the bytes are absent, and the choices answer to recorded quality evidence."
			/>

			<Statement text="No runtime conversion, ever. The bytes executed are the bytes stored." />

			<Observation
				label="WHAT THIS FIXES"
				text="Quantization used to be a fork: a second file with no lineage, whose claim to be the model was a filename. And the word exact was free — name a lossy copy the baseline, and nothing was left to contradict it. Here, every copy lives beside its original as a named variant, and what each one is worth — its fidelity — is recorded against the source at extraction: derived, never asserted. The loophole where lossy becomes exact by promotion is closed by construction."
			/>

			<Variants
				kicker="REGION SET — layer.12.routed.gate_up"
				objectLabel="The identity never changes. The physical form is chosen."
				variants={[
					{
						id: "exact-q6k",
						fidelity: "source-equivalent",
						storage: "routed/layer_012.q6k",
						present: true,
						scale: 1,
						density: 7,
					},
					{
						id: "native-mxfp4",
						fidelity: "source-exact",
						storage: "routed/layer_012.mxfp4",
						present: true,
						scale: 0.72,
						density: 4,
					},
					{
						id: "native-nvfp4",
						fidelity: "—",
						present: false,
					},
				]}
				baseline="exact-q6k"
				refusalTitle="SELECTION FAILS CLOSED — BEFORE ANY BYTE IS READ"
				refusalPrinciple="Ambiguity is refused, never guessed."
				caption="Single-copy forbids storing the same bytes twice — not deliberate alternative encodings. Multiple variants of one region set are the format working as designed."
			/>

			<section className="hause-grid py-16 sm:py-24">
				<div className="col-span-12 md:col-start-2 md:col-span-10 lg:col-span-9">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-8 opacity-50">
						THE WIRE SHAPE — A REGION SET IN index.json, VERBATIM FROM ABI §9.1
					</p>
					<pre
						className="voice-evidence text-xs sm:text-sm leading-relaxed whitespace-pre overflow-x-auto m-0 border px-5 py-4 sm:px-7 sm:py-6"
						style={{ borderColor: "var(--color-mist)" }}
					>
						{`{
  "region_set": "layer.12.routed.gate_up",
  "variants": {
    "exact-q6k":    { "storage": "routed/layer_012.q6k",    "fidelity": "source-equivalent" },
    "native-mxfp4": { "storage": "routed/layer_012.mxfp4",  "fidelity": "source-exact" }
  },
  "baseline": "exact-q6k"
}`}
					</pre>
					<p className="voice-system text-sm opacity-70 leading-relaxed max-w-2xl mt-6">
						A profile selects a variant per region set by name; the baseline is what loads when no profile
						chooses. New variants arrive as incremental packs — independent, checksummed segment files beside the
						baseline, untouched segments hard-linked rather than rewritten — so adding a representation costs the
						pack&apos;s bytes, not the container&apos;s.
					</p>
				</div>
			</section>

			<Observation
				label="ELIGIBILITY — SEMANTIC, NOT SHAPE-BASED"
				text="Decoder linear weights and expert weights are eligible for representation — the prize at MoE scale. Embeddings, output heads, norms, routers, small vectors, whole auxiliary components, and anything unrecognised are preserved at source precision. Fail safe, never fail small."
			/>

			<Observation
				label="PRECISION MAPS — STRUCTURAL, NOT ENUMERATED"
				text="A precision map is a compiled program: a default encoding, role-based eligibility, and exceptions matched in declaration order — first match decides. It is a policy, not a transcript of a particular model. The same four-line map compiles against a 416-tensor stack and a 280-tensor one."
			/>

			<Ladder
				kicker="PROMOTION — ONLY promote() WRITES A SELECTED_REPRESENTATION EDGE"
				rungs={[
					{ id: "represented", question: "The pack exists — bytes are on disk in the target encoding." },
					{ id: "available", question: "The container catalogues the variant; a profile could name it." },
					{ id: "runnable", question: "A backend proves it can execute the format the map chose." },
					{ id: "dispatched", question: "Real kernels actually run it — not a decode-and-fall-back path." },
					{ id: "measured", question: "Quality evidence exists against a versioned gate, natively measured." },
					{ id: "selected", question: "promote() writes the edge. Everything before this is capability." },
				]}
				caption="A backend supporting a format is capability, never authority. Promotion requires measured evidence against a versioned quality gate — and routing evidence is deliberately kept apart from logit evidence. Refusals on this ladder are typed, from QualityUnproven to ConflictingCandidates."
			/>


			<Film
				title="Selection, not conversion"
				description="One identity, three prints: the baseline holds, a variant is chosen, the choice returns — and then the absent print is asked for, and the refusal lands, before any byte is read."
				src="/films/selection-not-conversion.mp4"
				poster="/films/selection-not-conversion-poster.jpg"
			/>

			<Connection
				text="Fidelity names what a variant is worth. What a whole profile may claim is derived from it — by a fold, not a declaration."
				links={[{ href: "/authority", label: "WHERE TRUTH COMES FROM" }]}
			/>

			<CiteThis slug="/representation" />

			<section className="hause-grid pb-32 pt-8 border-t" style={{ borderColor: "var(--color-mist)" }}>
				<div className="col-span-12">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase opacity-50 mb-4">SOURCES</p>
					<ul className="voice-evidence text-sm opacity-60 flex flex-col gap-1">
						<li>vindex3-format-spec.md §9.1–9.2 (the 3.0 Candidate)</li>
						<li>reference implementation — represent/map.rs · policy.rs · selection.rs</li>
					</ul>
				</div>
			</section>
		</main>
	);
}
