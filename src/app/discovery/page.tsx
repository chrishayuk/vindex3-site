import type { Metadata } from "next";
import { CiteThis } from "@/components/CiteThis";
import { citeMeta } from "@/data/citation";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { Observation } from "@chrishayuk/hause/components/forms/Observation";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";
import { Answer } from "@chrishayuk/hause/components/forms/Answer";
import { JsonLd } from "@chrishayuk/hause/components/JsonLd";
import { breadcrumbLd, techArticleLd } from "@chrishayuk/hause/seo";
import { TheBar, ScreenLadder, CounterexampleFigure, ResidualWhyFigure } from "@/components/DiscoveryFigures";

export const metadata: Metadata = {
	title: "Why Automatic LLM Quantization Fails: Four Sensitivity Screens",
	alternates: { canonical: "/discovery" },
	description:
		"Four attempts to automatically discover which LLM tensors deserve higher precision — weight error, activation-weighted error, local consequence, downstream replay — and why each failed, measured against ground truth.",
	// The head surface of this chapter's publication record — citation_* tags,
	// built from the same object the Provenance line and the reference print.
	other: citeMeta("/discovery"),
};

/**
 * The case study the Quantization chapter hands into: we can store a
 * precision map — but who writes it? Four recorded attempts at
 * automatic discovery, each killed by measurement, and the structural
 * reason a local score cannot work. The programme's status lives on
 * the Record.
 */
export default function DiscoveryPage() {
	return (
		<main>
			<JsonLd
				data={techArticleLd({
					headline: "Why Automatic LLM Quantization Fails: Four Sensitivity Screens",
					description:
						"Four attempts to automatically discover which LLM tensors deserve higher precision, and why each failed against measured ground truth.",
					url: "https://vindex3.org/discovery",
					siteUrl: "https://vindex3.org",
					siteName: "VINDEX3",
					dateModified: "2026-08-30",
					about: ["quantization sensitivity", "precision map", "residual stream", "mixed precision"],
				})}
			/>
			<JsonLd
				data={breadcrumbLd([
					{ name: "VINDEX3", url: "https://vindex3.org" },
					{ name: "Quantization", url: "https://vindex3.org/quantization" },
					{ name: "Discovering the Map", url: "https://vindex3.org/discovery" },
				])}
			/>
			<Hero
				kicker="DISCOVERING THE MAP · SENSITIVITY-1A/1B/1B′/1C · RECORDED · GRANITE-4.1-3B"
				title="WE CAN STORE A PRECISION MAP. BUT WHO WRITES IT?"
				dek="The quantization chapter ends at the map — representation decisions over components, held to evidence. This is the harder question underneath it: can anything cheap discover those decisions automatically? Four attempts, each measured against ground truth. Four instructive failures."
			/>

			<Answer
				id="why-no-auto-discovery"
				question="Why can't we automatically build the precision map yet?"
				answer="Because every cheap signal tried so far measures the wrong thing. Weight error alone carries no semantic signal — a fixed relative grid makes every tensor's error nearly identical. Normalised activation error rewards small outputs. Absolute local consequence almost works, but confidently protects down_proj — the one tensor where protection measurably makes quality worse — because a local score cannot see where an error lands in the computation. And replaying errors through the remaining layers costs five times more than just measuring the truth."
				cite="recorded — granite-4.1-3b · the SENSITIVITY programme vs the banked Q-BANK sweep"
			/>

			<Observation
				label="THE GROUND TRUTH, AND ITS PRICE"
				text="The bank measures a candidate the honest way: compile it, run it, compare probability distributions position by position. About one minute fifty-one per candidate on the 3B model — fine for fifteen candidates, hopeless for the real problem, which is combinatorial: every projection at every depth. So the question became: can something cheap rank candidates the way the bank ranks them? Before any screen produced a number, the bar was frozen."
			/>

			<TheBar />

			<Statement text="Four screens walked at that bar. Here is how each one scored." />

			<ScreenLadder />

			<Statement text="The third screen is the interesting one — right form, one devastating counterexample." />

			<CounterexampleFigure />

			<ResidualWhyFigure />

			<Statement text="Local consequence measures where the error is large — not whether the output is sensitive to it." />

			<Observation
				label="THE FRONTIER — OPEN, AND MARKED AS SUCH"
				text="One route remains that survives the analysis. Against a KL metric, first-order sensitivity is identically zero — a divergence is stationary at its own reference — so the leading term is second-order curvature. That sounds expensive, but the curvature matrix factors exactly: draw a random vector, shape it by the model's own output probabilities, push it backwards through the network once, and sensitivity arrives at every layer boundary simultaneously. The catch: it needs reverse-mode execution the reference implementation does not have. That is a research programme, not a feature — and it is filed on the Record as exactly that: candidate, not built."
			/>

			<Statement text="Measurements can justify a precision map. VINDEX3 can express, compile and execute that map. Cheap surrogates cannot write it — what writes it is a search that pays for real composed measurements." />

			<Connection
				text="The sequel exists: REPRESENT abandons the cheap-surrogate hope this page falsified and searches with real evidence under a frozen behavioural contract — judging composed maps, because the composed model is the only honest judge. Its first earned topology is on the Record."
				links={[
					{ href: "/represent", label: "REPRESENT — THE SEARCH THAT WORKS" },
					{ href: "/quantization", label: "QUANTIZATION — THE MAP ITSELF" },
					{ href: "/ladder", label: "THE RECORD — THE PROGRAMME'S STATUS" },
				]}
			/>

			<CiteThis slug="/discovery" />
		</main>
	);
}
