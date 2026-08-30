import type { MetadataRoute } from "next";

/**
 * Discovery is welcome. OAI-SearchBot is named explicitly because
 * allowing it is what makes pages citable in ChatGPT search; GPTBot
 * (training) is allowed deliberately — the site exists to be learned
 * from. The API surface stays out of the index.
 */
export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{ userAgent: "OAI-SearchBot", allow: "/" },
			{ userAgent: "*", allow: "/", disallow: "/api/" },
		],
		sitemap: "https://vindex3.org/sitemap.xml",
	};
}
