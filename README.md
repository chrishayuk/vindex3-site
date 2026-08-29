# vindex3.org

The VINDEX3 specification, as an exhibition — not "docs with nicer CSS." The canonical spec (in `chris-source/larql`) stays authoritative; this is a second, explorable representation of it, built on HAUSE.

## Stack

Same as [chrishayuk](../chrishayuk): Next.js 16 on Cloudflare Workers via `@opennextjs/cloudflare`, Tailwind v4, HAUSE for tokens/primitives.

**HAUSE is its own repo**, [github.com/chrishayuk/hause](https://github.com/chrishayuk/hause) (package `@chrishayuk/hause`), not copied into this project — installed as `"@chrishayuk/hause": "github:chrishayuk/hause"`, plus `transpilePackages: ["@chrishayuk/hause"]` in `next.config.ts` (it ships raw source, no build step of its own). See `../chrishayuk/DESIGN.md`'s Architecture section for the reasoning, and for the local-`file:`-dependency trick used when actively co-developing HAUSE itself rather than consuming a pushed version of it.

## Status

First real exhibit is live on the homepage — grounded in the actual spec (`crates/larql-vindex/docs/vindex3-format-spec.md` in `chris-source/larql`, version 3.0-draft-2), not the brainstormed section names from early conversation. Real content, not illustrative: the five durable weight classes, two actual measured results (the c8 round-trip gate, the W0 browsable-surface baseline), the real version history, and a real open tension pulled straight from the project's own generation-policy notes (production models already round-trip through VINDEX3, but the default extractor still writes VINDEX2).

**Scope, stated on the page itself**: this covers the MoE-serving container format (banks, LYRW v2, segments, execution profiles) from the crate-level spec. A second, broader in-progress specification exists (a system-graph architecture, codenamed "Glimmer") that isn't covered here yet — the two aren't simple duplicates and shouldn't be presented as one coherent structure without saying so.

Next: HAUSE gets a new primitive only when a specific piece of *this* content actually needs one — not before. HAUSE is discovered through making real exhibits, not designed as a taxonomy up front.

## Develop

```bash
npm run dev       # Next.js dev server
npm run build     # production build
npm run preview   # build with OpenNext, run under the real Workers runtime locally
npm run deploy    # build and deploy to Cloudflare Workers
```
