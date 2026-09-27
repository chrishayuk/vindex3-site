"use client";

import { useId, useState } from "react";
import recording from "@/data/parisRecording.json";

export function RecordExhibit() {
	const [layer, setLayer] = useState(24);
	const id = useId();
	const row = recording.layers[layer];
	const probability = Math.exp(row.logprob) * 100;
	return <figure className="record-exhibit">
		<figcaption className="voice-evidence text-xs tracking-widest">ONE EXECUTION, LEFT AS EVIDENCE · GEMMA 3 4B</figcaption>
		<p className="voice-editorial record-prompt">“The capital of France is”</p>
		<p className="voice-system text-sm opacity-70">Follow the recorded readout for token #9079 — “ Paris” in the capture study.</p>
		<div className="record-bars" aria-hidden="true">
			{recording.layers.map(item => <div key={item.layer} data-selected={item.layer === layer}>
				{/* Keep CSS percentages within browser serialization precision; retain full precision in the evidence. */}
				<span style={{ height: `${Number((Math.exp(item.logprob) * 100).toFixed(4))}%` }} />
			</div>)}
		</div>
		<div className="flex justify-between voice-evidence text-xs opacity-60"><span>L0</span><span>RECORDED PROBABILITY · 0–100%</span><span>L33</span></div>
		<label htmlFor={id} className="voice-evidence block text-sm mt-8 mb-3">INSPECT DEPTH · L{layer} · FFN WRITE</label>
		<input id={id} type="range" min={0} max={33} value={layer} onChange={event => setLayer(Number(event.target.value))} aria-valuetext={`Layer ${layer}, FFN write`} className="record-scrubber" />
		<div className="flex flex-wrap gap-3 mt-4" aria-label="Recorded checkpoints">
			{[0, 24, 26, 33].map(value => <button key={value} type="button" aria-pressed={layer === value} className="record-checkpoint voice-evidence" onClick={() => setLayer(value)}>L{value}{value === 0 ? " · EARLY" : value === 33 ? " · FINAL" : ""}</button>)}
		</div>
		<dl className="record-readout" aria-live="polite" aria-atomic="true">
			<div><dt>Token rank</dt><dd>{row.rank.toLocaleString("en-GB")}</dd></div>
			<div><dt>Lens probability</dt><dd>{probability < 0.01 ? "<0.01" : probability.toFixed(2)}<small>%</small></dd></div>
			<div><dt>Carrier norm · L2</dt><dd>{row.norm.toFixed(2)}</dd></div>
			<div><dt>Applied-write norm · L2</dt><dd>{row.delta_norm.toFixed(2)}</dd></div>
		</dl>
		<p className="voice-system leading-relaxed max-w-2xl">Rank 1 at layer 24. Almost 100% at layer 26. Back to 80% at the final layer. A readout can strengthen, then weaken. The record lets you return to each write.</p>
		<details className="record-provenance">
			<summary className="voice-evidence text-xs">READ THE PROVENANCE & SCOPE</summary>
			<p>Recorded {new Date(recording.identity.started_unix_ms).toISOString().slice(0, 10)} · production CPU · final prompt position {recording.position} · head-v1 lens. {recording.writes} carrier writes, {recording.readouts} readouts, {recording.receipt.events.toLocaleString("en-GB")} events. Hardware model is not recorded.</p>
			<p>Stored BF16; the production image also pins Q8 requantisation for 103 operands. A representation label alone does not describe the arithmetic.</p>
			<p>Prompt text, model name and token spelling come from the capture study. The JSONL stores token IDs and model identity. Probability is exp(recorded log p); this is a lens readout, not generated output or a causal claim.</p>
			<p className="break-all">Run: {recording.identity.run_id}<br />File SHA-256: {recording.sha256}</p>
		</details>
		<div className="record-links voice-evidence text-xs">
			<a href="https://larql-observatory.fly.dev/">OPEN IN OBSERVATORY →</a>
			<a href="/recordings/gemma-paris-v3.jsonl" download>DOWNLOAD ORIGINAL JSONL ↓</a>
			<a href={`https://github.com/chrishayuk/larql/blob/${recording.commit}/observatory/V3-BRIDGE.md`}>SOURCE & REPLAY CONTRACT ↗</a>
		</div>
		<p className="voice-system text-xs opacity-70 mt-4">In Observatory, choose “Open Paris recording”, or open the downloaded JSONL. This exhibit reads a checked excerpt; Observatory validates and replays the original record. Neither runs inference.</p>
	</figure>;
}
