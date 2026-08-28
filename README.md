# vindex3.org

The VINDEX3 specification, as an exhibition — not "docs with nicer CSS." The canonical spec (in `chris-source/larql`) stays authoritative; this is a second, explorable representation of it, built on HOUSE.

## Stack

Same as [chrishayuk](../chrishayuk): Next.js 16 on Cloudflare Workers via `@opennextjs/cloudflare`, Tailwind v4, HOUSE for tokens/primitives.

**HOUSE is its own repo**, [github.com/chrishayuk/house](https://github.com/chrishayuk/house) (package `@chrishayuk/house`), not copied into this project — installed as `"@chrishayuk/house": "github:chrishayuk/house"`, plus `transpilePackages: ["@chrishayuk/house"]` in `next.config.ts` (it ships raw source, no build step of its own). See `../chrishayuk/DESIGN.md`'s Architecture section for the reasoning, and for the local-`file:`-dependency trick used when actively co-developing HOUSE itself rather than consuming a pushed version of it.

## Status

Scaffold only. No real spec content yet — the homepage is a placeholder proving the HOUSE wiring works, not a real exhibit. The actual VINDEX3 spec (`crates/larql-vindex/docs/vindex3-format-spec.md` in `chris-source/larql`) needs a deliberate content pass before this becomes real: the spec's actual structure (§1–§16, directory layout, LYRW v2 format, five weight classes, execution profiles/fidelity) is substantially different from early brainstormed section names — ground any new content in the real spec, not assumed terminology.

## Develop

```bash
npm run dev       # Next.js dev server
npm run build     # production build
npm run preview   # build with OpenNext, run under the real Workers runtime locally
npm run deploy    # build and deploy to Cloudflare Workers
```
