/**
 * INGEST THE SPECIFICATION — the corpus behind Ask.
 *
 * Reads current guides, the candidate contract and dated evidence from
 * the larql checkout. Exports machine-derived facts and source hashes
 * alongside the corpus. --check verifies both against that checkout.
 *
 *   npx tsx scripts/ingest-spec.ts [path-to-larql]
 *
 * The corpus is server-side only — retrieval happens in /api/explain,
 * where the spec can answer in its own words (verbatim, attributed)
 * before any model is consulted, and where the synthesis tier receives
 * passages as part of its bounded fact bundle. The graph remains the
 * typed authority; the corpus adds the documents' own sentences as
 * retrievable evidence.
 */

import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { recordingSnapshot } from "./recording-snapshot";

const args = process.argv.slice(2);
const CHECK = args.includes("--check");
const LARQL = resolve(args.find((arg) => !arg.startsWith("--")) ?? process.env.LARQL_DIR ?? "../../larql");

const SOURCES = [
	{ file: "docs/vindex3/status.md", doc: "vindex3/status.md", source: "current implementation scope" },
	{ file: "docs/vindex3/what-is-vindex3.md", doc: "vindex3/what-is-vindex3.md", source: "current overview" },
	{ file: "docs/vindex3/execution.md", doc: "vindex3/execution.md", source: "current execution" },
	{ file: "docs/vindex3/representation.md", doc: "vindex3/representation.md", source: "current representation tooling" },
	{ file: "docs/measure-plan-2.md", doc: "measure-plan-2.md", source: "plan measurement and AUTO-REP implementation record" },
	{ file: "docs/measure-plan-3.md", doc: "measure-plan-3.md", source: "the frozen AUTO-REP campaign protocol (not a result)" },
	{ file: "crates/larql-kv/README.md", doc: "larql-kv/README.md", source: "current continuation providers" },
	{ file: "docs/vindex3/observation-and-intervention.md", doc: "vindex3/observation-and-intervention.md", source: "current observation and intervention" },
	{ file: "observatory/V3-BRIDGE.md", doc: "observatory/V3-BRIDGE.md", source: "canonical recording replay contract and Paris golden" },
	{ file: "docs/vindex3/plugins.md", doc: "vindex3/plugins.md", source: "current plugin contract" },
	{ file: "docs/vindex3/runtime-followups.md", doc: "vindex3/runtime-followups.md", source: "current runtime boundaries" },
	{ file: "docs/v3-obs-1-carrier-observation.md", doc: "v3-obs-1-carrier-observation.md", source: "the dated carrier-observation evidence record" },
	{ file: "docs/adr/0027-vindex3-single-container-shape.md", doc: "adr/0027-vindex3-single-container-shape.md", source: "the single-container decision (execution pending)" },
	{ file: "docs/vindex3-format.md", doc: "vindex3-format.md", source: "the living spec" },
	{ file: "crates/larql-vindex/docs/vindex3-format-spec.md", doc: "vindex3-format-spec.md", source: "the ABI" },
	{ file: "docs/vindex3-experiments.md", doc: "vindex3-experiments.md", source: "the pre-registered programme" },
	{ file: "docs/vindex-generation-policy.md", doc: "vindex-generation-policy.md", source: "the generation policy" },
];

type Passage = { id: string; source: string; doc: string; heading: string; text: string };

const MAX_PASSAGE = 1600;
const MIN_BODY = 80;

function chunk(markdown: string, source: string, doc: string): Passage[] {
	const lines = markdown.split("\n");
	const passages: Passage[] = [];
	let heading = "(preamble)";
	let body: string[] = [];
	let n = 0;

	const flush = () => {
		const text = body.join("\n").trim();
		body = [];
		if (text.length < MIN_BODY) return;
		// Long sections split on paragraph boundaries into parts.
		let rest = text;
		let part = 0;
		while (rest.length > 0) {
			let cut = rest.length <= MAX_PASSAGE ? rest.length : rest.lastIndexOf("\n\n", MAX_PASSAGE);
			if (cut <= 0) cut = Math.min(rest.length, MAX_PASSAGE);
			const slice = rest.slice(0, cut).trim();
			rest = rest.slice(cut).trim();
			if (slice.length < MIN_BODY) continue;
			part += 1;
			n += 1;
			passages.push({
				id: `${doc}#${n}`,
				source,
				doc,
				heading: part > 1 ? `${heading} (${part})` : heading,
				text: slice,
			});
		}
	};

	for (const line of lines) {
		const h = line.match(/^#{1,3}\s+(.*)$/);
		if (h) {
			flush();
			heading = h[1].trim();
		} else {
			body.push(line);
		}
	}
	flush();
	return passages;
}

const all: Passage[] = [];
const hashes: Record<string, string> = {};
for (const src of SOURCES) {
	const text = readFileSync(join(LARQL, src.file), "utf8");
	hashes[src.file] = createHash("sha256").update(text).digest("hex");
	const passages = chunk(text, src.source, src.doc);
	console.log(`${src.doc}: ${passages.length} passages`);
	all.push(...passages);
}

// Use the upstream exporter, not a second hand-maintained schema/version list.
const temporary = mkdtempSync(join(tmpdir(), "vindex3-facts-"));
let facts;
try {
	const path = join(temporary, "facts.json");
	execFileSync("python3", [join(LARQL, "scripts/current_facts.py"), "--export", path]);
	facts = JSON.parse(readFileSync(path, "utf8"));
} finally {
	rmSync(temporary, { recursive: true });
}
const out = {
	generated: execFileSync("git", ["-C", LARQL, "show", "-s", "--format=%cs", "HEAD"], { encoding: "utf8" }).trim(),
	provenance: { git_commit: facts.provenance.git_commit, dirty: facts.provenance.dirty, source_sha256: hashes },
	sources: Object.fromEntries(SOURCES.map((s) => [s.doc, s.file])),
	documents: SOURCES.map((s) => s.doc),
	passages: all,
};
for (const [path, data] of [["src/data/specCorpus.json", out], ["src/data/larqlFacts.json", facts]] as const) {
	const serialized = JSON.stringify(data, null, 1) + "\n";
	if (CHECK) {
		if (readFileSync(path, "utf8") !== serialized) throw new Error(`${path} is stale; run npm run sync:larql -- ${LARQL}`);
	} else writeFileSync(path, serialized);
}
recordingSnapshot(LARQL, facts.provenance.git_commit, CHECK);
console.log(`${CHECK ? "Checked" : "Updated"} corpus, facts and canonical recording at ${facts.provenance.git_commit}${facts.provenance.dirty ? " (local work — dirty checkout)" : ""}`);
