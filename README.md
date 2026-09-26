# vindex3.org

An explorable VINDEX3 exhibition, built with HAUSE. LARQL owns the candidate
specification, current implementation contracts and dated experimental records.
This site keeps those different kinds of evidence visible.

## Current review

Reviewed 2026-09-27 against LARQL `b4e029a35175b610943a36cb578fc32b160e472c`
(the locally fetched `origin/main`) and HAUSE
`60efcd6555bb688676944f891da1076f888ccda0`, the same library revision as the
local hause.design checkout. The original LARQL working branch was not changed.

- `/status` describes current capabilities, source-derived schemas and commands,
  AUTO-REP's gate boundary and remaining graph-container conformance work.
- `/3.0`, `/ladder`, `/container` and `/bytes` distinguish the normative graph
  direction from the legacy LYRW bank layout chosen by ADR-0027.
- Recorded commands and measurements retain their dates and tested scope.
  The 0.8.0 on-ramp still shows its original planner-schema-4 output.
- Ask ingests current guides, the candidate contract and named evidence records.
  Source hashes and the exact checkout commit are committed with the corpus.

## Stack and development

Next.js 16, React 19, Tailwind v4 and the HAUSE source package. Production runs
the standalone Next server on Fly.io (`fly.toml`, `Dockerfile`, deploy workflow).
The OpenNext/Cloudflare scripts are retained as an alternate path.

```bash
npm ci
npm run dev
npm test
npm run typecheck
npm run build
```

Read `AGENTS.md` and the installed Next.js documentation before changing code.

## Refresh LARQL evidence

Choose the intended source revision first: a working checkout may be on a feature
branch rather than the fetched mainline. Neither the package version nor these
exports establish published binary availability.

```bash
npm run sync:larql -- /path/to/larql-checkout
npm run check:larql -- /path/to/the-same-checkout
```

The default path is `../../larql`; `LARQL_DIR` can override it. The importer calls
LARQL's `scripts/current_facts.py --export` and regenerates
`src/data/larqlFacts.json` plus `src/data/specCorpus.json`. It records the commit,
dirty flag and SHA-256 of authority files and ingested documents. Dirty exports
are labelled local work. Corpus dates are source-commit dates, so checks are
reproducible. Review authored claims and `CURRENT.reviewed` separately;
regeneration does not constitute editorial review.

`src/data/release.ts` keeps the published CLI record separate from the generated
source snapshot. Do not update the release record just because Cargo.toml or a
command inventory changed. `src/data/build.ts` separately identifies the site build.

## Update HAUSE

HAUSE is a separate library, installed from GitHub at an exact commit. It ships
raw source, compiled through `transpilePackages`, with Tailwind scanning the
installed package. The current-capabilities page adopts shared StudyRoom,
StudySequence and exhibition Statement compositions; the site uses the shared
theme initialization. Authored diagrams and scientific claims stay here.

```bash
npm install github:chrishayuk/hause#FULL_COMMIT
node ../hause-design/hause/scripts/consumer-sync.mjs \
  --source ../hause-design/hause --package node_modules/@chrishayuk/hause --write
npm run check:hause
npm test
npm run build
```

The source checkout must be clean and match the requested commit. Commit the
package manifest, npm lockfile and `hause.lock.json`; its inventory verifies every
shared source file. CI also compares the installed library with an independent
checkout of that pinned revision and regenerates LARQL data from its pinned commit.
