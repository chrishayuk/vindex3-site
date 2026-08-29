import Link from "next/link";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { Observation } from "@chrishayuk/hause/components/forms/Observation";
import { Transformation } from "@chrishayuk/hause/components/forms/Transformation";
import { Film } from "@chrishayuk/hause/components/forms/Film";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";
import { ContainerReveal } from "@/components/ContainerReveal";

/**
 * The overture: thesis → demonstration → evidence → choose a path.
 * Deliberately not encyclopedic — the chapters carry the spec; this
 * page earns the title. Every number states its model, hardware and
 * date, and answers to the Record.
 */
export default function Home() {
	return (
		<main>
			<ContainerReveal />

			<Hero
				kicker="VINDEX3 · SPEC 3.0-DRAFT-2"
				title="THE MODEL IS THE DATABASE"
				dek="A way of storing an AI model so the same copy can be run, questioned, and checked — nothing repackaged, nothing thrown away."
			/>

			<section className="hause-grid py-8">
				<div className="col-span-12 md:col-start-2 md:col-span-9 flex flex-wrap gap-x-10 gap-y-3">
					<Link href="/container" className="voice-evidence text-sm tracking-[0.08em] border-b pb-1" style={{ borderColor: "var(--color-accent)" }}>
						READ THE SPEC →
					</Link>
					<Link href="/ask" className="voice-evidence text-sm tracking-[0.08em] border-b pb-1" style={{ borderColor: "var(--color-accent)" }}>
						ASK VINDEX3 →
					</Link>
					<Link href="/explorer" className="voice-evidence text-sm tracking-[0.08em] border-b pb-1" style={{ borderColor: "var(--color-accent)" }}>
						ENTER A MODEL &gt;
					</Link>
				</div>
			</section>

			<Observation text="An AI model is billions of learned numbers, and today's formats keep those numbers perfectly — as storage. What they do not keep is everything else the release meant: which parts are which, what may consume them, which precisions are still the same model, what was ever proven about any of it. VINDEX3 keeps the numbers and the meaning — every part named, every representation catalogued, every claim checkable — for the life of the artifact." />

			<Statement text="A modern model release is not a weights file. It is a system." />

			<Transformation
				kicker="ONE RELEASE — TWO INTERPRETATIONS"
				objectLabel="the same checkpoint, byte-identically preserved either way"
				blockLabels={["EMBEDDINGS", "ATTENTION", "EXPERTS", "ROUTER", "LM HEAD"]}
				from={{
					label: "A WEIGHTS FILE",
					properties: [
						"Loaded whole, or not at all",
						"One precision, chosen once at conversion",
						"Answers one request: run",
					],
				}}
				to={{
					label: "A DATABASE",
					properties: [
						"Component-addressed — load what you need",
						"Multiple representations, selected per profile",
						"Run it, query it, verify it — the same bytes",
					],
				}}
			/>

			<section className="hause-grid py-16 sm:py-24">
				<div className="col-span-12 md:col-start-2 md:col-span-9">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-8 opacity-50">
						ONE QUERY, STRAIGHT AT THE WEIGHTS
					</p>
					<p className="voice-evidence text-base sm:text-lg mb-6" style={{ color: "var(--color-accent)" }}>
						WALK &quot;the capital of France&quot; TOP 3
					</p>
					<div className="flex flex-col gap-2 max-w-xl" aria-hidden="true">
						{[
							{ layer: "layer 24", feature: "feature 24:1882", score: 0.83 },
							{ layer: "layer 27", feature: "feature 27:0413", score: 0.79 },
							{ layer: "layer 31", feature: "feature 31:2050", score: 0.71 },
						].map((r, i) => (
							<div
								key={r.feature}
								className="graph-pulse grid grid-cols-[5.5rem_minmax(0,10rem)_3rem_1fr] gap-4 items-center"
								style={{ animationDelay: `${i * 140}ms` }}
							>
								<span className="voice-evidence text-xs opacity-60">{r.layer}</span>
								<span className="voice-evidence text-xs">{r.feature}</span>
								<span className="voice-evidence text-xs" style={{ color: "var(--color-accent)" }}>
									{r.score.toFixed(2)}
								</span>
								<div className="h-3 border" style={{ borderColor: "var(--color-mist)" }}>
									<div
										className="h-full"
										style={{
											width: `${r.score * 100}%`,
											backgroundImage:
												"repeating-linear-gradient(45deg, var(--color-accent) 0, var(--color-accent) 1px, transparent 1px, transparent 4px)",
										}}
									/>
								</div>
							</div>
						))}
					</div>
					<p className="voice-system text-sm opacity-70 leading-relaxed max-w-2xl mt-6">
						No forward pass, and no separate index — the answer is read from the stored gate rows themselves,
						layer by layer. WALK and DESCRIBE are the browse surface the ABI itself specifies.
					</p>
					<p className="voice-evidence text-xs opacity-40 leading-relaxed max-w-2xl mt-3">
						A worked shape, not a recorded run. The browse surface ships today as an analysis-only profile;
						expert-region browse parity is still open — the Record keeps score.
					</p>
				</div>
			</section>

			<Film
				title="Extract once"
				description="A checkpoint compiles down into a container, is proven byte-faithful — and the checkpoint ghosts away, no longer needed. Thirty seconds, from the format's own performance."
				src="/films/extract-once.mp4"
				poster="/films/extract-once-poster.jpg"
			/>

			<Statement text="106 tokens per second, from one container, on one laptop — and the answer, provably unchanged." />

			<section className="hause-grid pb-4 -mt-10">
				<div className="col-span-12 md:col-start-2 md:col-span-9">
					<p className="voice-evidence text-xs opacity-50">
						gpt-oss-20b · one M3 Max · measured 2026-08-20 · same greedy ids on every arm —{" "}
						<Link href="/ladder" className="border-b pb-0.5" style={{ borderColor: "var(--color-accent)" }}>
							accounted on the Record →
						</Link>
					</p>
				</div>
			</section>

			<Connection
				text="Now choose a path — the physics from first principles, or straight into the container."
				links={[
					{ href: "/why", label: "THE PHYSICS — START AT FIRST PRINCIPLES" },
					{ href: "/container", label: "ONE DIRECTORY, ONE ROOT" },
					{ href: "/bytes", label: "DOWN TO THE BYTE" },
					{ href: "/graph", label: "COMPONENTS, OBJECTS, EDGES" },
					{ href: "/execution", label: "FROM DESCRIPTION TO COMPUTATION" },
					{ href: "/representation", label: "SELECTION, NOT CONVERSION" },
					{ href: "/authority", label: "WHERE TRUTH COMES FROM" },
					{ href: "/ladder", label: "THE RECORD — STATUS, PROOF, HISTORY" },
				]}
			/>
		</main>
	);
}
