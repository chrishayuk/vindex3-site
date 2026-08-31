import type { MetadataRoute } from "next";
import { CANON, ENTITIES } from "@/data/vindexGraph";
import { QWEN } from "@/data/qwen38";
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
		"/3.0",
		"/why",
		"/anatomy",
		"/quantization",
		"/discovery",
		"/represent",
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
		"/cite",
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
	const models = [QWEN.slug].map((slug) => ({
		url: `${BASE}/models/${slug}`,
		changeFrequency: "weekly" as const,
		priority: 0.7,
	}));
	return [...pages, ...answers, ...concepts, ...models];
}
