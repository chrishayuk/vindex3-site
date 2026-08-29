# VINDEX3 Visualization Spec

**The exhibition plan for vindex3.org** — hero experience, section-by-section visual
forms, the new HOUSE primitives they require, the interaction model, and the exact
page architecture. Grounded in the two authoritative spec documents in `larql`
(`crates/larql-vindex/docs/vindex3-format-spec.md`, the ABI, `3.0-draft-2`; and
`docs/vindex3-format.md`, the living semantic spec) and in HOUSE as it actually
exists today.

Status: adopted plan. Sections marked **P1/P2/P3** give build order.

---

## 0. Thesis

The site's founding sentence is already the spec's: **"The model IS the database."**
The site's job is to make the spec *seen*, not just read. Every major concept gets a
native visual explanation — a map, an object, a flow, a selection, a comparison, an
execution trace, or a provenance graph — with the normative text one gesture away.

Three layers, in this order, on every page:

1. **Conceptual** — what is this idea? Spacious, editorial, cinematic.
2. **Structural** — how is it organised? Objects, graphs, ladders, byte maps.
3. **Exact** — what is the requirement? The spec's own sentences, verbatim.

The signature interaction of the whole site is **"same thing, another form"**: one
object viewed as OBJECT ↔ GRAPH ↔ BYTES ↔ SPEC ↔ EXECUTION. That interaction *is*
the VINDEX3 thesis rendered as UI.

### Corrections to the original brainstorm, forced by the actual spec

These matter — the site must not visualise ideas the spec explicitly rejects:

