import type { Metadata } from "next";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { Observation } from "@chrishayuk/hause/components/forms/Observation";
import { Agreement } from "@chrishayuk/hause/components/forms/Agreement";
import { Derivation } from "@chrishayuk/hause/components/forms/Derivation";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";
import { Film } from "@chrishayuk/hause/components/forms/Film";

export const metadata: Metadata = {
	title: "Model Provenance & Authority: Where AI Model Truth Comes From",
	alternates: { canonical: "/authority" },
	description: "The four-authority invariant and the derived-authority fold — where truth comes from in a VINDEX3 container.",
};

/**
 * The PASS row of the Agreement below is the living spec's own worked
 * example, verbatim. The FAIL row is illustrative in its values but
 * exact in its class: it renders the spec's named identity distinction
 * "NoPE ≠ rope(theta = 0)" — the guess a resolver must not make.
 */
export default function AuthorityPage() {
	return (
		<main>
			<Hero
				kicker="AUTHORITY · LIVING SPEC §7–8 · ABI §9.2"
				title="WHERE TRUTH COMES FROM"
				dek="Four independently-derived views of the same system that must be identical — and a fidelity level a profile can never claim above, only voluntarily below."
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

			<Observation
				label="SAYING SO, PRECISELY"
				text="A container is Canonical or Derived. A derived image cannot recompile itself — and saying so is the difference between an artifact that is missing something and one that never promised it. structurally-approximate is honest the same way: the omission is declared, listed, and folded into what the profile may claim."
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
