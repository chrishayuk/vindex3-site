import captures from "./archive.json";

/**
 * THE INDEPENDENT ARCHIVE.
 *
 * A publication date on vindex3.org is evidence only to someone who
 * already trusts vindex3.org. The same page, captured by the Internet
 * Archive, is the same claim held by a third party with no stake in
 * it — which is what a priority claim on a specification actually
 * needs. It corroborates the record; it does not become it. Captures
 * can be partial, assets can fail to preserve, and the Wayback Machine
 * is not a scholarly registry.
 *
 * One rule governs this file, and scripts/archive-wayback.ts enforces
 * it on the way in: FIRST capture, never latest. A recent snapshot says
 * the page still exists. The first one corroborates existence of that URL by that date, and
 * that is the only part a priority claim rests on. The value is
 * append-only — a date already recorded is never moved forward, because
 * moving it forward destroys the evidence it was recorded for.
 *
 * The archived set is exactly the citable set. `citation.ts` is
 * deliberate that the Explorer, Ask and the on-ramp are instruments
 * rather than claims, and citing an instrument cites nothing; there is
 * equally nothing for an archive to corroborate about one. What is
 * archived is the specification at its durable URL, every chapter that
 * belongs to it, and /cite itself — because a reference that points at
 * the citation policy should be able to show what that policy said.
 */

export type Capture = {
	/** Wayback's capture stamp, YYYYMMDDHHMMSS, UTC. The first one. */
	first: string;
	/** The CDX content digest at that capture, where the record carried one. */
	digest?: string;
};

const SITE = "https://vindex3.org";
const CAPTURES: Record<string, Capture> = captures;
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/** A path as the absolute URL an archive is given. Chapters arrive from citation.ts. */
export const archiveUrl = (path: string) => `${SITE}${path || "/"}`;

/** Wayback's stamp as an ISO date — 20260904001043 becomes 2026-09-04. */
export const captureDate = (s: string) => `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;

/** "4 SEP 2026" — the evidence voice the Provenance row prints. */
export const captureVoice = (s: string) => `${Number(s.slice(6, 8))} ${MONTHS[Number(s.slice(4, 6)) - 1]} ${s.slice(0, 4)}`;

/** The replay URL: the archived copy of that page, at that instant. */
export const captureUrl = (url: string, s: string) => `https://web.archive.org/web/${s}/${url}`;

/** The first capture of a URL, or null where there is none. */
export function firstCapture(url: string): (Capture & { url: string; date: string }) | null {
	const capture = CAPTURES[url];
	return capture ? { ...capture, url: captureUrl(url, capture.first), date: captureDate(capture.first) } : null;
}

/**
 * The archive as a provenance identifier, for a record's `identifiers`.
 * Absent where nothing has been captured — an identifier that does not
 * exist is absent, never a placeholder, and never "capture pending".
 */
export function archiveIdentifiers(url: string): { label: string; value: string; href?: string }[] {
	const capture = firstCapture(url);
	if (!capture) return [];
	return [{ label: "independent archive", value: `Internet Archive · ${captureVoice(capture.first)}`, href: capture.url }];
}
