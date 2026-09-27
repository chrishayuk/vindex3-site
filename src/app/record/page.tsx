import type { Metadata } from "next";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";
import { StudyRoom, StudySequence } from "@chrishayuk/hause/components/exhibition/Study";
import { RecordExhibit } from "@/components/RecordExhibit";
import { EvidenceSequence } from "@/components/EvidenceSequence";
import { sourceLink } from "@/data/release";

export const metadata: Metadata = {
	title: "The execution is a record — Observe, Intervene, Observatory",
	description: "Inspect a canonical Gemma recording without inference. Carrier writes, measured lenses, provenance and the boundary between observation and a controlled counterfactual.",
	alternates: { canonical: "/record" },
};

export default function RecordPage() {
	return <main>
		<Hero kicker="III · THE EVIDENCE" title="THE EXECUTION IS A RECORD." dek="A computation should survive the computation. A canonical recording preserves what the execution wrote, where it wrote it and which declared reader inspected it. No model needs to be running to inspect those values again." />
		<section className="hause-grid py-16"><div className="col-span-12 md:col-start-2 md:col-span-9"><RecordExhibit /></div></section>
		<StudyRoom id="observe" label="OBSERVE → RECORD → REPLAY" title="Every write has an address.">
			<StudySequence label="THE SAME EXECUTION, MADE INSPECTABLE" steps={[
				{ label: "01 · EXECUTE", value: "The canonical traversal", detail: "Observation subscribes to the executor’s carrier writes. It does not reconstruct a second forward pass for display." },
				{ label: "02 · RECORD", value: "Identity, values, receipt", detail: "Run provenance, basis identity, ordered events and receipt bindings travel in the native JSONL." },
				{ label: "03 · REPLAY", value: "Observatory", detail: "Validate the file, revisit a position and depth, and inspect recorded lens values. No inference is required." },
			]} />
			<p>The receipt binds the event log and declares completeness. It does not independently authenticate the producer, verify the model’s identity or prove agreement with another implementation.</p>
			<p><a className="exhibit-link" href={sourceLink("observatory/V3-BRIDGE.md")}>Read the native recording contract →</a></p>
		</StudyRoom>
		<Statement text="If a record identifies a mechanism, you can ask what changes when you change it." />
		<StudyRoom id="intervene" label="INTERVENE · A SEPARATE EXPERIMENT" title="Change a head. Resume the computation.">
			<p>A declared head intervention changes the mixed head value inside attention, before the gate, output projection and post-attention normalization. Downstream execution resumes from that change. Subtracting a displayed contribution after the fact is a different operation.</p>
			<StudySequence label="COUNTERFACTUAL PROTOCOL · NOT A RESULT FROM THE PARIS RECORDING" steps={[
				{ label: "BASELINE", value: "Freeze the comparison", detail: "Name the model, representation, prompt, addresses, reader and decision rule." },
				{ label: "MANIPULATION", value: "Zero · scale · replace", detail: "Declare the layer, query head and positions. Record the declaration, donor provenance when needed, and actual firings." },
				{ label: "CONSEQUENCE", value: "Compare the continuation", detail: "Measure the change against the baseline and controls. A firing receipt alone establishes no causal effect." },
			]} />
			<p>The interface is <code>observe --intervene</code>. Head intervention currently covers CPU softmax decode; MLA, conv-QKV, batch prefill and Metal head intervention remain outside that scope. The Paris recording above contains no intervention.</p>
			<p><a className="exhibit-link" href={sourceLink("docs/v3-intervene-2-head-intervention.md")}>The head-intervention contract →</a></p>
		</StudyRoom>
		<Statement text="THE CLAIM CAN BE TESTED." />
		<EvidenceSequence />
		<Connection text="The recording preserves an execution. The evidence ledger preserves the scope of what was learned from it." links={[{ href: "/ladder", label: "THE EVIDENCE LEDGER" }, { href: "/authority", label: "WHO GETS TO SAY WHAT IS TRUE?" }, { href: "/status", label: "CURRENT IMPLEMENTATION" }]} />
	</main>;
}
