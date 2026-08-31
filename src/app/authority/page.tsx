import type { Metadata } from "next";
import { CiteThis } from "@/components/CiteThis";
import { citeMeta } from "@/data/citation";
import { JsonLd } from "@chrishayuk/hause/components/JsonLd";
import { breadcrumbLd, techArticleLd } from "@chrishayuk/hause/seo";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Answer } from "@chrishayuk/hause/components/forms/Answer";
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { Observation } from "@chrishayuk/hause/components/forms/Observation";
import { Agreement } from "@chrishayuk/hause/components/forms/Agreement";
import { Derivation } from "@chrishayuk/hause/components/forms/Derivation";
import { Lens } from "@chrishayuk/hause/components/forms/Lens";
import { specSection } from "@/data/corpus";
import { SpecClause } from "@/components/SpecClause";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";
import { Film } from "@chrishayuk/hause/components/forms/Film";

export const metadata: Metadata = {
	title: "Model Provenance & Authority: Where AI Model Truth Comes From",
	alternates: { canonical: "/authority" },
	description: "The four-authority invariant and the derived-authority fold — where truth comes from in a VINDEX3 container.",
	// The head surface of this chapter's publication record — citation_* tags,
	// built from the same object the Provenance line and the reference print.
	other: citeMeta("/authority"),
};

/**
 * The PASS row of the Agreement below is the living spec's own worked
 * example, verbatim. The FAIL row is illustrative in its values but
 * exact in its class: it renders the spec's named identity distinction
 * "NoPE ≠ rope(theta = 0)" — the guess a resolver must not make.
 */
/** The clause this chapter's SPEC depth quotes — projected from the corpus, never retyped. */
const SPEC_9_2 = specSection("vindex3-format-spec.md", "9.2");

