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
 * Every value here is read from the implementation, not remembered:
 *
 *   cli.version    crates/vindex-cli/Cargo.toml
 *   graphSchema    GRAPH_SCHEMA   (larql-vindex .../vindex3/graph/mod.rs)
 *   planSchema     PLAN_SCHEMA    (larql-vindex .../vindex3/plan/report.rs)
 *   larql.commit   origin/main
 *
 * When you bump one, bump it here and nowhere else.
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
		graphSchema: 6,
		/** `PLAN_SCHEMA` — an architecture-support verdict. */
		planSchema: 4,
	},
	/** The mainline this release was cut from. */
	larql: {
		commit: "8dae1223",
		href: `${LARQL_REPO}/commits/main`,
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
