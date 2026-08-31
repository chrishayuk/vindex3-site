/**
 * THE CORPUS — the specification, retrievable.
 *
 * Server-side only (imported by /api/explain and the coverage suite,
 * never by client components — the 150K of spec text stays out of the
 * bundle). Retrieval is deterministic keyword scoring: unique question
 * tokens, heading hits weighted over body hits, exact-phrase bonus.
 * No embeddings, no model — the spec answering in its own words is a
 * lookup, not an inference.
 */

import corpusJson from "./specCorpus.json";

export type SpecPassage = { id: string; source: string; doc: string; heading: string; text: string };

const CORPUS = corpusJson as { generated: string; documents: string[]; passages: SpecPassage[] };

const STOP = new Set([
	"the", "a", "an", "is", "are", "was", "it", "its", "of", "to", "in", "on", "and", "or", "for",
	"with", "does", "do", "can", "i", "my", "me", "from", "that", "this", "there", "be", "just",
	"about", "what", "why", "how", "when", "which", "who", "not", "no", "as", "by", "at", "if",
	"vindex3", "vindex", "mean", "means", "work", "works",
]);

function tokens(q: string): string[] {
	return [...new Set(q.toLowerCase().split(/[^a-z0-9._-]+/).filter((t) => t.length > 2 && !STOP.has(t)))];
}

const index = CORPUS.passages.map((p) => ({
	p,
	heading: p.heading.toLowerCase(),
	body: p.text.toLowerCase(),
}));

/**
 * One passage by document and section number — for a page that quotes a
 * specific clause rather than searching for one. Keyed on the section
 * heading, never on the passage's position: a re-ingest reorders ids,
 * and a chapter must not silently start quoting a different clause.
 * Throws when the section is gone, so the spec moving under a page
 * fails the build rather than the reader.
 */
export function specSection(doc: string, section: string): SpecPassage {
	const hit = CORPUS.passages.find((p) => p.doc === doc && p.heading.startsWith(`${section} `));
	if (!hit) throw new Error(`${doc} §${section} is not in the corpus — the page quoting it must be updated with the spec.`);
	return hit;
}

export function searchCorpus(question: string, k = 4): { passage: SpecPassage; score: number }[] {
	const qToks = tokens(question);
	if (qToks.length === 0) return [];
	const ql = question.toLowerCase().trim().replace(/[?.!]+$/, "");
	const scored = index.map(({ p, heading, body }) => {
		let score = 0;
		for (const t of qToks) {
			if (heading.includes(t)) score += 3;
			if (body.includes(t)) score += 1;
		}
		// A whole phrase appearing verbatim is the strongest signal.
		if (ql.length > 12 && (body.includes(ql) || heading.includes(ql))) score += 6;
		return { passage: p, score };
	});
	scored.sort((a, b) => b.score - a.score);
	return scored.slice(0, k).filter((s) => s.score > 0);
}

/** Whether the top hits are decisive enough to answer with verbatim
 * spec text and no model: most question tokens land, some in headings. */
export function strongHit(question: string, hits: { score: number }[]): boolean {
	const n = tokens(question).length;
	if (n === 0 || hits.length === 0) return false;
	return hits[0].score >= Math.max(4, n + 2);
}

export const CORPUS_META = { generated: CORPUS.generated, documents: CORPUS.documents, passages: CORPUS.passages.length };
