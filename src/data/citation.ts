import { citationMeta, type CitationRecord } from "@chrishayuk/hause/cite";
import type { ProvenanceEvent } from "@chrishayuk/hause/components/forms/Provenance";
import { buildIdentifiers } from "./build";

/**
 * THE PUBLICATION RECORD.
 *
 * The site holds the facts; HAUSE holds the forms, the formatters and
 * the machine surfaces. One record per citable object, projected onto
 * the page (Provenance), the export (Citation), the head (citationMeta)
 * and the graph (citationLd) — so a reference to this specification
 * cannot disagree with the page it points at.
 *
 * Three rules govern this file:
 *
 * - `published` is FIRST publication. `revised` is set by hand when a
 *   chapter changes substantively — a revision is a decision, not a
 *   timestamp, and the publication date is what a priority claim rests
 *   on.
 * - No DOI appears here, because none has been registered. An
 *   identifier that does not exist is absent, never promised.
 * - Chapters cite through the specification they belong to: the
 *   canonical citable object is the version, not the website.
 */

const AUTHORS = ["Chris Hay"];
const SITE = "https://vindex3.org";
const PUBLISHER = "VINDEX3";
const VERSION = "3.0 Candidate";
const INDEPENDENCE = "Published independently by Chris Hay.";

/** The canonical citable object: the version, at its durable URL. */
export const SPEC: CitationRecord = {
	title: "VINDEX3 Specification",
	authors: AUTHORS,
	published: "2026-08-30",
	revised: "2026-08-31",
	version: VERSION,
	url: `${SITE}/3.0`,
	publisher: PUBLISHER,
	kind: "specification",
	abstract:
		"A self-describing, executable, queryable model container: one canonical graph shape, a contract stack, compatibility rules, and a per-layer operator program that surfaces and state follow. Promoted from draft to Candidate on 2026-08-30, carrying graph schema 6.",
	independence: INDEPENDENCE,
	about: ["model container format", "specification lifecycle", "conformance"],
	identifiers: [
		// What produced the page you are reading — present only in a deploy.
		...buildIdentifiers(),
		{ label: "graph schema", value: "6" },
		{
			label: "specification",
			value: "vindex3-format-spec.md",
			href: "https://github.com/chrishayuk/larql/blob/main/crates/larql-vindex/docs/vindex3-format-spec.md",
		},
		{
			label: "reference implementation",
			value: "github.com/chrishayuk/larql",
			href: "https://github.com/chrishayuk/larql",
		},
	],
};

/** Dated from the Record — when the work happened, not when a page was touched. */
export const SPEC_HISTORY: ProvenanceEvent[] = [
	{ date: "2026-08-31", text: "The hybrid rehearsal closes end-to-end: a mixed Mamba2 / conv-QKV-attention model executes through the generic runtime with no family lookup, and no schema change." },
	{ date: "2026-08-30", text: "3.0-candidate published — the promotion from draft. Graph schema 6 lands the same day with the four-architecture ontology drill." },
	{ date: "2026-08-22", text: "The semantic catch-up closes: full parity with the predecessor generation, gated cross-platform." },
	{ date: "2026-08-04", text: "The c8 gate closes: a real 26B-A4B layer reopens and verifies clean, 256 of 256 regions byte-identical." },
	{ date: "2026-08-01", text: "3.0-draft-2 published — three binary-layout corrections from the first LYRW v2 implementation." },
];

type Chapter = {
	/** The chapter's own name — the specification carries the subject. */
	title: string;
	/** First published at this URL. */
	published: string;
	/** Set when the chapter changed substantively; absent while it has not. */
	revised?: string;
	abstract: string;
};

/**
 * The citable chapters. Surfaces (the Explorer, Ask, the on-ramp) are
 * deliberately absent: they are instruments, not claims, and citing an
 * instrument cites nothing.
 */
