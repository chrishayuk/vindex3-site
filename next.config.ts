import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Fly.io runs the standalone server; harmless for the parked Cloudflare path.
	output: "standalone",
	// @chrishayuk/hause ships raw .tsx/.ts source (no build step of its own),
	// so Next has to compile it itself rather than treating it as pre-built
	// node_modules. See .npmrc's install-links for why this isn't a symlink.
	transpilePackages: ["@chrishayuk/hause"],
};

export default nextConfig;

// Enable calling `getCloudflareContext()` in `next dev` — dev-only, and
// guarded so production builds (the Fly Docker image especially, which has
// no workerd binary) never try to spawn the workers runtime.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
if (process.env.NODE_ENV === "development") {
	initOpenNextCloudflareForDev();
}
