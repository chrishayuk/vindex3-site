import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@chrishayuk/hause/components/JsonLd";
import { breadcrumbLd, techArticleLd } from "@chrishayuk/hause/seo";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Answer } from "@chrishayuk/hause/components/forms/Answer";
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { Observation } from "@chrishayuk/hause/components/forms/Observation";
import { Evidence } from "@chrishayuk/hause/components/forms/Evidence";
import { ModelBrowser } from "@/components/ModelBrowser";
import {
	QWEN,
	OBJECTS,
	COMPILE,
	SURFACES,
	VISION,
	RECORDED_TAG,
	FIDELITY,
	CONTROL_PATH_EXPERIMENT,
} from "@/data/qwen38";

/**
 * A model page is the artifact's own identity surface: what it is,
 * what it is made of, what has been compiled, and — precisely — what
 * has and has not been proven about it. The status strip is the point.
 * It reads MEASURING rather than a number because the canonical bank
 * has not returned, and a page that fills that cell to look finished
 * is the failure this whole site exists to refuse.
 */

const MODELS = [QWEN.slug];

export function generateStaticParams() {
	return MODELS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	const { slug } = await params;
	if (slug !== QWEN.slug) return {};
	return {
		title: `${QWEN.display} — Layers, Precision Map & Evidence`,
		alternates: { canonical: `/models/${QWEN.slug}` },
		description:
			"Open a real 27B hybrid model layer by layer: Gated DeltaNet against gated attention, the compiled NVFP4 precision map, and exactly which claims are measured.",
	};
}

const MONO = "voice-evidence text-xs sm:text-sm";

/**
 * The compact strip. It exists so the execution boundary is legible in
 * one glance — on camera, at a glance, with the sound off — without
 * anyone narrating a paragraph about which backend can do what. Every
 * cell is a claim the artifact can back, and FIDELITY says MEASURING
 * rather than a number because the bank has not returned.
 */
const STATUS: { label: string; value: string; state: "ok" | "running" | "open" }[] = [
	{ label: "REPRESENTABLE", value: "✓", state: "ok" },
	{ label: "NVFP4 COMPILED", value: "✓", state: "ok" },
	{ label: "SELF-VERIFIED", value: "✓", state: "ok" },
	{ label: "NVFP4 EXECUTION", value: "✓", state: "ok" },
	{ label: "FIDELITY", value: "MEASURED", state: "ok" },
	{ label: "VISION FIDELITY", value: "NOT EVALUATED", state: "open" },
];

function StatusStrip() {
	return (
		<section className="hause-grid py-10 sm:py-14">
			<div className="col-span-12 md:col-start-2 md:col-span-10">
				<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-6 opacity-50">STATUS</p>
				<div className="flex flex-col gap-2">
					{STATUS.map((r) => (
						<div
							key={r.label}
							className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 border px-4 sm:px-6 py-3"
							style={{ borderColor: "var(--color-mist)" }}
						>
							<span className="voice-evidence text-[10px] sm:text-xs tracking-[0.12em] uppercase opacity-70">
								{r.label}
							</span>
							<span
								className={MONO}
								style={{
									color:
										r.state === "ok"
											? "var(--color-status-supported)"
											: r.state === "running"
												? "var(--color-status-ongoing)"
												: "var(--color-status-open)",
								}}
							>
								{r.value}
							</span>
						</div>
					))}
				</div>
				<p className="voice-system text-sm opacity-70 leading-relaxed max-w-2xl mt-5">
					The strip tells the truth as it changes, and it has. FIDELITY read MEASURING while the bank ran; Q-BANK-1
					returned on 2026-08-31 and it reads MEASURED. Vision stays NOT EVALUATED, because the tower&apos;s bytes are
					carried and carried is not measured.
				</p>
			</div>
		</section>
	);
}

function gib(bytes: number) {
	return `${(bytes / 1024 ** 3).toFixed(1)} GiB`;
}

