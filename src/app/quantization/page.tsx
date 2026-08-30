import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { Observation } from "@chrishayuk/hause/components/forms/Observation";
import { Decomposition } from "@chrishayuk/hause/components/forms/Decomposition";
import { Evidence } from "@chrishayuk/hause/components/forms/Evidence";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";
import { Answer } from "@chrishayuk/hause/components/forms/Answer";
import { JsonLd } from "@chrishayuk/hause/components/JsonLd";
import { breadcrumbLd, techArticleLd } from "@chrishayuk/hause/seo";
import {
	TensorOpen,
	RepresentationSwitcher,
	BitsArithmetic,
	CollapseFigure,
	PrecisionMapFigure,
	DistributionFigure,
} from "@/components/QuantizationFigures";

export const metadata: Metadata = {
	title: "LLM Quantization Explained: 4-Bit, NVFP4 & Precision Maps",
	alternates: { canonical: "/quantization" },
	description:
		"Understand how LLM quantization actually works: BF16, NVFP4, shared scales, effective bits per weight, mixed precision, precision maps and measured quality — on one real tensor.",
};

/**
 * The precision chapter: between the Anatomy (what the weights do) and
 * the Container/Representation arc (how choices are preserved). Every
 * number is a recorded run against granite-4.1-3b from the banked
 * quality records — the same runs the quantization film performs.
 * Model-specific results are labelled as exactly that.
 */
