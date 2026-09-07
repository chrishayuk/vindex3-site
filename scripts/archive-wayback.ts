import {selectArchiveUrls, cdxCapture, mergeFirst} from "./wayback-policy";
/**
 * ARCHIVE THE CITABLE OBJECTS.
 *
 * Publish, commit, then ask an independent party to keep a copy. This
 * script is the third step: it asks the Internet Archive's Save Page
 * Now to capture the specification and each of its chapters, then reads
 * the Wayback index back to learn when each URL was FIRST captured, and
 * records the answer in src/data/archive.json for `citation.ts` to
 * carry as a provenance identifier.
 *
 * The first capture is the evidence. Everything here exists to record
 * it accurately and then leave it alone:
 *
 * - A capture already on file is never moved forward. An earlier one
 *   replaces it; a later one does not.
 * - A URL is never submitted unless the live site returns 200 for it.
 *   Asking a public archive to preserve a 404 puts a broken copy of the
 *   specification on someone else's servers, permanently.
 * - Nothing is invented. A URL with no capture gets no entry, and the
 *   page that would have shown it shows nothing.
 *
 * Modes:
 *
 *   resolve-only  Read the public CDX index and record what already
 *                 exists. Submits nothing, needs no credentials. The
 *                 default when no credentials are set.
 *   submit        Also ask Save Page Now for captures that are missing
 *                 or stale. Needs IA_ACCESS_KEY and IA_SECRET_KEY —
 *                 Internet Archive S3-style keys from
 *                 https://archive.org/account/s3.php. Save Page Now
 *                 rejects anonymous requests.
 *
 * Usage: tsx scripts/archive-wayback.ts [--resolve-only] [--stale-days N] [--url URL] [--limit N]
 */

import { readFile, writeFile } from "node:fs/promises";
import type { Capture } from "../src/data/archive";
import { archiveUrl } from "../src/data/archive";
import { CITABLE_SLUGS } from "../src/data/citation";

const CDX = "https://web.archive.org/cdx/search/cdx";
const SPN = "https://web.archive.org/save";
const FILE = new URL("../src/data/archive.json", import.meta.url);
const UA = "vindex3.org archive-wayback (+https://vindex3.org/cite)";

const argv = process.argv.slice(2);
const flag = (name: string) => argv.includes(`--${name}`);
const value = (name: string) => { const i = argv.indexOf(`--${name}`); return i >= 0 ? argv[i + 1] : undefined; };
const values = (name: string) => argv.flatMap((a, i) => (a === `--${name}` && argv[i + 1] ? [argv[i + 1]] : []));

const ACCESS = process.env.IA_ACCESS_KEY?.trim();
const SECRET = process.env.IA_SECRET_KEY?.trim();
const SUBMIT = Boolean(ACCESS && SECRET) && !flag("resolve-only");
const STALE_DAYS = Number(value("stale-days") ?? 30);
const LIMIT = Number(value("limit") ?? 6);
if(!Number.isFinite(STALE_DAYS)||STALE_DAYS<0||!Number.isInteger(LIMIT)||LIMIT<0)throw new Error("Invalid archive limits");
const request = (url: string, init: RequestInit = {}) => fetch(url, {...init,signal:AbortSignal.timeout(15000)});

const deadline = Date.now() + 8 * 60_000;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const daysSince = (v: string) =>
	(Date.now() - Date.parse(`${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}T${v.slice(8, 10) || "00"}:${v.slice(10, 12) || "00"}:${v.slice(12, 14) || "00"}Z`)) / 86_400_000;

/**
 * A CDX lookup. `limit: 1` is the earliest capture; `-1` is the latest.
 *
 * The index rate-limits and times out under load, and a transient 504 must
 * never abort a run — the captures already resolved would go with it. Retry,
 * then give up on this one URL and leave the rest of the run intact. Giving
 * up returns null, which records nothing: silence, never a guess.
 */
async function cdx(url: string, limit: 1 | -1, attempt = 0): Promise<{ timestamp: string; digest: string } | null> {
	const query = new URLSearchParams({ url, output: "json", fl: "timestamp,digest", filter: "statuscode:200", limit: String(limit) });
	try {
		const response = await request(`${CDX}?${query}`, { headers: { "User-Agent": UA } });
		if (response.status === 429 || response.status >= 500) throw new Error(`CDX ${response.status}`);
		if (!response.ok) { console.log(`  cdx ${response.status} for ${url}`); return null; }
		const rows = JSON.parse((await response.text()) || "[]") as string[][];
		// Row 0 is the header. No data rows means the URL has never been captured.
		return cdxCapture(rows);
	} catch (error) {
		if (attempt < 2) { await sleep(2_000 * (attempt + 1)); return cdx(url, limit, attempt + 1); }
		console.log(`  cdx unavailable for ${url}: ${(error as Error).message}`);
		return null;
	}
}

