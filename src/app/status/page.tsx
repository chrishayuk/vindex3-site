import type { Metadata } from "next";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";
import { StudyRoom, StudySequence } from "@chrishayuk/hause/components/exhibition/Study";
import { CURRENT, RELEASE, sourceLink } from "@/data/release";

export const metadata: Metadata = {
	title: "Current VINDEX3 capabilities and implementation status",
	alternates: { canonical: "/status" },
	description: "The current LARQL source checkout: encode, run, represent, observe, intervene and query. Implementation boundaries, source provenance and the remaining 3.0 gates.",
};

const capabilities = [
	{ name: "Encode & inspect", detail: "Admit local checkpoints or Hugging Face sources, build the system graph, encode and inspect a container. Admission and operand closure determine support.", boundary: "A recognized model family is not a guarantee that every checkpoint is admissible.", source: "docs/vindex3/what-is-vindex3.md" },
	{ name: "Run & distribute", detail: "Execute the canonical component program on CPU or scoped Metal backends, maintain sessions and serve HTTP. CPU dense FFN workers and stateless softmax-prefix layer workers are implemented.", boundary: "Remote KV, grid placement and remote Metal/KDA/MLA workers remain outside that scope. Multimodal embedding handoff is still refused.", source: "docs/vindex3/runtime-followups.md" },
	{ name: "Represent & measure", detail: "Compile NVFP4, K-quants or plugin encodings with role policies and protected projections. Keep canonical bytes in an archival container or emit a derived deployment image. Measure a candidate against a reference over a sealed token bank.", boundary: "A smaller pack is not behavioral approval. Receipts establish measurement admissibility; a separate declared decision governs acceptance.", source: "docs/vindex3/representation.md" },
	{ name: "Observe & read", detail: "Record carrier writes from the canonical decode traversal with provenance and receipts. Optional logit lenses and per-head capture expose declared views. The Observatory validates and replays recordings.", boundary: "Replaying a recording does not execute a model. A projection or additive head decomposition is descriptive evidence, not a causal result.", source: "docs/vindex3/observation-and-intervention.md" },
	{ name: "Intervene & compare", detail: "Use observe --intervene for declared carrier changes and in-kernel head counterfactuals. Record the manipulation, vector provenance and intervention firings alongside the run.", boundary: "Head intervention currently covers CPU softmax decode. MLA, conv-QKV, batch prefill and Metal head intervention remain outside it. There is no separate intervene command.", source: "docs/vindex3/observation-and-intervention.md" },
	{ name: "Extend & query", detail: "Unix plugins can register codecs, encoders, lowering providers and continuation providers. LQL retains extraction, query, patch and compilation surfaces across the supported generations.", boundary: "Plugins must be explicitly named and match the host compiler and larql-vindex commit. Generation selection remains deliberate; automatic extraction still chooses VINDEX2.", source: "docs/vindex3/plugins.md" },
];