export default function AuthorityPage() {
	return (
		<main>
			<JsonLd
				data={techArticleLd({
					headline: "Authority",
					description:
						"Where truth comes from: four derived authorities, the fidelity lattice, and verification that re-hashes both ends.",
					url: "https://vindex3.org/authority",
					siteUrl: "https://vindex3.org",
					siteName: "VINDEX3",
					dateModified: "2026-08-30",
					about: ["verification", "model provenance"],
				})}
			/>
			<JsonLd
				data={breadcrumbLd([
					{ name: "VINDEX3", url: "https://vindex3.org" },
					{ name: "Authority", url: "https://vindex3.org/authority" },
				])}
			/>
			<Hero
				kicker="AUTHORITY · LIVING SPEC §7–8 · ABI §9.2"
				title="WHERE TRUTH COMES FROM"
				dek="Four independently-derived views of the same system that must be identical — and a fidelity level a profile can never claim above, only voluntarily below."
			/>

			<Answer
				id="how-is-completeness-known"
				question="How does VINDEX3 know a container is complete and faithful?"
				answer="Four independently derived authorities must agree — what the source declared, what detection resolved, what the graph encodes, and what the container's bytes actually hold — with both ends re-hashed at verify time. Operand closure then proves the executable program is total: every stored tensor maps to an operation, every operation carries judged semantics, and a missing operand is a named refusal. Nothing is asserted; agreement is derived."
			/>

			<Agreement
				kicker="THE FOUR-AUTHORITY INVARIANT — G4"
				columns={[
					{ label: "Declared", source: "what HF said" },
					{ label: "Resolved", source: "what the reader interpreted" },
					{ label: "Graph", source: "the logical system at G2" },
					{ label: "Encoded", source: "what the container contains" },
				]}
				rows={[
					{
						values: [
							"layer_rope_theta[3] = 0",
							"PositionPolicy::None",
							"attention[3].position = none",
							"attention[3].position = none",
						],
						verdict: "PASS",
						note: "The spec's own worked example: a judged semantic, carried intact from source declaration to encoded container.",
					},
					{
						values: [
							"layer_rope_theta[3] = 0",
							"rope(theta = 0)",
							"attention[3].position = rope",
							"attention[3].position = rope",
						],
						verdict: "FAIL",
						note: "The named trap, rendered: NoPE ≠ rope(theta = 0). A resolver that guesses instead of judging breaks Declared ≡ Resolved — and the comparison catches it. (Values illustrative; the distinction is the spec's, load-bearing.)",
					},
				]}
				caption="Verification re-hashes both ends. Recomputed source, recomputed encoded, recorded — all three must agree. A drifted checkpoint therefore fails differently (source ≠ recorded) from a corrupted container (encoded ≠ recorded). And the tensor table is compared entry by entry, because a relabelled dtype or shape over identical bytes is invisible to every hash in the container."
			/>

			<Statement text="Authority is derived, never asserted." />

			<Lens
				kicker="THE FOLD — THREE DEPTHS"
				concept="Authority"
				caption="What a profile may claim is folded down a graded lattice by caps — never declared. Read it, work it, or read the clause that governs it."
				depths={[
					{
						id: "learn",
						label: "LEARN",
						hint: "what a claim is worth",
						content: (
							<Observation
								label="SAYING SO, PRECISELY"
								text="A container is Canonical or Derived. A derived image cannot recompile itself — and saying so is the difference between an artifact that is missing something and one that never promised it. structurally-approximate is honest the same way: the omission is declared, listed, and folded into what the profile may claim."
							/>
						),
					},
					{
						id: "inspect",
						label: "INSPECT",
						hint: "the fold, worked",
						content: (
							<Derivation
								kicker="THE FOLD — WORKED FOR A shared-only PROFILE"
								lattice={[
									{ level: "source-exact", meaning: "Decoded values bit-identical to the source checkpoint, in the checkpoint's own encoding family." },
									{ level: "source-equivalent", meaning: "A different encoding whose decode reproduces the source values exactly." },
									{ level: "numerically-approximate", meaning: "Same architecture, lossy representation — Q6_K quantised from BF16." },
									{ level: "structurally-approximate", meaning: "Components omitted or replaced — must list omitted_components / replacement." },
									{ level: "analysis-only", meaning: "Incapable of complete forward execution — router and browse slices." },
								]}
								steps={[
									{
										label: "Weakest selected region fidelity: the selected Q6_K regions are lossy against their BF16 source.",
										from: "source-exact",
										to: "numerically-approximate",
									},
									{
										label: "Declared structural omission: the shared-only profile omits the routed expert banks.",
										from: "numerically-approximate",
										to: "structurally-approximate",
									},
								]}
								result="structurally-approximate"
								caption="A profile cannot claim above its derived level; it may voluntarily claim below it. Kernel maturity affects speed and support status — never fidelity."
							/>
						),
					},
					{
						id: "spec",
						label: "SPEC",
						hint: "the clause that governs it",
						content: <SpecClause quotes={[SPEC_9_2]} />,
					},
				]}
			/>

			<Observation
				label="AND YET — CONSISTENCY IS NOT SUFFICIENCY"
				text="Four honest witnesses can still tell an incomplete story: all four authorities can faithfully agree on an under-specified system. That is why agreement is only half the proof. The other half is closure — every stored tensor accounted for by an operation, every operation by judged semantics — and it lives in the execution chapter, where the two halves finally lock."
			/>

			<Film
				title="The fold"
				description="Fidelity pushed down the lattice, one judged cap at a time, until the level a profile may claim is derived — never asserted."
				src="/films/the-fold.mp4"
				poster="/films/the-fold-poster.jpg"
			/>

			<Connection
				text="Agreement proves the story is consistent. Execution proves it is complete."
				links={[
					{ href: "/execution", label: "FROM DESCRIPTION TO COMPUTATION" },
					{ href: "/ladder", label: "THE RECORD" },
				]}
			/>

			<CiteThis slug="/authority" />

			<section className="hause-grid pb-32 pt-8 border-t" style={{ borderColor: "var(--color-mist)" }}>
				<div className="col-span-12">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase opacity-50 mb-4">SOURCES</p>
					<ul className="voice-evidence text-sm opacity-60 flex flex-col gap-1">
						<li>vindex3-format.md §1.2, §7–8 (the living spec)</li>
						<li>vindex3-format-spec.md §9.2 (the 3.0 Candidate)</li>
						<li>reference implementation — capability/authority.rs</li>
					</ul>
				</div>
			</section>
		</main>
	);
}
