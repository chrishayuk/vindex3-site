import { sourceLink } from "@/data/release";

const kinds = [
	["DECLARED", "The graph says this operator exists.", "A description of the program, before it runs."],
	["OBSERVED", "This carrier was written.", "A value captured at a named execution boundary."],
	["ATTRIBUTED", "This head contributes under this readout.", "Descriptive support depends on the reader and normalization contract."],
	["INTERVENED", "Changing this head changed the continuation.", "Requires a recorded manipulation and a controlled comparison."],
	["TESTED", "This effect held within the frozen experiment.", "A scoped result. Its controls, subject and decision rule travel with the claim."],
];

export function EvidenceSequence() {
	return <section className="hause-grid py-16 sm:py-24" id="claims">
		<div className="col-span-12 md:col-start-2 md:col-span-9">
			<p className="voice-evidence text-xs tracking-widest opacity-60 mb-6">WHAT KIND OF THING DO WE KNOW?</p>
			<ol className="evidence-sequence">{kinds.map(([name, claim, scope]) => <li key={name}>
				<span className="voice-evidence text-xs tracking-widest">{name}</span>
				<div><h3 className="voice-editorial text-xl sm:text-2xl">{claim}</h3><p className="voice-system text-sm opacity-70 mt-2">{scope}</p></div>
			</li>)}</ol>
			<p className="voice-system text-sm leading-relaxed mt-6 max-w-2xl">These are different claims, each needing its own evidence. Observation does not establish attribution; attribution does not establish a counterfactual. Even an intervention needs controls before it supports a causal conclusion.</p>
			<a className="exhibit-link voice-evidence text-xs mt-6 inline-block" href={sourceLink("docs/vindex3/observation-and-intervention.md")}>THE EVIDENCE CONTRACT →</a>
		</div>
	</section>;
}
