import { Hero } from "@chrishayuk/house/components/forms/Hero";
import { Statement } from "@chrishayuk/house/components/forms/Statement";
import { Observation } from "@chrishayuk/house/components/forms/Observation";
import { Decomposition } from "@chrishayuk/house/components/forms/Decomposition";
import { Evidence } from "@chrishayuk/house/components/forms/Evidence";
import { Timeline } from "@chrishayuk/house/components/forms/Timeline";
import { Question } from "@chrishayuk/house/components/forms/Question";

/**
 * DRAFT — first real VINDEX3 exhibit, grounded in the actual spec
 * (crates/larql-vindex/docs/vindex3-format-spec.md in chris-source/larql),
 * not the brainstormed section names from early conversation. Every figure
 * below is either a direct/near-verbatim quote or a specific measured
 * result from that spec and its companion experiments doc — nothing here
 * is illustrative. See the Scope note and Sources at the bottom before
 * treating this as the whole of VINDEX3.
 */
export default function Home() {
	return (
		<main>
			<Hero
				kicker="VINDEX3 · SPEC 3.0-DRAFT-2"
				title="THE MODEL IS THE DATABASE"
				dek="A general-purpose serving container for sparse models — serving meaning both inference and the query surface, over the same bytes."
			/>

			<Statement text="VINDEX3 does not add a query index next to the weights. It keeps the weights queryable." />

			<Observation text="Extract a supported checkpoint once, into a stable, component-addressed layout. Then vary what is loaded, where it resides, what precision it uses, and whether a component is executed or queried — without ever rebuilding the index." />

			<Decomposition
				kicker="model.vindex/ — ONE CONTAINER, FIVE DURABLE WEIGHT CLASSES"
				source={{ label: "model.vindex/", detail: "A directory, not a single blob — component-addressed from the start." }}
				parts={[
					{ label: "CONTROL & ROUTER", detail: "Embeddings, norms, LM head, routers." },
					{ label: "DENSE SPINE", detail: "The non-routed backbone layers." },
					{ label: "SHARED FFN", detail: "Feed-forward blocks shared across experts." },
					{ label: "ROUTED GATE-UP / DOWN BANKS", detail: "The expert weights — segmented, independently addressable." },
				]}
				result={{ label: "index.json", detail: "Sole root authority — version, identity, provenance, checksums, class map, segment lists." }}
			/>

			<Evidence
				items={[
					{
						label: "Round-trip fidelity on a real Gemma 4 26B-A4B layer (gate c8)",
						status: "SUPPORTED",
						detail:
							"Layer 0 of gemma4-26b-a4b.vindex — hidden 2816, 128 experts, top-8 routing, 704 semantic dims over 768 stored. Reopens, verifies clean, and comes back 256/256 regions byte-identical against the VINDEX2 source. 421 MB container.",
					},
					{
						label: "Browsable surface vs. actual expert population (baseline W0)",
						status: "OPEN",
						detail:
							"A fresh VINDEX2 extract of the same model exposes 2,112 walkable features per layer — the dense FFN width. The expert population would contribute 128 × 704 = 90,112. The expert weights are present and decode correctly (30 files, 12 GB); they are simply not part of the searchable surface yet.",
					},
				]}
			/>

			<Timeline
				entries={[
					{
						date: "Before 3.0",
						text: "VINDEX2 is the predecessor generation. VINDEX3 inherits its core premise — the weights stay queryable, not just loadable — and extends it with component addressing and graded representation authority.",
					},
					{
						date: "2026-08-01",
						text: "3.0-draft-2 published: three binary-layout corrections and two clarifications from the first LYRW v2 implementation. Five production models — gpt-oss-20b, Gemma 4 26B-A4B, and Granite 4.1 3B/8B/30B — already round-trip through it byte-identical, despite the ABI still being unfrozen.",
					},
					{
						date: "2026-08-04",
						text: "The c8 gate closes: a real Gemma 4 26B-A4B layer reopens and verifies clean, 256 of 256 regions byte-identical.",
					},
				]}
			/>

			<Question
				status="OPEN"
				text="If production models already round-trip through VINDEX3 byte-identical, why does the default extractor still write VINDEX2?"
				detail="Both things are true at once, per the project's own generation-policy notes: the contract naming VINDEX3 as the candidate primary generation is adopted, but the default hasn't been flipped yet. The format works. It isn't yet what you get without asking for it."
			/>

			<Observation
				label="SCOPE"
				text="This exhibit describes the MoE-serving container format — banks, LYRW v2, segments, execution profiles — as specified in the crate-level spec. A second, broader specification exists, describing a different, later system-graph architecture (components, a compilation ladder, a model codenamed “Glimmer”) that isn't covered here yet. The two aren't simple duplicates of each other; this is one real slice of VINDEX3, not the whole of it."
			/>

			<section className="house-grid pb-32 pt-8 border-t" style={{ borderColor: "var(--color-mist)" }}>
				<div className="col-span-12">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase opacity-50 mb-4">SOURCES</p>
					<ul className="voice-evidence text-sm opacity-60 flex flex-col gap-1">
						<li>larql — crates/larql-vindex/docs/vindex3-format-spec.md (3.0-draft-2)</li>
						<li>larql — docs/vindex3-experiments.md</li>
						<li>larql — docs/vindex-generation-policy.md</li>
					</ul>
				</div>
			</section>
		</main>
	);
}
