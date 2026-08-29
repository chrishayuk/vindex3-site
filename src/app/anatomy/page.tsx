import type { Metadata } from "next";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { Observation } from "@chrishayuk/hause/components/forms/Observation";
import { Anatomy } from "@chrishayuk/hause/components/forms/Anatomy";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";
import { StackFigure, AttentionFigure, FfnFigure, MoeFigure } from "@/components/AnatomyFigures";

export const metadata: Metadata = {
	title: "The Anatomy",
	description:
		"What a model actually contains — attention, gate/up/down, router, expert — so every address in this exhibition reads in plain sight.",
};

/**
 * The bridge chapter: between the Physics (why bytes matter) and the
 * Container (how VINDEX3 holds them) sits the machinery itself. The
 * wound: the exhibition speaks of q_proj and gate_proj as if the
 * reader was ever told what those are. Ten minutes here and the rest
 * of the site — and any checkpoint's tensor listing — reads in plain
 * sight. Numbers stay in the site's worked-example universe: hidden
 * 2,048 · intermediate 6,144 · 32 experts · 24 layers.
 */
export default function AnatomyPage() {
	return (
		<main>
			<Hero
				kicker="THE ANATOMY · BETWEEN THE PHYSICS AND THE CONTAINER"
				title="WHAT A MODEL ACTUALLY CONTAINS"
				dek="The addresses in this exhibition — q_proj, gate_proj, router, expert — name real machinery. This chapter is that machinery, opened, in one worked shape: hidden 2,048 · intermediate 6,144 · 24 layers · 32 experts, top-4. No mathematics required; ten minutes, and the rest of the site reads in plain sight."
			/>

			<Statement text="layer.17.mlp.down_proj reads like a filename — until you know the machine it names." />

			<Observation
				label="WHAT THIS FIXES"
				text="The Physics explained why the bytes are heavy. The Container will explain how VINDEX3 holds them. Between the two sits a vocabulary cliff: gate, up, down, query, key, value, router, expert. A glossary would be documentation debt. Instead: the machine itself, one part at a time, each part ending at the address you will meet again downstairs."
			/>

			<StackFigure />

			<Observation
				label="ATTENTION"
				text="The first thing a layer does is look backwards. For that, every token is given three faces, each made by its own tensor: a query — what am I looking for; a key — what do I contain; a value — what do I return. Queries meet keys, and where they agree, values flow. Hold each part below."
			/>

			<AttentionFigure />

			<Observation
				label="THE FEED-FORWARD NETWORK"
				text="The second thing a layer does is transform what attention gathered — and this is where most of a model's weight lives. The shape of the move is almost physical: make the space bigger, decide what gets through, bring it back home. Step through it."
			/>

			<FfnFigure />

			<Statement text="In the gated-MLP form shown here, an expert is not exotic machinery. It is the same gate, up, and down — kept thirty-two times, chosen four at a time." />

			<Observation
				label="MIXTURE OF EXPERTS"
				text="When models grew, they did not grow one enormous feed-forward network. They grew many ordinary ones — experts — and added a router: a small tensor that reads each token and picks which few experts answer it. Route a token below and watch most of the model stay dark."
			/>

			<MoeFigure />

			<Observation
				label="NORM AND RESIDUAL"
				text="Two quieter parts complete the layer. Norms keep the numbers in a workable range before each move — thermostats, not thinkers. And the residual stream is the discipline that everything is added to a running representation, never overwritten — the reason a layer's contribution can be measured, attributed, or skipped at all."
			/>

			<Statement text="A generic explainer stops here: that was a transformer. VINDEX3 keeps going." />

			<Anatomy
				kicker="ONE ADDRESS, ALL THE WAY DOWN"
				objectLabel="layer.17.mlp.down_proj"
				layers={[
					{
						label: "semantic component",
						note: "the graph",
						detail:
							"A named part of the system graph: layer seventeen's feed-forward compression, bound to its role — not a filename pattern, a judged fact the container carries as data.",
					},
					{
						label: "physical tensor",
						note: "6,144 × 2,048",
						emphasis: true,
						detail: "The grid of numbers you just watched bring the wide space back home — its shape and dtype declared, not inferred.",
					},
					{
						label: "representation",
						note: "exact-q6k · native-mxfp4",
						detail:
							"The physically present encodings of that tensor, side by side. A profile selects one; selecting an absent one fails closed before a byte is read.",
					},
					{
						label: "bytes",
						note: "segment · offset · sha-256",
						muted: true,
						detail:
							"Where the chosen representation actually lives — its segment, its byte range, its payload hash recorded at encode and re-checked at verify.",
					},
				]}
				caption="A weights file stops at 'this is a down projection.' A container continues: its identity, its representations, its byte range, its provenance, the authority selecting it. That descent is the whole format."
			/>

			<Statement text="One vocabulary, linked authorities: every definition on this page renders from the VINDEX knowledge graph — the same records Ask resolves and the Explorer's DESCRIBE joins to. The words cannot drift apart, because there is one set of them." />

			<Connection
				text="You now hold the vocabulary the rest of the exhibition assumes. Next: the file that keeps every one of these parts named, present, and checkable — or open a real one and walk it yourself."
				links={[
					{ href: "/container", label: "ONE DIRECTORY, ONE ROOT" },
					{ href: "/explorer", label: "ENTER A MODEL — THE EXPLORER" },
					{ href: "/graph", label: "THE GRAPH — HOW THE PARTS RELATE" },
				]}
			/>
		</main>
	);
}
