/**
 * The legibility projections — slugs and metadata derived from the
 * knowledge graph, shared by the sitemap, the concept pages, and the
 * canonical answer pages. One graph, every surface.
 */

/** q-what-is-vindex3 → what-is-vindex3 */
export function askSlug(canonId: string): string {
	return canonId.replace(/^q-/, "");
}

/** Entity ids are already kebab-ish; normalise underscores. */
export function conceptSlug(entityId: string): string {
	return entityId.replace(/_/g, "-").toLowerCase();
}
