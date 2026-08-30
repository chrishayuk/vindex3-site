import type { MetadataRoute } from "next";
import { CANON, ENTITIES } from "@/data/vindexGraph";
import { askSlug, conceptSlug } from "@/data/legibility";

const BASE = "https://vindex3.org";

/**
 * Every route the graph knows about: the eleven chapters, the two
 * interactive surfaces, the on-ramp — and the graph's own projections,
 * one URL per canonical answer and per concept entity.
 */
export default function sitemap(): MetadataRoute.Sitemap {
	const pages = [
		"",
		"/why",
		"/anatomy",
		"/quantization",
		"/discovery",
		"/container",
		"/graph",
		"/bytes",
		"/execution",
		"/representation",
		"/authority",
		"/lifecycle",
		"/ladder",
		"/ask",
		"/explorer",
		"/get-started",
		"/concepts",
	].map((p) => ({ url: `${BASE}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8 }));
	const answers = CANON.map((c) => ({
		url: `${BASE}/ask/${askSlug(c.id)}`,
		changeFrequency: "weekly" as const,
		priority: 0.6,
	}));
	const concepts = ENTITIES.map((e) => ({
		url: `${BASE}/concepts/${conceptSlug(e.id)}`,
		changeFrequency: "weekly" as const,
		priority: 0.6,
	}));
	return [...pages, ...answers, ...concepts];
}
