import { RecordExhibit } from "@/components/RecordExhibit";
import { EvidenceSequence } from "@/components/EvidenceSequence";
import { RepresentationLoop } from "@/components/RepresentationLoop";
import { CurrentStatus } from "@/components/CurrentStatus";
import Link from "next/link";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { Observation } from "@chrishayuk/hause/components/forms/Observation";
import { Transformation } from "@chrishayuk/hause/components/forms/Transformation";
import { Compilation } from "@chrishayuk/hause/components/forms/Compilation";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";
import { ContainerReveal } from "@/components/ContainerReveal";

/** The artifact becomes a machine; its execution becomes testable evidence. */
const ACTS = [
	{ n: "I", title: "THE ARTIFACT", question: "What is the model?", chapters: [
		{ href: "/why", title: "THE PHYSICS", hook: "Why is a file format where the battle is fought?" },
		{ href: "/anatomy", title: "THE ANATOMY", hook: "What is actually inside a model?" },
		{ href: "/container", title: "THE CONTAINER", hook: "Every part named and checkable." },
		{ href: "/graph", title: "THE SYSTEM GRAPH", hook: "Where meaning is judged instead of guessed." },
		{ href: "/bytes", title: "THE BYTES", hook: "An artifact you can verify with a ruler." },
	]},
	{ n: "II", title: "THE MACHINE", question: "How does it become computation?", chapters: [
		{ href: "/execution", title: "EXECUTION", hook: "The description becomes a program." },
		{ href: "/quantization", title: "QUANTIZATION", hook: "Why “4-bit” is an incomplete sentence." },
		{ href: "/representation", title: "REPRESENTATION", hook: "Many physical forms, one identity." },
		{ href: "/represent", title: "REPRESENT", hook: "Let evidence decide the precision map." },
		{ href: "/execution#state", title: "STATE", hook: "What must survive for computation to continue?" },
	]},
	{ n: "III", title: "THE EVIDENCE", question: "How do we know what happened?", chapters: [
		{ href: "/record", title: "THE RECORD", hook: "Observe a write. Revisit it in Observatory." },
		{ href: "/record#claims", title: "ATTRIBUTION", hook: "What a readout establishes, and what it cannot." },
		{ href: "/record#intervene", title: "INTERVENTION", hook: "Change a mechanism. Test the consequence." },
		{ href: "/authority", title: "AUTHORITY", hook: "Who gets to say what is true?" },
		{ href: "/lifecycle", title: "THE LIFECYCLE", hook: "Run, watch and change an artifact over its life." },
		{ href: "/ladder", title: "THE LEDGER", hook: "Challenge the claims against their experiments." },
	]},
];

export default function Home() {
	return (
		<main>
			<ContainerReveal />

			<Hero
				kicker="VINDEX3 · 3.0 CANDIDATE SPECIFICATION"
				title="THE MODEL IS THE DATABASE"
				dek="A self-describing, executable, queryable model container: the same copy can be run, questioned, checked — and changed, with proof. Nothing re-exported for each use, nothing thrown away."
			/>

			<section className="hause-grid pb-8" aria-label="Six acts of LARQL">
				<div className="col-span-12 md:col-start-2 md:col-span-9">
					<nav className="voice-evidence flex flex-wrap gap-x-5 gap-y-3 text-xs sm:text-sm tracking-widest" aria-label="Operate the model">
						{[["ENCODE", "/container"], ["RUN", "/execution"], ["REPRESENT", "/represent"], ["OBSERVE", "/record"], ["INTERVENE", "/record#intervene"], ["QUERY", "/explorer"]].map(([label, href]) => <Link key={label} href={href} className="exhibit-link">{label}</Link>)}
					</nav>
					<p className="voice-editorial text-xl sm:text-2xl leading-relaxed mt-8">A model you can run.<br />A computation you can inspect.<br />A claim you can test.</p>
				</div>
			</section>

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
				blockLabels={["EMBEDDING", "DECODER STACK", "EXPERT BANK", "FINAL NORM", "OUTPUT HEAD"]}
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
						"Each layer's operator declared — surfaces follow the program",
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

			<Statement text="THE EXECUTION IS A RECORD." />
			<section className="hause-grid py-16 sm:py-24" id="record">
				<div className="col-span-12 md:col-start-2 md:col-span-9">
					<p className="voice-editorial text-2xl sm:text-3xl max-w-2xl mb-10">If a container knows how to execute, the execution can identify its writes. Those writes can become a record.</p>
					<RecordExhibit />
					<p className="voice-editorial text-2xl sm:text-3xl max-w-2xl mt-10">The execution left a record.<br />No model needs to be running to inspect it again.</p>
					<Link href="/record" className="exhibit-link voice-evidence text-sm inline-block mt-6">OBSERVE, ATTRIBUTE, INTERVENE →</Link>
				</div>
			</section>

			{/* The artifact's construction remains part of the argument. */}

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
					{ name: "system_graph.json" },
					{ name: "segments/ — one per logical object" },
					{ name: "tokenizer.json + capability snapshot" },
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

			<RepresentationLoop />

			<Statement text="THE CLAIM CAN BE TESTED." />
			<EvidenceSequence />

			<section className="hause-grid py-16 sm:py-24">
				<div className="col-span-12 md:col-start-2 md:col-span-9">
					<p className="voice-evidence text-xs tracking-widest opacity-60 mb-4">THE STORY, IN THREE ACTS</p>
					<h2 className="voice-editorial text-3xl sm:text-5xl">Artifact. Machine. Evidence.</h2>
					{ACTS.map(act => <section key={act.n} className="exhibition-act" aria-labelledby={`act-${act.n}`}>
						<p className="voice-evidence text-xs tracking-widest opacity-60 mb-3">{act.n} · {act.title}</p>
						<h3 id={`act-${act.n}`} className="voice-editorial text-2xl mb-6">{act.question}</h3>
						{act.chapters.map(chapter => <Link key={chapter.href} href={chapter.href} className="exhibition-chapter">
							<span className="voice-evidence text-xs tracking-wider">{chapter.title} →</span>
							<span className="voice-system text-sm opacity-75">{chapter.hook}</span>
						</Link>)}
					</section>)}
				</div>
			</section>

			<section className="hause-grid py-16">
				<div className="col-span-12 md:col-start-2 md:col-span-9">
					<h2 className="voice-editorial text-3xl mb-8">One family. Distinct jobs.</h2>
					<dl>{[
						["VINDEX3", "The artifact. A model is an executable database."],
						["LARQL", "The engine. Query and operate that database."],
						["OBSERVATORY", "The instrument. See what its computation did."],
						["REPRESENT", "The compilation programme. Test changes to its physical form against declared behaviour."],
						["HAUSE", "The language. Make the structure, the evidence and the refusals legible."],
					].map(([name, description]) => <div key={name} className="family-line"><dt className="voice-evidence text-xs">{name}</dt><dd className="voice-system text-sm opacity-75">{description}</dd></div>)}</dl>
				</div>
			</section>
			<CurrentStatus />

			<Connection
				text="Or skip the reading and put your hands on it — the surfaces answer from the same knowledge the chapters teach, and the CLI runs it all on your own machine."
				links={[
					{ href: "/ask", label: "ASK VINDEX3 — ANY ANSWERABLE QUESTION" },
					{ href: "/explorer", label: "THE EXPLORER — ENTER A MODEL" },
					{ href: "/get-started", label: "GET STARTED — MODEL IN, MODEL RUNS" },
				]}
			/>
		</main>
	);
}