- **No RFC 2119 panel.** Neither VINDEX3 document contains a single uppercase
  MUST/SHOULD/MAY. Normative force is carried by bold lowercase (**must**,
  **never**, **only**) and by declarative sentences ("Selecting an absent variant
  fails closed"). The site renders normativity in the spec's own idiom — an
  "InvariantPanel" of RFC keywords would be a misquote.
- **No RepresentationMorph.** VINDEX3's representation model is *"profiles select
  bytes, they don't request formats"* — a region set carries multiple **physically
  present** variants; a profile **selects** one; runtime conversion never happens;
  selecting an absent variant **fails closed** before any byte is read. So the
  signature moment is not an object smoothly morphing between precisions (that
  would depict the forbidden silent conversion). It is a **selection among present
  bytes — and a designed, beautiful refusal when the bytes aren't there.** The
  refusal is the star.
- **Authority is derived, never asserted.** The visual is a *fold*: weakest
  selected region fidelity ↓ capped by operation completeness ↓ capped by declared
  structural omission → derived authority. A profile can claim below its derived
  level, never above.
- **Two documents, one exhibition.** The ABI spec governs bytes; the living spec
  governs semantics (the G-ladder). The site presents one surface and labels which
  authority each exact-layer clause comes from.

---

## 1. Hero experience — `/` (P1)

The existing "THE MODEL IS THE DATABASE" exhibit stays as the spine and gets a
cinematic opening above it.

**Opening sequence (the container reveals itself).** Full viewport. A single
monolithic volume — the container as *one coherent artifact* — set in negative
space, `voice-evidence` kicker: `VINDEX3 · SPEC 3.0-DRAFT-2`. On first scroll (or
after a beat), the volume opens into its layers at `--motion-cinematic` (1200ms,
`--ease-house`), each layer labelling itself as it separates:

```
index.json          ← SOLE ROOT AUTHORITY
moe_manifest.json
profiles/
control/            class 1
dense/              class 2
shared/             class 3
routed/             classes 4 & 5
query/
```

`index.json` separates *first* and holds a beat alone — the one-root rule ("a
second root creates competing authorities") is staged, not captioned. Built with
DOM layers + CSS 3D transforms — **no WebGL, no animation library**. HOUSE ships
zero dependencies and this sequence doesn't need one. This is the first real use
of `--motion-cinematic`, which has been sitting in tokens.css waiting for exactly
this.

Reduced motion / no-JS: the exploded state, fully labelled, static — a beautiful
cutaway diagram, not a disabled animation.

**Hero film slot.** Directly under the fold: the first real `Film` (§3.1) — a
30–60s piece: *extract once → vary what is loaded, where it resides, what
precision it uses, whether it is executed or queried — without rebuilding the
index.* Poster frame until in view; plays once; scrubbed by nothing (HOUSE has no
scroll-scrub and shouldn't grow one for this).

Then the existing Statement → Decomposition → Evidence → Timeline flow, plus a
closing `Connection`-style row into the section exhibits.

---

## 2. Page architecture

Each route is an exhibit: conceptual → structural → exact.

| Route | Exhibit | Spec sources | Phase |
|---|---|---|---|
| `/` | THE MODEL IS THE DATABASE — thesis + container reveal | both, §1 | P1 |
| `/representation` | SELECTION, NOT CONVERSION — variants, precision maps, fidelity | ABI §9.1–9.2, `represent/` | **P1 (signature)** |
| `/authority` | WHERE TRUTH COMES FROM — four authorities, the lattice, the fold | living §7–8, ABI §9.2 | P1 |
| `/container` | THE CONTAINER — anatomy, five weight classes, one root | ABI §4–5 | P2 |
| `/graph` | THE SYSTEM GRAPH — components, objects, edges ("the edge is not the tensor") | living §5 | P2 |
| `/bytes` | THE BYTES — LYRW v2 header/banks/regions, segmentation, NVFP4 pack | ABI §6–7 | P2 |
| `/execution` | FROM DESCRIPTION TO COMPUTATION — surfaces, operand closure, the five proofs | living §8 | P2 |
| `/query` | ASK THE CONTAINER — WALK / DESCRIBE / EXPLAIN, live | ABI §15, LQL spec | P3 |
| `/ladder` | THE G-LADDER — G0→G8 as a live status instrument + conformance envelope | living §2, ABI §13, §16 | P1 (skeleton), P3 (live) |
| `/spec` | THE EXACT LAYER — both documents chaptered, every clause linkable | both, verbatim | P3 |
| `/lineage` | GENERATIONS — VINDEX2 ↔ VINDEX3, the four version surfaces, "a note on the number 2" | ABI §12, generation policy | P3 |

Nav stays minimal: wordmark, a small set of these routes, `ModeToggle`. No
persistent sidebar (HOUSE `NOT_HOUSE` list).

---

## 3. New HOUSE primitives

Decision rule, unchanged: a primitive enters HOUSE only as a **semantic form with
no knowledge of VINDEX3** (plain props); anything that knows the spec's data model
lives in this site and composes HOUSE forms. All new forms follow house style:
rooted in `Reveal` + `.house-grid`, three voices, `--ease-house` only, motion
tokens only, an always-present `voice-evidence` text-fallback sentence, and a
*designed* `prefers-reduced-motion` state. No new dependencies — everything below
is DOM + CSS + SVG.

Route-coupling fix (prerequisite): `Connection` and `FollowReveal` currently
hardcode `/codex/${slug}`. Change `links`/`path` items to carry `href` directly.
One-line break, both consumers updated in the same commit.

### 3.1 `Film` — from placeholder to primitive (P1)

The existing dashed frame becomes real:

```ts
FilmProps = {
  title: string; description: string;
  src?: string; poster?: string;          // absent src → current placeholder frame
  captions?: string;                      // .vtt — always provided in practice
}
```

Behaviour: poster until ~50% in view (extend the `Reveal` observer pattern), then
plays once, muted, replay control in `voice-evidence` ("REPLAY", the `PaceDemo`
key-remount idiom). Reduced motion: poster + description only, with an explicit
PLAY control — autoplay is motion. No src → identical to today's placeholder, so
film slots can be laid out before films exist.

### 3.2 `Variants` — the signature form (P1)

*Serves: region-set variants, "profiles select bytes."* One logical object; its
physically present variants; a selector; a refusal.

```ts
VariantsProps = {
  kicker: string;                          // e.g. "REGION SET — layer.12.routed.gate_up"
  objectLabel: string;                     // the identity that never changes
  variants: {
    id: string;                            // "exact-q6k", "native-mxfp4"
    fidelity: string;                      // spec's own lattice words
    bytes?: string;                        // "11.3 GiB"
    present: boolean;
    detail?: string;
  }[];
  baseline: string;                        // id
  refusal: { title: string; lines: string[] };  // the fail-closed message for absent picks
}
```

The object is drawn as a block whose **area/density/texture** reflect the selected
variant's size and precision (denser hatch = lower bit-width). Selecting a
*present* variant: the object re-renders at `--motion-cinematic` — but staged as
**swap, not morph**: the old form exits fully before the new enters (a hard cut
with a held beat), because a crossfade would depict conversion. The identity line
(`objectLabel`) never moves and never re-renders — *the thing stays the same; its
physical form is chosen.*

Selecting an **absent** variant triggers the `Refusal` treatment (§3.3) inline:
the exact structured error the spec promises — region set, requested variant,
variants present — "before any byte is read." This is the site's single best
teaching moment; it gets the most design attention of anything in P1.

Reduced motion: all variants rendered side by side, selected one ruled in accent;
absent ones drawn as labelled empty frames with the refusal text beneath.
Fallback sentence: "A region set may carry multiple physically present variants; a
profile selects a present variant; selecting an absent one fails closed."

### 3.3 `Refusal` — fail-closed as design language (P1)

*Serves: fail-closed everywhere — absent variants, unresolved edges, unjudged
findings, `VindexError::MissingRequiredRegion`.* VINDEX3's personality is that it
refuses rather than guesses; the site should make refusals its most beautiful
output, not its error state.

```ts
RefusalProps = { kicker?: string; title: string; lines: string[]; principle: string }
```

Rendered as an instrument readout: `voice-evidence`, refuted-status color
(`--color-status-refuted`) rule, the structured fields line by line (140ms house
stagger), closing with the governing principle in editorial voice ("Ambiguity is
refused, never guessed."). Used standalone in exhibits and embedded by `Variants`.

### 3.4 `Ladder` — gated progression (P1)

*Serves four real spec structures with one form:* the G-ladder (G0→G8), the
kernel maturity ladder (Representable → Reference → Grouped → Dispatched →
Production), the representation-status ladder (represented → … → selected), and
extract levels (browse < attention < inference < all).

```ts
LadderProps = {
  kicker: string;
  rungs: { id: string; question?: string; gate?: string;
           status?: "PASSED" | "OPEN" | "BUILDING"; detail?: string }[];
  caption?: string;
}
```

Vertical, dates-column geometry borrowed from `Timeline` (`[6.5rem_1fr]`), rung ids
in accent mono, passed rungs solid, open rungs hollow, the current rung marked
BUILDING with `.graph-pulse`. Clicking a rung expands its gate criterion — the
exact sentence ("blocking = 0, mismatched = 0, unknown = 0"). On `/ladder` it is
composed with real gate status and becomes the site's live "is the ABI frozen
yet?" instrument.

### 3.5 `Agreement` — N things that must be identical (P1)

*Serves: the four-authority invariant `Declared ≡ Resolved ≡ Graph ≡ Encoded`, and
G4's three-hash check (source / recorded / encoded).*

```ts
AgreementProps = {
  kicker: string;
  columns: { label: string; source: string }[];      // "Declared" / "what HF said"
  rows: { values: string[]; verdict: "PASS" | "FAIL"; note?: string }[];
  caption?: string;
}
```

Columns revealed left→right with the house stagger; equality drawn as a rule
connecting the row; verdict in status color. The worked example from the spec is
the default demo content on `/authority`:
`layer_rope_theta[3] = 0 → PositionPolicy::None → position = none → position = none  PASS`
— and one FAIL row, because a lattice you never see fail is decoration.

### 3.6 `Derivation` — the authority fold (P1)

*Serves: fidelity lattice + the derived-authority fold.*

```ts
DerivationProps = {
  kicker: string;
  lattice: { level: string; meaning: string }[];      // strongest → weakest
  steps: { label: string; from: string; to: string }[]; // each cap
  result: string; caption?: string;
}
```

The lattice drawn as a vertical scale (`source-exact` at top, `analysis-only` at
bottom); the fold animates a marker being pushed *down* the scale by each cap, at
`--motion-considered` per step. Closing line, editorial voice: "A profile cannot
claim above its derived level; it may voluntarily claim below it." Reduced motion:
the scale with all cap arrows drawn statically.

### 3.7 `Prism` — same thing, another form (P2)

*The site-defining toggle.* Generic multi-facet viewer; knows nothing about what
the facets contain.

```ts
PrismProps = {
  kicker: string; objectLabel: string;
  facets: { id: string; label: string;                 // OBJECT · GRAPH · BYTES · SPEC · EXECUTION
            body: ReactNode; fallback: string }[];
  initial?: string;
}
```

Facet switch at `--motion-cinematic`: outgoing facet exits fully, held beat,
incoming enters (same no-crossfade rule as `Variants`, same reason). The facet rail
is `voice-evidence`, the persistent `objectLabel` is editorial — identity fixed,
representation chosen. Deep-linkable (`?facet=bytes`). Reduced motion: instant
switch, no transition. Fallback: renders the active facet's `fallback` sentence.

Used on `/container` (a representation record as object / graph node / bytes /
clause / runtime consequence) and reused on `/graph` and `/bytes`.

### 3.8 `Anatomy` — explorable layered object (P2)

*Serves: the container cutaway (hero uses a bespoke version; this is the reusable
form), the LYRW v2 file structure, the segment framing.*

```ts
AnatomyProps = {
  kicker: string; objectLabel: string;
  layers: { id: string; label: string; annotation?: string; emphasis?: boolean;
            children?: { label: string; annotation?: string }[] }[];
  caption?: string;
}
```

Closed ↔ exploded toggle ("OPEN IT / CLOSE IT", text control per house idiom),
layers separating on the y-axis with 140ms stagger, `emphasis` layer (e.g.
`index.json`) separating first and carrying an accent rule. Hover/focus a layer →
its annotation; keyboard navigable. Reduced motion: exploded by default.

### 3.9 `ByteMap` — physical layout, to the byte (P2)

*Serves: the LYRW v2 header (24 B), bank descriptor (24 B), segment descriptor
(12 B), region schema (20 B), entry-table rows (16 B), the NVFP4 pack, the
`[u64 header length][JSON][payload]` framing.*

```ts
ByteMapProps = {
  kicker: string; title: string;
  fields: { name: string; type: string; bytes: number; value?: string; meaning: string }[];
  totalLabel?: string;                    // "24 bytes, little-endian, 64-byte aligned regions"
}
```

A proportional horizontal bar (each field's width = its bytes) above a
`voice-evidence` table; hovering either illuminates the other. Strictly static
apart from the illumination (`--motion-immediate`) — bytes are the one place the
site should feel like an engineering drawing, not a film. This is the "byte view"
facet content for `Prism`.

### 3.10 Not being built, and why

- **`SpecMap` (zoomable whole-spec map)** — deferred past P3. The route table *is*
  the map at current scale; a zoomable graph is gravity toward generic-diagram
  tooling HOUSE explicitly resists. Revisit only if the exact layer (`/spec`)
  proves hard to navigate.
- **`VersionDiff` (morphing spec versions)** — replaced by `/lineage` composed
  from `Timeline`, `Agreement` (the four version surfaces table), and `Anatomy`.
  The spec's real versioning story is *coexistence* (dual-generation, no cross
  loading, no silent conversion), not morphing.
- **Scroll-scrubbed animation, WebGL, three.js** — HOUSE has one scroll behaviour
  (one-shot reveal) and a single easing curve; that restraint *is* the luxury.
  Cinematic = staged, paced sequences on the house clock, not scroll-jacking.

---

## 4. Site-level compositions (VINDEX3-aware, live in `src/components/`)

- **`AskTheContainer`** (P3) — HOUSE `Inquiry` + a resolver speaking the spec's
  own verbs. Queries like `DESCRIBE layer 12`, `WALK from "capital"`, `EXPLAIN
  WALK` resolve to real forms (`ByteMap`, `Variants`, `Ladder`, lookup) with the
  trace panel showing the resolution path — including §15.4's latent-space hop
  ("EXPLAIN WALK reports the space hop") as a trace line. Content from
  precomputed JSON derived from real containers (Granite/GPT-OSS fixtures);
  no live backend required to launch.
- **`PrecisionMapDemo`** (P2, on `/representation`) — renders one precision map
  (`r1-protect-v`, four lines) applied to two different models side by side,
  proving "structural, not enumerated": the same policy compiles against a
  416-tensor Glimmer stack and a 280-tensor Granite stack. Composed from
  `Comparison`-style geometry + `Refusal` for the eligibility PRESERVE rows.
- **`ClauseAnchor`** (P3) — the exact layer's unit: every clause on `/spec` gets a
  stable id; every structural form links "WHERE IS THIS DEFINED?" to its clause,
  which illuminates on arrival (`.graph-pulse`, once). This is the site's
  spec-view half of the Prism promise.
- **`GateBoard`** (P3, on `/ladder`) — conformance envelope as a capability ×
  model matrix (18 rows × 5 models) using `StatusMark` vocabulary, plus the seven
  success criteria each bound to its proving gate.

---

## 5. Interaction model

**Tempo.** Three speeds, already tokenised, now assigned:
- `--motion-immediate` (150ms) — controls, hover illumination, facet rail.
- `--motion-considered` (450ms) — reveals, expansions, fold steps, staggers (140ms cadence).
- `--motion-cinematic` (1200ms) — identity moments only: the hero reveal, a
  `Variants` selection, a `Prism` facet change. If everything is cinematic,
  nothing is.

**The no-crossfade rule.** Any transition between two physical forms of one
logical object is a staged swap (exit → held beat → enter), never a blend.
Crossfades depict conversion; VINDEX3 forbids conversion. This one rule keeps the
motion design on-thesis everywhere.

**Refusal as first-class output.** Wherever the spec fails closed, the site
renders the refusal with more care than the success path. Absent variant, ambiguous
edge (zero or two producer candidates), unjudged plan finding — each is a designed
moment, not an error toast.

**Text is always underneath.** Every interactive form carries its one-sentence
plain statement; the exact layer is reachable from every structural view; nothing
is only expressible as motion. Reduced-motion users get designed static
compositions (exploded anatomy, side-by-side variants, drawn folds).

**Voice discipline.** Editorial voice asks and claims ("The edge is not the
tensor."); system voice explains; evidence voice measures (`24.28 GB`,
`REGION_ALIGNMENT = 64`, `PASS`). Numbers never appear in editorial voice.

---

## 6. Films (content plan for `Film` slots)

Five pieces, each under 60s, poster-first, captioned, all replayable:

1. **Extract once** (`/` hero) — one extraction; then residency, precision,
   placement, execute-vs-query all vary; the index never rebuilds.
2. **Selection, not conversion** (`/representation`) — bytes on disk; a profile's
   hand choosing among them; the refusal when it points at nothing.
3. **The fold** (`/authority`) — fidelity pushed down the lattice by caps.
4. **Compiler-shaped** (`/execution`) — HF artifacts → inventory → plan → graph →
   encode → verify → execute; the deletion invariant as the closing beat
   (the checkpoint, `config.json`, and the model name vanish; execution continues).
5. **22.61 GiB** (`/bytes`) — K3's routed layer splitting into 2 segments × 448
   experts on group-extent boundaries.

Production route is open (Remotion, manim, or captured renders) — the `Film`
primitive is deliberately indifferent, and every slot ships as a designed
placeholder until its film exists.

---

## 7. Build order

**P1 — the signature (ship first):** `Film`, `Variants`, `Refusal`, `Ladder`,
`Agreement`, `Derivation` in HOUSE; hero reveal on `/`; `/representation` and
`/authority` exhibits; `/ladder` skeleton. This phase alone makes the site's
argument.

**P2 — the structure:** `Prism`, `Anatomy`, `ByteMap`; `/container`, `/graph`,
`/bytes`, `/execution`; `PrecisionMapDemo`.

**P3 — the depth:** `/spec` exact layer with `ClauseAnchor`; `AskTheContainer` on
`/query`; `GateBoard` on `/ladder`; `/lineage`; films replacing placeholders as
they're produced.

**Dev loop:** while co-developing HOUSE primitives, switch the dependency to
`"file:../house"` and add `.npmrc` with `install-links=true` (Turbopack won't
resolve through outside-root symlinks otherwise); return to `github:` + push before any
deploy. Every new HOUSE form lands with its entry in the house specimen page.

**Content sourcing rule:** every number, error shape, and clause on the site is
lifted verbatim from the larql repo (specs, `index.rs`, `region_format.rs`,
fixtures) — the site never paraphrases a normative sentence. When the ABI freezes
(V2-0..V2-2 gates), `/ladder` flips its rungs and the hero kicker drops `-DRAFT-2`.
