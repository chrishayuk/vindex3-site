import Link from "next/link";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { Observation } from "@chrishayuk/hause/components/forms/Observation";
import { Transformation } from "@chrishayuk/hause/components/forms/Transformation";
import { Compilation } from "@chrishayuk/hause/components/forms/Compilation";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";
import { ContainerReveal } from "@/components/ContainerReveal";

/**
 * The overture: one story, told in beats, each handing to the next —
 * the WHAT (the thesis, performed), the proof you can touch (WALK),
 * the lifecycle (compiled, proven, source released), the evidence,
 * and then THE STORY IN ORDER: the journey through the chapters,
 * numbered, each named by the question it answers. Deliberately not
 * encyclopedic — the chapters carry the spec. Every number states its
 * model, hardware and date, and answers to the Record. No films: the
 * set pieces are performances built from the forms, so they play at
 * every width.
 */

const JOURNEY: { n: string; href: string; title: string; hook: string }[] = [
	{ n: "01", href: "/why", title: "THE PHYSICS", hook: "Why is a file format, of all things, where the battle is fought?" },
	{ n: "02", href: "/anatomy", title: "THE ANATOMY", hook: "What is actually inside a model — what do gate, query, expert mean?" },
	{ n: "03", href: "/quantization", title: "QUANTIZATION", hook: "How many bits does a model need — and why is “4-bit” an incomplete sentence?" },
	{ n: "04", href: "/container", title: "THE CONTAINER", hook: "What does a file look like when every part is named and checkable?" },
	{ n: "05", href: "/graph", title: "THE SYSTEM GRAPH", hook: "Where does meaning live, once it is judged instead of guessed?" },
	{ n: "06", href: "/bytes", title: "THE BYTES", hook: "Can you verify all of it with nothing but a ruler?" },
	{ n: "07", href: "/execution", title: "EXECUTION", hook: "How does a description become computation, aiming at zero architecture branches?" },
	{ n: "08", href: "/representation", title: "REPRESENTATION", hook: "How do many precisions live beside one identity without forking it?" },
	{ n: "09", href: "/authority", title: "AUTHORITY", hook: "Who gets to say what is true about the artifact — and how is that derived?" },
	{ n: "10", href: "/ladder", title: "THE RECORD", hook: "And can you challenge every one of these claims against the ledger?" },
];

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
					<Link href="/why" className="voice-evidence text-sm tracking-[0.08em] border-b pb-1" style={{ borderColor: "var(--color-accent)" }}>
						READ THE STORY →
					</Link>
					<Link href="/ask" className="voice-evidence text-sm tracking-[0.08em] border-b pb-1" style={{ borderColor: "var(--color-accent)" }}>
						ASK VINDEX3 →
					</Link>
					<Link href="/explorer" className="voice-evidence text-sm tracking-[0.08em] border-b pb-1" style={{ borderColor: "var(--color-accent)" }}>
						ENTER A MODEL &gt;
					</Link>
				</div>
			</section>

			{/* ── BEAT ONE — the WHAT ── */}

			<Observation text="An AI model is billions of learned numbers, and today's formats keep those numbers perfectly — as storage. What they do not keep is everything else the release meant: which parts are which, what may consume them, which precisions are still the same model, what was ever proven about any of it. VINDEX3 keeps the numbers and the meaning — every part named, every representation catalogued, every claim checkable — for the life of the artifact." />

			<Statement text="A modern model release is not a weights file. It is a system." />

			<Transformation
				kicker="ONE RELEASE — TWO INTERPRETATIONS"
				objectLabel="the same checkpoint, byte-identically preserved either way"
				blockLabels={["EMBEDDINGS", "ATTENTION", "EXPERTS", "ROUTER", "LM HEAD"]}
				from={{
					label: "A WEIGHTS FILE",
					properties: [
						"Addresses stored tensors — knows where they are",
						"One precision, chosen once at conversion",
						"Meaning lives in filename conventions",
					],
				}}
				to={{
					label: "A DATABASE",
					properties: [
						"Addresses model semantics — knows what they mean",
						"Representations present, selected, authoritative",
						"Run it, query it, verify it — the same bytes",
					],
				}}
			/>

			{/* ── BEAT TWO — the proof you can touch ── */}

			<Statement text="If that claim is true, you should be able to ask the file itself." />

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
						layer by layer. WALK and DESCRIBE are the browse surface the ABI itself specifies. Try it, live, in{" "}
						<Link href="/explorer" className="border-b pb-0.5" style={{ borderColor: "var(--color-accent)" }}>
							the Explorer →
						</Link>
					</p>
					<p className="voice-evidence text-xs opacity-40 leading-relaxed max-w-2xl mt-3">
						A worked shape, not a recorded run. The browse surface ships today as an analysis-only profile;
						expert-region browse parity is still open — the Record keeps score.
					</p>
				</div>
			</section>

			{/* ── BEAT THREE — the lifecycle, performed ── */}

			<Statement text="Where does such a file come from? It is compiled — once." />

			<Compilation
				kicker="EXTRACT ONCE — THE WHOLE BRIDGE, PERFORMED"
				headline="A checkpoint compiles down. Then it is no longer needed."
				sourceLabel="a checkpoint — what you download today"
				sources={[
					"config.json",
					"model-00001-of-00004.safetensors",
					"model-00002-of-00004.safetensors",
					"model-00003-of-00004.safetensors",
					"model-00004-of-00004.safetensors",
					"tokenizer.json",
				]}
				stages={[
					{ name: "inventory", gloss: "read what the source declares" },
					{ name: "plan", gloss: "judge it — ambiguity refused" },
					{ name: "graph", gloss: "components · objects · edges" },
					{ name: "encode", gloss: "segments first, index.json last" },
					{ name: "verify", gloss: "Declared ≡ Resolved ≡ Graph ≡ Encoded" },
				]}
				resultLabel="model.vindex/ — written, then proven"
				results={[
					{ name: "control/ · dense/ · shared/" },
					{ name: "routed/" },
					{ name: "query/ · profiles/" },
					{ name: "index.json", emphasis: true, note: "the root, written last" },
				]}
				verifiedLabel="verified — byte-faithful to its source"
				discardNote="the checkpoint may now be deleted — execution must not change"
				fallback="A checkpoint — config.json and safetensors shards — is inventoried, judged, formed into a graph, encoded in write order with index.json last, and verified against its source. Then the checkpoint may be deleted: execution must not change. That is the whole bridge, and it is crossed once."
			/>

			{/* ── BEAT FOUR — the evidence ── */}

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

			{/* ── BEAT FIVE — the story, in order ── */}

			<section className="hause-grid py-16 sm:py-24">
				<div className="col-span-12 md:col-start-2 md:col-span-9">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-3 opacity-50">THE STORY, IN ORDER</p>
					<p className="voice-editorial text-2xl sm:text-3xl mb-10 max-w-2xl">
						Ten chapters. Each opens with what breaks without it, and hands its question to the next.
					</p>
					<div className="flex flex-col">
						{JOURNEY.map((c, i) => (
							<Link
								key={c.href}
								href={c.href}
								className="graph-pulse group grid grid-cols-[2.5rem_minmax(0,14rem)_1fr] sm:grid-cols-[3rem_minmax(0,16rem)_1fr] gap-3 sm:gap-6 items-baseline py-4 border-t"
								style={{ borderColor: "var(--color-mist)", animationDelay: `${i * 90}ms` }}
							>
								<span className="voice-evidence text-xs opacity-40">{c.n}</span>
								<span className="voice-evidence text-xs sm:text-sm tracking-[0.08em] group-hover:opacity-100" style={{ color: "var(--color-accent)" }}>
									{c.title} →
								</span>
								<span className="voice-system text-sm opacity-70 group-hover:opacity-95 transition-opacity">{c.hook}</span>
							</Link>
						))}
					</div>
				</div>
			</section>

			<Connection
				text="Or skip the reading and put your hands on it — the two surfaces answer from the same knowledge the chapters teach."
				links={[
					{ href: "/ask", label: "ASK VINDEX3 — ANY ANSWERABLE QUESTION" },
					{ href: "/explorer", label: "THE EXPLORER — ENTER A MODEL" },
				]}
			/>
		</main>
	);
}
