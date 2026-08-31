/**
 * WHAT THIS BUILD WAS MADE FROM.
 *
 * The deploy passes the commit and the build date in as Docker build
 * args (Dockerfile · .github/workflows/deploy.yml) and Next inlines
 * them. A local build is given neither — and an identifier that does
 * not exist is absent rather than guessed, so `npm run dev` simply
 * shows nothing where production shows its commit.
 */

const COMMIT = process.env.NEXT_PUBLIC_COMMIT?.trim() || null;
const BUILT = process.env.NEXT_PUBLIC_BUILT?.trim() || null;
const REPO = "https://github.com/chrishayuk/vindex3-site";

export const BUILD = COMMIT
	? { commit: COMMIT, short: COMMIT.slice(0, 7), built: BUILT, href: `${REPO}/commit/${COMMIT}` }
	: null;

/** The build, as provenance identifiers — an empty list when the build did not say. */
export function buildIdentifiers(): { label: string; value: string; href?: string }[] {
	if (!BUILD) return [];
	return [
		{ label: "site build", value: BUILD.short, href: BUILD.href },
		...(BUILD.built ? [{ label: "built", value: BUILD.built }] : []),
	];
}

/** One line for the chrome: " · build 8f42ae1 · 2026-08-31", or nothing. */
export function buildNote(): string {
	if (!BUILD) return "";
	return ` · build ${BUILD.short}${BUILD.built ? ` · ${BUILD.built}` : ""}`;
}