export default async function QuantizationPage({
	searchParams,
}: {
	searchParams: Promise<{ model?: string }>;
}) {
	const { model } = await searchParams;
	const unknownModel = model && model !== "granite-4.1-3b" ? model : null;
	return (
		<main>
			{unknownModel && (
				<section className="hause-grid pt-6">
					<div
						className="col-span-12 md:col-start-2 md:col-span-9 border p-4"
						style={{ borderColor: "var(--color-status-refuted)" }}
					>
						<p className="voice-evidence text-xs m-0" style={{ color: "var(--color-status-refuted)" }}>
							NO RECORDED RUNS FOR “{unknownModel}” YET
						</p>
						<p className="voice-system text-sm opacity-80 m-0 mt-2 leading-relaxed">
							This chapter refuses to dress another model&apos;s numbers in that name. Every figure below is a
							recorded run against granite-4.1-3b, and is labelled as exactly that. When {unknownModel}&apos;s
							runs are banked, this page will speak them.
						</p>
					</div>
				</section>
			)}
			<JsonLd
				data={techArticleLd({
					headline: "LLM Quantization Explained: 4-Bit, NVFP4 & Precision Maps",
					description:
						"How LLM quantization actually works: BF16, NVFP4, shared scales, effective bits per weight, mixed precision, precision maps and measured quality — on one real tensor.",
					url: "https://vindex3.org/quantization",
					siteUrl: "https://vindex3.org",
					siteName: "VINDEX3",
					dateModified: "2026-08-30",
					about: ["LLM quantization", "NVFP4", "mixed precision", "precision map", "BF16"],
				})}
			/>
			<JsonLd
				data={breadcrumbLd([
					{ name: "VINDEX3", url: "https://vindex3.org" },
					{ name: "Quantization", url: "https://vindex3.org/quantization" },
				])}
			/>
			<Hero
				kicker="QUANTIZATION · RECORDED RUNS · GRANITE-4.1-3B"
				title="HOW MANY BITS DOES A MODEL NEED?"
				dek="Everyone says four. The honest answers are four and a half, five point six five, and it depends which tensor you are asking about — because precision is a property of components, not a label attached to a model."
			/>

			<Answer
				id="what-is-llm-quantization"
				question="What is LLM quantization?"
				answer="LLM quantization reduces the precision used to store model weights, trading model size and memory bandwidth for numerical error. A “4-bit model” does not necessarily use exactly four bits per weight: formats such as NVFP4 also store scales, and mixed-precision models preserve selected tensors at higher precision. The rest of this chapter walks those mechanics on one real tensor."
			/>

			<Statement text="“This is a 4-bit model” is an incomplete sentence." />

			<Observation
				label="WHAT THIS FIXES"
				text="Quantization gets described as a dial: sixteen bits in, four bits out, model four times smaller, done. But the scales are never free, the information loss is deliberate and permanent, the right precision differs per component — and the same policy that behaves beautifully on one model degrades badly on another. This chapter walks the real mechanics on one real tensor, and ends at the object that replaces the dial: the precision map."
			/>

			<TensorOpen />

			<Observation
				label="SELECTION, NOT CONVERSION"
				text="The identity below never changes — layer.0.mlp.down_proj is the same semantic component in every representation. What changes is physical: the encoding, the grouping, the scales, the error, the effective bits. Switch and watch the values snap onto a different grid."
			/>

			<RepresentationSwitcher />

			<Statement text="“Four bits” is the width of the code, not the cost of the weight." />

			<Answer
				id="why-4-bit-is-not-4-bits"
				question="Why isn't a 4-bit model always 4 bits?"
				answer="Because the metadata is never free. In NVFP4, sixteen weights share one eight-bit scale and each weight spends four bits choosing a slot on it: 64 code bits plus 8 scale bits is 72 bits per sixteen weights — 4.5 effective bits each. Schemes with zero points or block minima pay similar costs. “Four bits” names the code width; the storage cost is always higher."
				cite="derived — 16 × 4-bit codes + one 8-bit E4M3 scale"
			/>

			<BitsArithmetic />

			<Statement text="This is lossy compression — unlike ZIP, there is no way back to the original values." />

			<CollapseFigure />

			<Answer
				id="quantization-format-taxonomy"
				question="What's the difference between a numeric format, a scheme, a method, and a container?"
				answer="They are four different decisions the phrase “quantization format” routinely blurs. A numeric format is the alphabet a weight is written in — BF16, NVFP4, NF4. A scheme is how weights share metadata — Q4_K's blocks and superblocks, group sizes, zero points. A method is how the codes are chosen — GPTQ and AWQ live here. A container is where representations live and what is recorded about them. And execution is the kernels that finally run the chosen bytes. The exhibit below names each layer in place."
			/>

			<Decomposition
				kicker="ONE WORD, FIVE LAYERS — WHAT “QUANTIZATION FORMAT” CONFLATES"
				source={{ label: "“a 4-bit model”", detail: "One phrase, carrying five different decisions that the ecosystem routinely blurs together." }}
				parts={[
					{ label: "NUMERIC FORMAT", detail: "The alphabet a weight is written in — BF16, FP8, NVFP4, INT8. NF4 lives here too: a 4-bit code table, not a scheme." },
					{ label: "SCHEME", detail: "How weights share metadata — group size, scales, zero points, per-channel vs per-group, block layout. Q4_K lives here: blocks and superblocks, not a numeric format." },
					{ label: "METHOD", detail: "How the codes are chosen — calibration and optimisation strategies. GPTQ and AWQ live here: ways of picking codes, not ways of storing them." },
					{ label: "CONTAINER", detail: "Where representations live and what is recorded about them. GGUF and safetensors live here — and so does this site's subject, which adds the representation authority the others leave implicit." },
					{ label: "EXECUTION", detail: "The kernels that decode and run the chosen bytes on real hardware." },
				]}
				result={{
					label: "the VINDEX3 chain",
					detail: "component → represented as → representation → encoded using → numeric format → selected by → execution authority. Each layer named, none conflated.",
				}}
			/>

			<Statement text="The object that replaces the dial: the precision map." />

			<Answer
				id="what-is-a-precision-map"
				question="What is a precision map?"
				answer="A precision map is a compiled policy that assigns a physical representation to each semantic component of a model — this tensor at NVFP4, that layer's projections at BF16 — chosen from measurements rather than intuition, and carried by the artifact itself. It replaces the single model-wide dial with a program: precision becomes a property of components, held to recorded evidence."
				cite="recorded — granite-4.1-3b · uniform 4.5 ↔ mixed 5.65 effective bits/weight"
			/>

			<PrecisionMapFigure />

			<Observation
				label="NEVER JUDGE BY THE TOKEN"
				text="How do you know a representation is good? Not by the answer it prints. Below is a deliberately broken image — a ×100 scaling error in the output head — that produces the same text as the reference at every position, while its probability distribution is destroyed."
			/>

			<DistributionFigure />

			<Evidence
				items={[
					{
						label: "The same policy is not the same outcome — RECORDED · GRANITE vs GLIMMER",
						status: "SUPPORTED",
						detail:
							"One command, two models: muse-glimmer-30b degrades gently under uniform NVFP4 (KL mean 0.0312 bits, p99 0.2490) while granite-4.1-3b degrades nine times worse on average and nineteen times worse in the tail (0.2778, p99 4.6224). Representation fidelity is model-specific evidence, never a property inferred from the format name.",
					},
					{
						label: "Protecting the obvious tensor can make things worse — RECORDED · GRANITE 4.1 3B",
						status: "SUPPORTED",
						detail:
							"Keeping every down_proj at BF16 costs over a gigabyte and moves the tail from 4.6224 to 4.8010 — worse. Keeping the last five FFN layers costs 431 MiB and moves it to 1.2826 — 3.5× better. Measurements can justify a precision map, and VINDEX3 can express, compile and execute it. Automatically discovering the right map remains open — see Discovering the Map.",
					},
					{
						label: "The file's precision map wins over the backend's request — RECORDED · GRANITE 4.1 3B",
						status: "SUPPORTED",
						detail:
							"Ask for the all-NVFP4 backend against the mixed image and sixteen tensors run at higher precision anyway, because the pack says so. A compiled artifact, not a runtime option: ~104 tok/s against uniform's ~116, four hundred megabytes more, 3.5× better in the tail. Three axes, not one.",
					},
				]}
			/>

			<section className="hause-grid py-10">
				<div className="col-span-12 md:col-start-2 md:col-span-9">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase opacity-50 mb-4">
						TRY IT — THE SAME FACTS, IN THE EXPLORER
					</p>
					<div className="flex flex-wrap gap-2">
						{["SHOW PRECISION", "EXPLAIN REPRESENTATION layer.37.mlp.down", "DIFF BF16 NVFP4 layer.0.mlp.down", "SHOW REPRESENTATIONS"].map((cmd) => (
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

			<Statement text="Quantization is not a model-wide label. It is a representation decision over semantic components, supported by evidence." />

			<Statement text="One question remains under all of it: we can store a precision map — but who writes it?" />

			<Connection
				text="What keeps those decisions honest for the life of the artifact — variants beside their original, fidelity recorded, selection failing closed — is the representation model. And whether the decisions were good answers to the Record."
				links={[
					{ href: "/discovery", label: "DISCOVERING THE MAP — WHO WRITES IT?" },
					{ href: "/representation", label: "SELECTION, NOT CONVERSION" },
					{ href: "/ladder", label: "THE RECORD" },
				]}
			/>
		</main>
	);
}
