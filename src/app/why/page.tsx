import type { Metadata } from "next";
import { CiteThis } from "@/components/CiteThis";
import { citeMeta } from "@/data/citation";
import { JsonLd } from "@chrishayuk/hause/components/JsonLd";
import { breadcrumbLd, techArticleLd } from "@chrishayuk/hause/seo";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Answer } from "@chrishayuk/hause/components/forms/Answer";
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { Observation } from "@chrishayuk/hause/components/forms/Observation";
import { ExpertField } from "@chrishayuk/hause/components/forms/ExpertField";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";
import { Procession } from "@chrishayuk/hause/components/forms/Procession";
import { Magnitude } from "@chrishayuk/hause/components/forms/Magnitude";
import { Channel } from "@chrishayuk/hause/components/forms/Channel";
import { Quantisation } from "@chrishayuk/hause/components/forms/Quantisation";
import { TensorFigure } from "@/components/PhysicsFigures";

export const metadata: Metadata = {
	title: "Why LLM Inference Is Bandwidth-Bound: The Physics",
	alternates: { canonical: "/why" },
	description: "What a model is made of, why it is hard to move, and why the file format is where the battle is actually fought.",
	// The head surface of this chapter's publication record — citation_* tags,
	// built from the same object the Provenance line and the reference print.
	other: citeMeta("/why"),
};

/**
 * The foundations layer, in exhibition rhythm: teach in system voice,
 * proclaim the turn in editorial voice. Numbers are real — the byte
 * floor and per-token byte counts come from the project's measured
 * ledgers, accounted for on The Record; the arithmetic is arithmetic.
 */