const CHAPTERS: Record<string, Chapter> = {
	"/why": {
		title: "The Physics",
		published: "2026-08-29",
		revised: "2026-08-30",
		abstract: "What a model is made of, why it is hard to move, and why the file format is where the battle is actually fought.",
	},
	"/anatomy": {
		title: "The Anatomy",
		published: "2026-08-29",
		revised: "2026-08-30",
		abstract: "A layer, cut open: query, key, value, gate, up and down projections, residual streams, experts and routers — and one address, all the way down.",
	},
	"/quantization": {
		title: "Quantization",
		published: "2026-08-30",
		revised: "2026-08-31",
		abstract: "How quantization actually works: BF16, NVFP4, shared scales, effective bits per weight, mixed precision, precision maps, and measured quality.",
	},
	"/discovery": {
		title: "Discovering the Map",
		published: "2026-08-30",
		revised: "2026-08-31",
		abstract: "Four pre-registered attempts to discover automatically which tensors deserve higher precision — and what each of them disproved.",
	},
	"/represent": {
		title: "REPRESENT",
		published: "2026-08-31",
		abstract: "Behaviour-contract search: declare the behaviour to preserve rather than choosing a quantization, and let the optimizer find the representation that holds it.",
	},
	"/container": {
		title: "The Container",
		published: "2026-08-29",
		revised: "2026-08-30",
		abstract: "Every layer of a container, explained — one directory, one root, the canonical graph shape and the five durable weight classes.",
	},
	"/graph": {
		title: "The System Graph",
		published: "2026-08-29",
		revised: "2026-08-30",
		abstract: "Components, logical objects and edges — the semantic IR a container carries, and how it is materialised.",
	},
	"/bytes": {
		title: "The Bytes",
		published: "2026-08-29",
		revised: "2026-08-30",
		abstract: "LYRW v2, the layer-weight binary format, explained to the byte — header, banks, segments, region schemas, entry table.",
	},
	"/execution": {
		title: "Execution",
		published: "2026-08-29",
		revised: "2026-08-31",
		abstract: "The execution surface, operand closure and the compiler boundary — how an encoded description becomes computation with zero architecture branches.",
	},
	"/representation": {
		title: "Representation",
		published: "2026-08-29",
		revised: "2026-08-30",
		abstract: "Region-set variants, the eligibility policy and the promotion ladder — selection, not conversion.",
	},
	"/authority": {
		title: "Authority",
		published: "2026-08-29",
		revised: "2026-08-30",
		abstract: "The four-authority invariant and the derived-authority fold — where truth comes from inside a container.",
	},
	"/lifecycle": {
		title: "The Lifecycle",
		published: "2026-08-30",
		abstract: "What a container can do over its life — bind, query, execute, trace, overlay, diff, compile, compact — and the guarantee each operation carries.",
	},
	"/ladder": {
		title: "The Record",
		published: "2026-08-29",
		revised: "2026-08-31",
		abstract: "The status instrument: the guarantees ladder, the gate ladders, the measured evidence, the history and the open questions, kept honestly in one place.",
	},
};

export const CITABLE_SLUGS = Object.keys(CHAPTERS);

/**
 * A chapter's record. Unknown slugs throw rather than degrade: a page
 * that offers a citation for a work this file does not hold would be
 * asserting a publication record that nobody wrote down.
 */
export function chapterRecord(slug: string): CitationRecord {
	const c = CHAPTERS[slug];
	if (!c) throw new Error(`No publication record for ${slug} — add it to src/data/citation.ts before citing it.`);
	return {
		title: c.title,
		authors: AUTHORS,
		published: c.published,
		...(c.revised ? { revised: c.revised } : {}),
		version: VERSION,
		url: `${SITE}${slug}`,
		publisher: PUBLISHER,
		kind: "page",
		abstract: c.abstract,
		independence: INDEPENDENCE,
		partOf: { title: "VINDEX3 Specification", url: `${SITE}/3.0`, version: VERSION },
		identifiers: buildIdentifiers(),
	};
}

/** The head surface, for a chapter's `metadata.other`. */
export function citeMeta(slug: string): Record<string, string | string[]> {
	return citationMeta(chapterRecord(slug));
}
