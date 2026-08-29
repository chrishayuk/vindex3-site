/**
 * INGEST THE SPECIFICATION — the corpus behind Ask.
 *
 * Reads the four public VINDEX3 documents from the larql checkout,
 * chunks them by heading into passages, and writes the committed
 * corpus (src/data/specCorpus.json). Run at dev time whenever the
 * specs change:
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

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LARQL = process.argv[2] ?? process.env.LARQL_DIR ?? "../larql-public-explorer";

const SOURCES = [
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
for (const src of SOURCES) {
	const text = readFileSync(join(LARQL, src.file), "utf8");
	const passages = chunk(text, src.source, src.doc);
	console.log(`${src.doc}: ${passages.length} passages`);
	all.push(...passages);
}

const out = {
	generated: new Date().toISOString().slice(0, 10),
	documents: SOURCES.map((s) => s.doc),
	passages: all,
};
writeFileSync("src/data/specCorpus.json", JSON.stringify(out, null, 1));
console.log(`corpus: ${all.length} passages → src/data/specCorpus.json`);