/** Save Page Now: submit, then poll the job until it stops being pending. */
async function savePageNow(url: string, waited = 0): Promise<{ timestamp: string } | null> {
	const body = new URLSearchParams({ url,  skip_first_archive: "1", if_not_archived_within: `${STALE_DAYS}d` });
	const headers = { Authorization: `LOW ${ACCESS}:${SECRET}`, Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded", "User-Agent": UA };
	const response = await request(SPN, { method: "POST", headers, body });
	const started = (await response.json().catch(() => ({}))) as { job_id?: string; message?: string; status_ext?: string };
	if (!started.job_id) {
		// The session limit is a wait, not a failure — but a bounded one, so a
		// service that is saturated all evening cannot hang the deploy.
		if (started.status_ext?.includes("user-session-limit") && waited < 5) { await sleep(20_000); return savePageNow(url, waited + 1); }
		console.log(`  spn declined: ${started.message || started.status_ext || response.status}`);
		return null;
	}
	for (let attempt = 0; attempt < 40; attempt++) {
		await sleep(attempt === 0 ? 6_000 : 5_000);
		const poll = await request(`${SPN}/status/${started.job_id}`, { headers });
		const job = (await poll.json().catch(() => ({}))) as { status?: string; timestamp?: string; message?: string; status_ext?: string };
		if (job.status === "success" && job.timestamp) return { timestamp: job.timestamp };
		if (job.status === "error") { console.log(`  spn error: ${job.status_ext || job.message}`); return null; }
	}
	console.log("  spn timed out while pending");
	return null;
}

/** Never submit a URL the site does not actually serve. */
async function serves(url: string): Promise<boolean> {
	try {
		return (await request(url, { headers: { "User-Agent": UA }, redirect: "manual" })).status === 200;
	} catch { return false; }
}

// tsx compiles this package to CJS, which has no top-level await.
async function main() {
	const held: Record<string, Capture> = JSON.parse(await readFile(FILE, "utf8"));
	// The archived set is exactly the citable set: the specification, its
	// chapters, and the citation policy itself.
	const urls = selectArchiveUrls(["/3.0", ...CITABLE_SLUGS, "/cite", ""].map(archiveUrl), values("url"));
	console.log(`${urls.length} citable URLs · ${SUBMIT ? "submitting" : "resolve-only"}${SUBMIT ? "" : ACCESS ? " (--resolve-only)" : " (no IA credentials)"}`);

	let submitted = 0, recorded = 0, moved = 0;

	/**
	 * One URL: ask for a capture if it is due, then record when it was FIRST
	 * captured. The only write that can change a date already on file is the
	 * final comparison, and it can only ever move the date earlier.
	 */
	async function archive(url: string) {
		const existing = held[url];
		// A first capture is immutable once known, so a URL already on file only
		// needs its most recent capture checked for staleness.
		const latest = SUBMIT ? await cdx(url, -1) : null;
		const stale = !latest || daysSince(latest.timestamp) > STALE_DAYS;

		if (SUBMIT && stale && submitted < LIMIT) {
			if (await serves(url)) {
				console.log(`→ ${url}${latest ? ` (last ${latest.timestamp})` : " (never captured)"}`);
				const saved = await savePageNow(url);
				submitted++;
				if (saved) console.log(`  saved ${saved.timestamp}; waiting for CDX confirmation of the first capture`);
				await sleep(2_000);
			} else {
				console.log(`✗ ${url} does not serve 200 — not submitted`);
			}
		}

		const first = await cdx(url, 1);
		if (!first) return;
		const entry = { first: first.timestamp, ...(first.digest ? { digest: first.digest } : {}) };
		if (!existing) { held[url] = mergeFirst(held[url], entry); recorded++; console.log(`+ ${url} first captured ${first.timestamp}`); }
		else if (first.timestamp < existing.first) { held[url] = mergeFirst(held[url], entry); moved++; console.log(`← ${url} earlier capture found: ${first.timestamp} (was ${existing.first})`); }
		await sleep(300);
	}

	try {
		for (const url of urls) {
   if(Date.now()>deadline){console.warn("Archive time budget reached; keeping confirmed results for the next run.");break;}
			// One unreachable URL must not cost the run every capture after it.
			try { await archive(url); }
			catch (error) { console.log(`  skipped ${url}: ${(error as Error).message}`); }
		}
	} finally {
		// Whatever went wrong, the captures resolved so far are evidence and
		// get written. Losing them to a transient 504 would mean re-asking a
		// public service for facts it has already given us.
		const sorted = Object.fromEntries(Object.keys(held).sort().map((url) => [url, held[url]]));
		await writeFile(FILE, `${JSON.stringify(sorted, null, "\t")}\n`);
		console.log(`\n${Object.keys(sorted).length} URLs with a first capture on file · ${recorded} new · ${moved} corrected earlier · ${submitted} submitted`);
	}
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
