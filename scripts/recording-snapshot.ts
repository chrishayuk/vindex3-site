import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";

/** Copy the canonical bytes unchanged; derive the exhibit only from those bytes. */
export function recordingSnapshot(root: string, commit: string, check: boolean) {
	const source = "observatory/public/recordings/gemma-paris-v3.jsonl";
	const raw = readFileSync(join(root, source), "utf8");
	const sha256 = (text: string) => createHash("sha256").update(text).digest("hex");
	const golden = JSON.parse(readFileSync(join(root, "observatory/tests/golden/gemma-paris-v3.expected.json"), "utf8"));
	assert.equal(sha256(raw), golden.source_sha256, "Recording must match the upstream frozen golden");
	const lines = raw.trimEnd().split("\n");
	const { header } = JSON.parse(lines[0]);
	const { receipt } = JSON.parse(lines.at(-1)!);
	const events = lines.slice(1, -1).map(line => JSON.parse(line));
	assert.equal(sha256(lines.slice(1, -1).join("\n") + "\n"), receipt.log_sha256);
	assert.equal(receipt.provenance_fingerprint, header.provenance_fingerprint);
	assert.equal(receipt.complete, true);
	assert.equal(events.length, receipt.events);
	assert.equal(events.length, golden.events);
	events.forEach((event, index) => assert.equal(event.sequence, index));
	const writes = events.filter(event => event.kind === "carrier_write");
	const readouts = events.filter(event => event.kind === "readout");
	assert.equal(writes.length, golden.writes);
	assert.equal(readouts.length, golden.readouts);
	for (const checkpoint of golden.checkpoints) {
		for (const key of ["stats", "write", "lens"]) {
			if (checkpoint[key]) assert.deepEqual(events[checkpoint[key].sequence], checkpoint[key]);
		}
	}
	const position = 5;
	const token = 9079;
	const layers = readouts.filter(event => event.position === position && event.site === "ffn").map(event => {
		const stats = events.find(item => item.kind === "carrier_stats" && item.position === position && item.layer === event.layer && item.site === event.site);
		assert.ok(writes.some(item => item.position === position && item.layer === event.layer && item.site === event.site));
		assert.ok(stats);
		const target = event.tokens.find((item: { id: number }) => item.id === token);
		assert.ok(target);
		assert.equal(event.method, "head-v1");
		return { layer: event.layer, norm: stats.norm, delta_norm: stats.delta_norm, rank: target.rank, logprob: target.logprob };
	});
	assert.equal(layers.length, 34);
	layers.forEach((row, index) => assert.equal(row.layer, index));
	const snapshot = { source, commit, sha256: sha256(raw), identity: header.identity, provenance: header.provenance, receipt, writes: writes.length, readouts: readouts.length, position, token, layers };
	const outputs = [
		["public/recordings/gemma-paris-v3.jsonl", raw],
		["src/data/parisRecording.json", JSON.stringify(snapshot, null, 2) + "\n"],
	] as const;
	if (!check) mkdirSync("public/recordings", { recursive: true });
	for (const [path, content] of outputs) {
		if (check) assert.equal(readFileSync(path, "utf8"), content, `${path} is stale`);
		else writeFileSync(path, content);
	}
}
