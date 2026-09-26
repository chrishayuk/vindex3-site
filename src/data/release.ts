import facts from "./larqlFacts.json";

/**
 * WHAT THE PRODUCT CURRENTLY IS.
 *
 * One record, because the drift it replaces was real: on 2026-09-02
 * the footer still linked vindex-v0.5.0 on every page while Get
 * Started and the Explorer had both moved to 0.8.0. A site whose whole
 * argument is provenance cannot cite three different current versions
 * of itself, and hand-authoring the number page by page guarantees it
 * eventually will.
 *
 * Distinct from `build.ts`, which records what THIS SITE was built
 * from. This records what VINDEX3 and the vindex CLI are.
 *
 * The published CLI record stays pinned to its release. Schema and source
 * identity come from LARQL's facts exporter; package versions are not
 * release-availability evidence. Review the publication record separately.
 */

const LARQL_REPO = "https://github.com/chrishayuk/larql";

export const RELEASE = {
	/** The published `vindex` CLI. */
	cli: {
		version: "0.8.0",
		tag: "vindex-v0.8.0",
		released: "2026-09-02",
		href: `${LARQL_REPO}/releases/tag/vindex-v0.8.0`,
	},
	/** The specification the site documents. */
	spec: {
		status: "Candidate",
		version: "3.0",
		/** `GRAPH_SCHEMA` — the container's system graph. */
		graphSchema: facts.constants.GRAPH_SCHEMA,
		/** `PLAN_SCHEMA` — an architecture-support verdict. */
		planSchema: facts.constants.PLAN_SCHEMA,
	},
	/** Source checkout reviewed by the site; independent of the published CLI. */
	larql: {
		commit: facts.provenance.git_commit,
		href: `${LARQL_REPO}/commit/${facts.provenance.git_commit}`,
	},
} as const;

/** "V0.8.0 · RELEASED" — the Explorer's transport badge. */
export function cliBadge(): string {
	return `V${RELEASE.cli.version} · RELEASED`;
}

/** "The release" link, pointed at the version that actually is current. */
export function releaseLink(): { href: string; label: string; external: true } {
	return {
		href: RELEASE.cli.href,
		label: `The release · vindex ${RELEASE.cli.version}`,
		external: true,
	};
}

/** Repository capabilities are not a claim about published binary availability. */
export const CURRENT = {
 reviewed: "2026-09-27",
 facts,
 commit: facts.provenance.git_commit,
 label: facts.provenance.dirty ? "LOCAL WORK · DIRTY CHECKOUT" : "SOURCE CHECKOUT",
} as const;

export function sourceLink(path: string): string {
 return `${LARQL_REPO}/blob/${CURRENT.commit}/${path}`;
}