export default function WhyPage() {
	return (
		<main>
			<JsonLd
				data={techArticleLd({
					headline: "The Physics",
					description:
						"What a model is made of, why it is hard to move, and why the file format is where serving speed is decided.",
					url: "https://vindex3.org/why",
					siteUrl: "https://vindex3.org",
					siteName: "VINDEX3",
					dateModified: "2026-08-30",
					about: ["memory bandwidth", "quantization", "LLM inference"],
				})}
			/>
			<JsonLd
				data={breadcrumbLd([
					{ name: "VINDEX3", url: "https://vindex3.org" },
					{ name: "The Physics", url: "https://vindex3.org/why" },
				])}
			/>
			<Hero
				kicker="FIRST PRINCIPLES · WHY A FILE FORMAT MATTERS"
				title="THE PHYSICS"
				dek="What a model is made of, why it is hard to move, and why the file format — of all things — is where the battle is actually fought."
			/>

			<Answer
				id="why-does-the-format-matter"
				question="Why does a model file format decide serving speed?"
				answer="Because decode is bandwidth-bound: every generated token re-reads the working set, so tokens per second is effectively memory bandwidth divided by bytes touched per token. The format decides those bytes — which representation is read, which experts are resident, what precision each role carries. That is why representation is a serving lever worth keeping adjustable, and why VINDEX3 stores variants beside the original instead of sealing one choice at conversion."
			/>

			<Observation
				label="TENSORS"
				text="Open a model and there is no code inside. There are tensors: rectangular grids of numbers, learned during training. Everything the model knows — every fact, every habit of speech — is held in how those numbers relate."
			/>

			<TensorFigure />

			<Observation
				label="LAYERS"
				text="The tensors are organised into layers, and the layers into a stack. To produce one word, your text becomes a vector and passes through every layer in order — each one reads it, consults its tensors, and adds its contribution back. Dozens of layers, for every single token."
			/>

			<Procession
				stages={["layer 0", "layer 1", "layer 2", "layer 3", "layer 4", "layer 5"]}
				caption="one token — every layer, in order, every time"
			/>

			<Observation
				label="SIZE"
				text="Now the arithmetic. Twenty billion parameters at two bytes each is forty gigabytes. The largest mixture-of-experts models reach trillions. A model ships as a stack of multi-gigabyte files — and what those files look like inside stops being a detail."
			/>

			<Magnitude
				items={[
					{ label: "a song", sub: "4 MB", magnitude: 4 },
					{ label: "a feature film", sub: "5 GB", magnitude: 5_000 },
					{ label: "a 20-billion-parameter model", sub: "40 GB", magnitude: 40_000 },
					{ label: "a frontier mixture of experts", sub: "≈1.5 TB", magnitude: 1_500_000 },
				]}
				note="to scale by bytes — the song is still there, two pixels wide"
			/>

			<Statement text="The problem is not storing the numbers. It is moving them." />

			<Observation
				label="THE WALL"
				text="To produce one token, every participating weight must travel from memory to the compute unit — and that trip has a speed limit measured in gigabytes per second. Divide the bytes a token needs by the bandwidth and you have the byte floor: the fastest that token can possibly arrive, before any computation counts."
			/>

			<Statement text="Decode speed is a bytes problem before it is a compute problem." />

			<Channel
				from="memory"
				to="compute"
				channelLabel="the channel — a fixed few hundred GB/s"
				stages={[
					{ density: "wide", caption: "16-bit weights — 1,959 MB must cross per token" },
					{ density: "narrow", caption: "4.25-bit weights — 1,269 MB per token, same channel, tokens arrive sooner" },
				]}
			/>

			<Observation
				label="WHY QUANTIZE"
				text="If moving bytes is the wall, make the bytes smaller. Quantization stores each number in fewer bits, which means fewer distinct values a number is allowed to take — dial sixteen bits down to four and tens of thousands of possible levels become sixteen. Every weight snaps to its nearest allowed level, and every bit shaved is bandwidth returned: in one measured case, 1,959 MB per token became 1,269. But snapped numbers are changed numbers, and changed numbers can change answers."
			/>

			<Quantisation
				phases={[
					{ levels: 0, caption: "the numbers as trained — every value exact" },
					{ levels: 33, caption: "16 bits — tens of thousands of levels; the error is invisible" },
					{ levels: 9, caption: "4 bits — sixteen levels; every value moves to the nearest one" },
				]}
				note="small moves, compounded through every layer, can change an answer — which is why nothing ships unmeasured"
			/>

			<Observation
				label="THE FORMAT'S ANSWER"
				text="VINDEX3 refuses to let precision be a rumour. Every encoding is a named, physically present variant beside the original — selected, never converted. Every variant carries a fidelity level that is derived, not claimed. And the container re-verifies against its source, hash by hash, forever. Make the bytes smaller. Never lose track of what you did."
			/>

			<Observation
				label="ENGINES"
				text="A GPU is thousands of small workers moving in lockstep; a CPU is a few fast ones. At decode time, both are mostly waiting on the same thing: bytes. So the format's real job is to make the bytes addressable — mapped straight into memory, read in place, no unpacking. A VINDEX3 container decodes on both engines, and the measured outputs are identical, token for token. The engine is a choice. The bytes are not."
			/>

			<ExpertField
				statement="Models grew by fanning out — and most of the model now sits idle on every token."
				totalUnits={64}
				scenarios={[
					{ label: "“the capital of France”", activeIndices: [3, 17, 42, 58] },
					{ label: "“a line of Python”", activeIndices: [8, 17, 29, 51] },
					{ label: "“a chess opening”", activeIndices: [3, 29, 44, 60] },
				]}
				caption="A mixture-of-experts layer holds many expert tensors and routes each token to a handful. The fan-out is how models got enormous without every token paying for all of it — and it is exactly what a single sealed file cannot serve, because you should not have to load hundreds of experts to use four."
			/>

			<Observation
				label="THE FORMAT'S ANSWER"
				text="VINDEX3 stores experts as addressable banks, grouped into extents sized for how disks and kernels actually read, split across files when a layer outgrows what one file should be. A profile decides what stays resident, what pages in on demand, and what never loads at all — which is how a model larger than your memory still decodes. The routing is the model's. The residency is yours."
			/>

			<Statement text="Which weights load. What precision they use. Where they sit. Which engine runs them. Every lever is a choice about bytes on disk." />

			<Observation
				label="THE EVOLUTION"
				text="Earlier formats made those choices once, at conversion, and sealed them into the file — choose a precision, lose the original; choose a layout, lose the alternatives. VINDEX3 keeps every choice open for the life of the artifact: every part named, every representation present and selectable, every claim checkable against the source."
			/>

			<Statement text="The file stopped being a snapshot of one decision. It became the space of all of them." />

			<Connection
				text="Every lever is a choice about bytes on disk. But before the file that keeps those choices open, meet the machinery the bytes actually are — what a gate, a query, an expert really do. Then the container."
				links={[
					{ href: "/anatomy", label: "THE ANATOMY — WHAT A MODEL CONTAINS" },
					{ href: "/container", label: "ONE DIRECTORY, ONE ROOT" },
					{ href: "/bytes", label: "DOWN TO THE BYTE" },
					{ href: "/representation", label: "SELECTION, NOT CONVERSION" },
					{ href: "/ladder", label: "THE RECORD — WHERE THESE NUMBERS ANSWER" },
				]}
			/>

			<CiteThis slug="/why" />
		</main>
	);
}