export default async function ModelPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	if (slug !== QWEN.slug) notFound();
	const url = `https://vindex3.org/models/${QWEN.slug}`;

	return (
		<main>
			<JsonLd
				data={techArticleLd({
					headline: QWEN.display,
					description:
						"A hybrid 27B model opened layer by layer — declared operators, the compiled precision map, and the evidence that does and does not exist.",
					url,
					siteUrl: "https://vindex3.org",
					siteName: "VINDEX3",
					dateModified: "2026-08-31",
					about: ["quantization", "mixed precision", "gated deltanet"],
				})}
			/>
			<JsonLd
				data={breadcrumbLd([
					{ name: "VINDEX3", url: "https://vindex3.org" },
					{ name: "Models", url: "https://vindex3.org/models" },
					{ name: QWEN.display, url },
				])}
			/>

			<Hero
				kicker={`MODEL · SCHEMA ${QWEN.schema} · AUTHORITY ${QWEN.authority.toUpperCase()}`}
				title="QWEN3.8-27B"
				dek={`${QWEN.layers} language layers that do not all run the same programme, compiled to a precision map rather than a bit-width. Open it.`}
			/>

			<Answer
				id="what-is-qwen38"
				question="What is inside Qwen3.8-27B?"
				answer={`Sixty-four language layers, hidden size ${QWEN.hidden.toLocaleString()}, in a hybrid stack: forty-eight layers mix tokens with a Gated DeltaNet recurrence and sixteen use gated attention, in a repeating pattern of three then one. A vision perception tower sits beside the language stack. The container holds five logical objects and declares each layer's operator explicitly, so every address below resolves by role rather than by filename.`}
			/>

			<StatusStrip />

			<ModelBrowser />

			<p className="hause-grid">
				<span className="col-span-12 md:col-start-2 md:col-span-10 voice-evidence text-[10px] tracking-[0.14em] uppercase opacity-50">
					{RECORDED_TAG}
				</span>
			</p>

			<Statement text="The model does not have a precision. It has a precision map." />

			<Observation
				label="WHAT WAS COMPILED"
				text={`The decoder stack compiled from ${gib(COMPILE.decoderBefore)} to ${gib(COMPILE.decoderAfter)} — ${COMPILE.decoderRatio}, ${COMPILE.decoderBits} bits per weight derived from the stored bytes rather than asserted. ${COMPILE.reencoded} tensors were re-encoded and ${COMPILE.carried} carried verbatim. With the embedding, norm, output head and vision tower left at BF16, the deployable artifact is ${COMPILE.deployable} against ${COMPILE.original} — ${COMPILE.ratio}. Sixteen bits anywhere on that map means the current programme chose sixteen bits, not that anything was proven to need them.`}
			/>

			<section className="hause-grid py-12 sm:py-16">
				<div className="col-span-12 md:col-start-2 md:col-span-10">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-6 opacity-50">OBJECTS</p>
					<div className="flex flex-col gap-2">
						{OBJECTS.map((o) => (
							<div
								key={o.id}
								className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-baseline gap-4 sm:gap-8 border px-4 sm:px-6 py-3"
								style={{ borderColor: "var(--color-mist)" }}
							>
								<span className={`${MONO} truncate`}>
									{o.id}@{o.rep}
								</span>
								<span className="voice-evidence text-[10px] tracking-[0.1em] uppercase opacity-50 whitespace-nowrap">
									{o.tensors} {o.tensors === 1 ? "tensor" : "tensors"}
								</span>
								<span className={`${MONO} opacity-60 w-24 text-right`}>{o.bytes.toLocaleString()}</span>
							</div>
						))}
					</div>
					<p className="voice-system text-sm opacity-70 leading-relaxed max-w-2xl mt-5">
						Five objects, and no multi-token-prediction surface among them. The page names what the artifact holds and
						nothing else.
					</p>
				</div>
			</section>

			<section className="hause-grid py-12 sm:py-16">
				<div className="col-span-12 md:col-start-2 md:col-span-10">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-6 opacity-50">
						SURFACES LEFT AT BF16
					</p>
					<div className="flex flex-col gap-2">
						{SURFACES.map((s) => (
							<div
								key={s.id}
								className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 border px-4 sm:px-6 py-3"
								style={{ borderColor: "var(--color-mist)" }}
							>
								<span className={MONO}>{s.id}</span>
								<span className={`${MONO} opacity-70`}>{s.bits.toFixed(4)} bits/weight</span>
							</div>
						))}
					</div>
				</div>
			</section>

			<Evidence
				items={[
					{
						label: "Representable",
						status: "SUPPORTED",
						detail: `Encoded at schema ${QWEN.schema} with capability ${QWEN.capability}. Whole-model admission refuses: the ${VISION.reason}, so its norm surface is undeclared and the encoder will not invent one. The text stack is fully admissible.`,
					},
					{
						label: "NVFP4 compiled",
						status: "SUPPORTED",
						detail: `${COMPILE.reencoded} tensors re-encoded in ${COMPILE.seconds} seconds; ${COMPILE.decoderBits} bits per weight across the decoder stack, derived from stored bytes.`,
					},
					{
						label: "Self-verified",
						status: "SUPPORTED",
						detail:
							"Recorded hashes and the structural record re-derived from the artifact alone, without an inference engine. That is self-integrity — not a proof that the container matches the original checkpoint, which is a separate and stronger claim made at encode time.",
					},
					{
						label: "NVFP4 execution",
						status: "SUPPORTED",
						detail:
							"The CPU path executes this Gated DeltaNet programme against the NVFP4 representation, so the representation requested is the representation measured — no dequantising to BF16 behind the measurement.",
					},
					{
						label: "Text-decoder fidelity",
						status: "SUPPORTED",
						detail: `Q-BANK-1, ${FIDELITY.positions.toLocaleString()} positions against the BF16 reference: KL mean ${FIDELITY.klMean} (median ${FIDELITY.klMedian}, p95 ${FIDELITY.klP95}), ΔNLL mean +${FIDELITY.dNllMean}, top-1 agreement ${(FIDELITY.top1 * 100).toFixed(2)}% with ${FIDELITY.flips} flips, top-5 overlap ${(FIDELITY.top5 * 100).toFixed(2)}%.`,
					},
					{
						label: "The recurrence-control exception",
						status: "REFUTED",
						detail: `Preserving the decay and write projections at BF16 removed ${CONTROL_PATH_EXPERIMENT.flipDifference} top-1 flips of ${FIDELITY.positions.toLocaleString()} — McNemar exact p = ${CONTROL_PATH_EXPERIMENT.mcnemarP} on the paired difference — for 33.9 MB, while KL p95 and mean ΔNLL were better without it and the high-margin tertile flipped zero times either way. Real, and too small to earn a default exception. The compiler no longer protects that path.`,
					},
					{
						label: "Vision fidelity",
						status: "OPEN",
						detail:
							"The perception tower's bytes are carried untouched. Preserved bytes are not evaluated behaviour, and the Record says which is which.",
					},
				]}
			/>

			<Observation
				label="WHY THIS PAGE HAS A GAP IN IT"
				text="Same top token is not the same model: a representation can choose the identical winning token at every measured position while the distribution underneath it moves. So fidelity here waits on measurements over distributions rather than on whether two generations happen to read alike — and the cell stays empty until they exist."
			/>

			<section className="hause-grid py-16 sm:py-24">
				<div className="col-span-12 md:col-start-2 md:col-span-10 flex flex-wrap gap-6">
					<Link href="/quantization" className="voice-evidence text-sm tracking-[0.08em]" style={{ color: "var(--color-accent)" }}>
						→ How the precision map is compiled
					</Link>
					<Link href="/graph" className="voice-evidence text-sm tracking-[0.08em]" style={{ color: "var(--color-accent)" }}>
						→ Why tensor names are not semantics
					</Link>
					<Link href="/explorer" className="voice-evidence text-sm tracking-[0.08em]" style={{ color: "var(--color-accent)" }}>
						→ Query this artifact yourself
					</Link>
				</div>
			</section>
		</main>
	);
}
