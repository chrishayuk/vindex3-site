import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// @chrishayuk/hause ships raw .tsx/.ts source (no build step of its own),
	// so Next has to compile it itself rather than treating it as pre-built
	// node_modules. See .npmrc's install-links for why this isn't a symlink.
	transpilePackages: ["@chrishayuk/hause"],
};

export default nextConfig;

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