export default function StatusPage() {
	const facts = CURRENT.facts;
	return <main className="current-status">
		<Hero kicker={`CURRENT IMPLEMENTATION · REVIEWED ${CURRENT.reviewed}`} title="A MODEL CAN LEAVE A RECORD"
			dek="Encode its structure. Run its program. Change its representation. Observe what it writes, then test what changes when you intervene. Each capability carries its own boundary." />
		<StudyRoom label={`${CURRENT.label} · ${CURRENT.commit.slice(0, 8)}`} title="The version and the implementation have different clocks."
			description="These facts come from the LARQL checkout linked below. The published CLI and the candidate format keep their own versions; neither promises every capability in this checkout.">
			<dl className="current-facts">
				{[
					["Candidate specification", facts.spec_version],
					["Graph schema", facts.constants.GRAPH_SCHEMA],
					["Planner schema", facts.constants.PLAN_SCHEMA],
					["Planner semantics", facts.constants.PLANNER_SEMANTICS_VERSION],
					["Automatic extraction", facts.constants.DEFAULT_EXTRACTION_GENERATION],
					["Published CLI", `vindex ${RELEASE.cli.version}`],
				].map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}
			</dl>
			<p><a href={sourceLink("docs/generated/current-facts.md")}>Machine-derived checkout facts →</a> · <a href={RELEASE.cli.href}>Published release →</a></p>
			{facts.provenance.dirty && <p>This snapshot includes local, uncommitted work. The linked commit alone does not reproduce those edits; the export retains source hashes.</p>}
		</StudyRoom>
		<Statement presentation="room" text="Observation makes a record." continuation="Intervention tests a consequence." />
		<StudyRoom id="capabilities" label="SIX WAYS INTO THE MODEL" title="What the checkout can do">
			<div className="capability-list">{capabilities.map((item, index) => <article key={item.name}>
				<p className="exhibition-label">0{index + 1}</p><h3>{item.name}</h3>
				<p>{item.detail}</p><p className="capability-boundary"><strong>Scope.</strong> {item.boundary}</p>
				<a href={sourceLink(item.source)}>Read the implementation contract →</a>
			</article>)}</div>
		</StudyRoom>
		<StudyRoom id="format" label="3.0 CANDIDATE · ADR-0027 · 26 SEPTEMBER 2026" title="One graph container. A legacy bank layout."
			description="The accepted decision makes the graph container the only normative top-level shape at 3.0 Final. LYRW v2 remains an import/interchange codec outside that normative contract. The decision's full execution is still pending.">
			<StudySequence label="THE CONVERGENCE DECISION" steps={[
				{ label: "01 · NORMATIVE DIRECTION", value: "system_graph", detail: "Logical objects, representations and tensor-table segments. Routed models can use this shape without any .lyrw files." },
				{ label: "02 · LEGACY INPUT", value: "moe_manifest + LYRW", detail: "Recognize the legacy bank shape, then open it or refuse it by name with a migration path. It is not a conforming VINDEX3 3.0 model." },
				{ label: "03 · STILL TO CLOSE", value: "Graph conformance", detail: "The inventory found no surviving bank artifact in the searched scope. A graph conformance fixture and specification changes remain closure criteria. Bank-layout evidence does not automatically certify the graph shape." },
			]} note="Named legacy recognition, the single production bank producer and the scoped artifact inventory are complete. The ADR still marks overall execution pending; the site does not promote it to a passed gate." />
			<p><a href={sourceLink("docs/adr/0027-vindex3-single-container-shape.md")}>Read the decision and its closure criteria →</a></p>
		</StudyRoom>
		<StudyRoom id="commands" label="MACHINE-DERIVED INVENTORY" title="Two tools, explicit surfaces">
			<h3>vindex · artifact tooling</h3><p className="command-inventory">{facts.commands.vindex.join(" · ")}</p>
			<h3>larql vindex3 · execution and research</h3><p className="command-inventory">{facts.commands.larql_vindex3.join(" · ")}</p>
			<p>Use each command’s <code>--help</code> for its supported arguments. These are source-checkout commands, not a transcript of the released binary.</p>
		</StudyRoom>
		<StudyRoom id="new-work" label="LATEST MAINLINE ADDITIONS" title="A search surface. An explicit state horizon.">
			<h3>AUTO-REP is reachable</h3>
			<p><code>larql vindex3 auto-rep init</code> produces a characterization-only plan record. <code>auto-rep run</code> connects the search loop to the measurement arms, but refuses a record without an armed gate before compiling anything. MEASURE-PLAN-3 freezes the first Granite campaign; the protocol is not a reported result.</p>
			<p><a href={sourceLink("docs/measure-plan-2.md")}>Implementation record →</a> · <a href={sourceLink("docs/measure-plan-3.md")}>Frozen campaign →</a></p>
			<h3>Continuation can follow the attention horizon</h3>
			<p><code>larql run --continuation window/v1</code> selects the bounded KV provider. It retains rows required by the plan’s declared attention horizon and drops expired rows. It supports KV regions only; recurrent and latent-KV plans are refused. Existing defaults remain unchanged.</p>
			<p><a href={sourceLink("crates/larql-kv/README.md")}>Continuation providers →</a></p>
		</StudyRoom>
		<Connection text="The August and September measurements retain their original dates and scope. The current implementation adds capabilities; it does not retroactively strengthen an older experiment."
			links={[{ href: "/get-started", label: "THE RECORDED ON-RAMP" }, { href: "/ladder", label: "THE EVIDENCE RECORD" }, { href: "/3.0", label: "THE CANDIDATE FORMAT" }]} />
	</main>;
}
