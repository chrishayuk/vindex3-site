import type { Metadata } from "next";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { Observation } from "@chrishayuk/hause/components/forms/Observation";
import { Anatomy } from "@chrishayuk/hause/components/forms/Anatomy";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";
import { StackFigure, AttentionFigure, FfnFigure, MoeFigure } from "@/components/AnatomyFigures";
import { Answer } from "@chrishayuk/hause/components/forms/Answer";
import { JsonLd } from "@chrishayuk/hause/components/JsonLd";
import { breadcrumbLd, techArticleLd } from "@chrishayuk/hause/seo";

export const metadata: Metadata = {
	title: "LLM Anatomy: QKV, Gate/Up/Down & MoE Experts",
	alternates: { canonical: "/anatomy" },
	description:
		"Explore the anatomy of an LLM layer: query, key, value, gate, up and down projections, residual streams, MoE experts and routers — interactively, from a live knowledge graph.",
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
			<JsonLd
				data={techArticleLd({
					headline: "LLM Anatomy: QKV, Gate/Up/Down & MoE Experts",
					description:
						"The anatomy of an LLM layer: query, key, value, gate, up and down projections, residual streams, MoE experts and routers — every definition from a live knowledge graph.",
					url: "https://vindex3.org/anatomy",
					siteUrl: "https://vindex3.org",
					siteName: "VINDEX3",
					dateModified: "2026-08-30",
					about: ["transformer architecture", "attention QKV", "gated MLP", "mixture of experts", "residual stream"],
				})}
			/>
			<JsonLd
				data={breadcrumbLd([
					{ name: "VINDEX3", url: "https://vindex3.org" },
					{ name: "Anatomy", url: "https://vindex3.org/anatomy" },
				])}
			/>
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

			<Answer
				id="query-key-value"
				question="What are Q, K and V in a transformer?"
				answer="Query, key and value are three projections of the same token, each made by its own weight tensor. The query says what a token is looking for; the key says what it contains; the value is what it hands over. Queries are compared against every earlier key, and wherever they agree, that token's value flows forward — that comparison is attention."
			/>

			<AttentionFigure />

			<Observation
				label="THE FEED-FORWARD NETWORK"
				text="The second thing a layer does is transform what attention gathered — and this is where most of a model's weight lives. The shape of the move is almost physical: make the space bigger, decide what gets through, bring it back home. Step through it."
			/>

			<Answer
				id="gate-up-down"
				question="What do gate_proj, up_proj and down_proj do?"
				answer="In a gated MLP, up_proj widens a token's representation into a larger space, gate_proj decides — value by value — how much of that widened signal passes, and down_proj brings the result back to the model's hidden size before it rejoins the residual stream. Most of a model's weight lives in these three tensors, repeated per layer."
			/>

			<FfnFigure />

			<Statement text="In the gated-MLP form shown here, an expert is not exotic machinery. It is the same gate, up, and down — kept thirty-two times, chosen four at a time." />

			<Observation
				label="MIXTURE OF EXPERTS"
				text="When models grew, they did not grow one enormous feed-forward network. They grew many ordinary ones — experts — and added a router: a small tensor that reads each token and picks which few experts answer it. Route a token below and watch most of the model stay dark."
			/>

			<Answer
				id="mixture-of-experts"
				question="What is a Mixture-of-Experts router?"
				answer="An MoE model keeps many ordinary feed-forward networks — experts — and a router: a small tensor that reads each token and scores every expert, activating only the top few. Most of the model stays dark on any given token, which is how parameter count grows without the per-token compute growing with it. The router's scores decide everything, so its precision matters more than its size."
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

			<Statement text="Every definition on this page comes from the VINDEX knowledge graph — the same entries Ask answers from, the same entries the Explorer's DESCRIBE reaches. Three surfaces, one vocabulary." />

			<Connection
				text="You now hold the vocabulary the rest of the exhibition assumes. Next: the file that keeps every one of these parts named, present, and checkable — or open a real one and walk it yourself."
				links={[
					{ href: "/quantization", label: "QUANTIZATION — HOW MANY BITS DO THESE WEIGHTS NEED?" },
					{ href: "/container", label: "ONE DIRECTORY, ONE ROOT" },
					{ href: "/explorer", label: "ENTER A MODEL — THE EXPLORER" },
				]}
			/>
		</main>
	);
}
