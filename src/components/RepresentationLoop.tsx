import Link from "next/link";
import { sourceLink } from "@/data/release";

export function RepresentationLoop() {
	return <section className="hause-grid py-16 sm:py-24" id="representation-loop">
		<div className="col-span-12 md:col-start-2 md:col-span-9">
			<p className="voice-evidence text-xs tracking-widest opacity-60 mb-5">REPRESENT · EVIDENCE-DIRECTED COMPILATION</p>
			<h2 className="voice-editorial text-3xl sm:text-5xl max-w-3xl">Precision is something a model earns.</h2>
			<p className="voice-system leading-relaxed max-w-2xl mt-6">Freeze the behaviour to preserve. Compile a candidate. Measure the composed model against a reference. Let the evidence decide which physical form is admissible.</p>
			<ol className="compilation-loop voice-evidence text-xs" aria-label="Representation evidence loop">
				{["IDENTIFY CANDIDATE", "COMPILE", "SEALED TOKEN BANK", "MEASURE", "INGEST EVIDENCE", "ADJUDICATE", "SEARCH · REFUSE · PROMOTE"].map(label => <li key={label}>{label}</li>)}
			</ol>
			<div className="representation-verdicts">
				<article><p className="voice-evidence text-xs opacity-60">RECORDED MAP · 256 POSITIONS</p><h3 className="voice-editorial text-3xl mt-4">L20–25 Q8 · L26 Q6</h3><dl><dt>KL p99</dt><dd>2.489e-3</dd><dt>Limit</dt><dd>1.000e-3</dd></dl><p className="voice-evidence verdict-refused">REFUSED</p><p className="voice-system text-sm mt-3">Each member passed alone. Their composition exceeds the KL budget.</p></article>
				<article><p className="voice-evidence text-xs opacity-60">RECORDED MAP · 8,192 POSITIONS</p><h3 className="voice-editorial text-3xl mt-4">L24–26 → Q8_0</h3><dl><dt>KL p99</dt><dd>4.153e-4</dd><dt>Limit</dt><dd>1.000e-3</dd></dl><p className="voice-evidence" style={{ color: "var(--color-accent)" }}>PASSED THE FROZEN CONTRACT</p><p className="voice-system text-sm mt-3">L0–23 stay BF16. The whole model passes all six criteria, not just KL.</p></article>
			</div>
			<p className="voice-evidence text-xs opacity-70 leading-relaxed mt-5">Kimi-Linear-48B-A3B-Instruct · 2026-08-30 · kimi-logit-v3 · teacher-forced evaluation. Diagnostic and authority scales are labelled separately. Dated precision-topology evidence; these are not results from the new AUTO-REP campaign.</p>
			<p className="voice-system text-sm leading-relaxed mt-5 max-w-2xl">The current measurement tool establishes whether evidence is admissible. Acceptance needs a separately declared gate. AUTO-REP refuses to run an unarmed plan; a search interface does not mean a campaign has passed.</p>
			<div className="record-links voice-evidence text-xs"><Link href="/represent">EXPLORE REPRESENT →</Link><a href={sourceLink("docs/kimi-precision-topology.md")}>READ THE RECORDED RESULT ↗</a><a href={sourceLink("docs/measure-plan-2.md")}>CURRENT SEARCH BOUNDARY ↗</a></div>
		</div>
	</section>;
}
