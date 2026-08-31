"use client";

import { useEffect, useState } from "react";
import {
	Terminal,
	type TerminalLine,
	type TerminalPanel,
	type TerminalResult,
} from "@chrishayuk/hause/components/forms/Terminal";
import { ENTITIES, entity, type Entity } from "@/data/vindexGraph";
import type { PanelModel } from "@/components/TerminalPanels";
import {
	componentsPanel,
	precisionPanel,
	explainRepresentationPanel,
	diffPanel,
	verifyPanel,
	representationsPanel,
	provenancePanel,
	authorityPanel,
	statsPanel,
	treePanel,
	type ComponentsData,
	type RepresentationsData,
	type ProvenanceData,
	type AuthorityData,
} from "@/components/TerminalPanels";

/**
 * ENTER A MODEL — the Explorer's terminal.
 *
 * The chrome is HAUSE's Terminal form; this file is only the meaning:
 * two executors and one gate.
 *
 * LIVE: statements go to the hardened public VINDEX query endpoint
 * (larql-server --public-explorer on fly.io) and execute for real —
 * the capability profile PUBLIC_EXPLORER is enforced in the server
 * after parsing, before execution, so a mutation statement parses and
 * then refuses with the profile's own words. The container is
 * vindex3-demo: a miniature two-layer system with synthetic weights —
 * the format, graph, provenance, authority, and execution are real.
 *
 * SNAPSHOT (fallback when the endpoint is unreachable): each line is
 * parsed into a tiny allowlisted AST over an immutable demo snapshot
 * compiled into the site (the Bytes encoder's worked example), and the
 * banner says so.
 */

const LIVE_ENDPOINT = "https://vindex3-explorer.fly.dev";

type Line = TerminalLine;

const SNAPSHOT_ID = "vindex3-demo · compiled snapshot · 3.0-candidate / 2026-08-30";

// ---------- the demo universe (matches the Bytes encoder's worked example) ----------
const MODELS = [
	{ name: "vindex3-demo", size: "15.2 GiB", arch: "moe-decoder", status: "READY (snapshot)" },
	// A recorded model rather than a servable one: the container is not
	// distributed, so what the browser can show is its record. Storage
	// is measured; quality is not yet established, and the panels say so.
	{ name: "qwen3.8-27b", size: "18.4 GiB", arch: "hybrid gdn/attn", status: "RECORD (measured)" },
	{ name: "granite-4.1-3b", size: "6.35 GiB", arch: "granite", status: "LIVE ENDPOINT PENDING" },
	{ name: "gpt-oss-20b", size: "13.8 GiB", arch: "gpt-oss", status: "LIVE ENDPOINT PENDING" },
];

const DEMO = {
	layers: 24,
	experts: 32,
	hidden: 2048,
	inter: 6144,
	components: [
		"target.embedding          embedding        vocab 32768 × 2048 · bf16",
		"target.decoder_stack      decoder_stack    24 layers · hidden 2048",
		"target.final_norm         final_norm       2048 · f32",
		"target.output_head        output_head      reuses embedding — bound, not duplicated",
	],
	layerObjects: (l: number) => [
		`layer.${l}.attention       q/k/v/o projections · bf16`,
		`layer.${l}.norms           pre/post attention · pre/post ffn`,
		`layer.${l}.router          32 × 2048 · f32 · preserved`,
		`layer.${l}.routed.gate_up  32 experts · ${l === 12 ? "variants: exact-q6k (baseline) · native-mxfp4" : "exact-q6k"}`,
		`layer.${l}.routed.down     32 experts · exact-q6k`,
	],
};

// ---------- the allowlisted AST (snapshot transport) ----------
type Cmd =
	| { kind: "help" }
	| { kind: "clear" }
	| { kind: "snapshot" }
	| { kind: "show-models" }
	| { kind: "use"; model: string }
	| { kind: "show-components"; layer?: number }
	| { kind: "show-representations"; address?: string }
	| { kind: "show-provenance"; address?: string }
	| { kind: "describe"; address: string }
	| { kind: "tree"; address: string }
	| { kind: "walk-weights"; prompt: string; top: number }
	| { kind: "walk-misused"; address: string }
	| { kind: "find"; term: string }
	| { kind: "explain-plan"; layer?: number }
	| { kind: "show-precision" }
	| { kind: "explain-representation"; address: string }
	| { kind: "diff"; address: string }
	| { kind: "verify" }
	| { kind: "show-authority"; address?: string }
	| { kind: "read"; address: string }
	| { kind: "infer"; prompt: string }
	| { kind: "forbidden"; verb: string }
	| { kind: "unknown"; input: string };

const FORBIDDEN = /^(extract|insert|delete|patch|save|remove|compile|update|drop|create|merge|rebalance|compact|sudo|rm|cat|ls|curl|wget|ssh|sh|bash)\b/i;

function parse(raw: string): Cmd {
	const s = raw.trim().replace(/;+$/, "");
	if (!s) return { kind: "unknown", input: "" };
	if (FORBIDDEN.test(s)) return { kind: "forbidden", verb: s.split(/\s+/)[0].toUpperCase() };
	const up = s.toUpperCase();
	if (up === "HELP" || up === "?") return { kind: "help" };
	if (up === "CLEAR") return { kind: "clear" };
	if (up === "SNAPSHOT") return { kind: "snapshot" };
	if (/^SHOW\s+MODELS$/.test(up)) return { kind: "show-models" };
	let m = s.match(/^(?:OPEN|USE)\s+(\S+)$/i);
	if (m) return { kind: "use", model: m[1] };
	m = s.match(/^SHOW\s+COMPONENTS(?:\s+layer\.(\d+))?$/i);
	if (m) return { kind: "show-components", layer: m[1] ? Number(m[1]) : undefined };
	m = s.match(/^SHOW\s+REPRESENTATIONS(?:\s+(\S+))?$/i);
	if (m) return { kind: "show-representations", address: m[1] };
	m = s.match(/^SHOW\s+PROVENANCE(?:\s+(\S+))?$/i);
	if (m) return { kind: "show-provenance", address: m[1] };
	m = s.match(/^DESCRIBE\s+(\S+)$/i);
	if (m) return { kind: "describe", address: m[1] };
	m = s.match(/^TREE\s+(\S+)$/i);
	if (m) return { kind: "tree", address: m[1] };
	m = s.match(/^WALK\s+"([^"]+)"(?:\s+TOP\s+(\d+))?$/i);
	if (m) return { kind: "walk-weights", prompt: m[1], top: m[2] ? Number(m[2]) : 3 };
	m = s.match(/^WALK\s+(\S+)$/i);
	if (m) return { kind: "walk-misused", address: m[1] };
	m = s.match(/^FIND\s+(.+)$/i);
	if (m) return { kind: "find", term: m[1] };
	if (/^SHOW\s+PRECISION$/i.test(s)) return { kind: "show-precision" };
	m = s.match(/^EXPLAIN\s+REPRESENTATION\s+(\S+)$/i);
	if (m) return { kind: "explain-representation", address: m[1] };
	m = s.match(/^DIFF\s+(?:BF16\s+NVFP4\s+)?(\S+)$/i);
	if (m) return { kind: "diff", address: m[1] };
	if (/^VERIFY$/i.test(s)) return { kind: "verify" };
	m = s.match(/^SHOW\s+AUTHORITY(?:\s+(\S+))?$/i);
	if (m) return { kind: "show-authority", address: m[1] };
	m = s.match(/^EXPLAIN\s+(?:EXECUTION|PLAN)(?:\s+layer\.(\d+))?$/i);
	if (m) return { kind: "explain-plan", layer: m[1] ? Number(m[1]) : undefined };
	m = s.match(/^READ\s+(\S+)$/i);
	if (m) return { kind: "read", address: m[1] };
	m = s.match(/^INFER\s+(.+)$/i);
	if (m) return { kind: "infer", prompt: m[1] };
	return { kind: "unknown", input: s };
}

const HELP: Line[] = [
	{ text: "PUBLIC_EXPLORER grammar — read-only, allowlisted:", tone: "dim" },
	{ text: "  SHOW MODELS                         the mounted containers" },
	{ text: "  OPEN <model>                        enter one" },
	{ text: "  SHOW COMPONENTS [layer.N]           the named parts" },
	{ text: "  DESCRIBE <address>                  one object, in full" },
	{ text: "  TREE <address>                      the structure, as a tree" },
	{ text: '  WALK "prompt" [TOP n]               walk the weights themselves' },
	{ text: "  SHOW REPRESENTATIONS [<address>]    the physical variants" },
	{ text: "  SHOW PROVENANCE [<address>]         hashes and lineage" },
	{ text: "  SHOW AUTHORITY [<address>]          the derived fidelity" },
	{ text: "  EXPLAIN EXECUTION [layer.N]         the generic op program" },
	{ text: "  SHOW PRECISION                      the compiled precision map" },
	{ text: "  EXPLAIN REPRESENTATION <addr>       the policy, resolving" },
	{ text: "  DIFF BF16 NVFP4 <addr>              original vs reconstructed (recorded)" },
	{ text: "  VERIFY                              the artifact against its own record" },
	{ text: "  FIND <term>                         search the catalogue" },
	{ text: "  READ <addr>[a..b]                   raw bytes (live endpoint)" },
	{ text: "  INFER <prompt>                      execute (live endpoint)" },
	{ text: "  SNAPSHOT · HELP · CLEAR", tone: "dim" },
];

/** Only a model with a recorded panel set answers as itself. */
function panelModel(model: string | null): PanelModel {
	return model === "qwen3.8-27b" ? "qwen3.8-27b" : null;
}

function execute(cmd: Cmd, model: string | null): { lines: Line[]; model?: string | null; clear?: boolean; panel?: TerminalPanel } {
	// The Qwen record holds the runs that were made, and nothing else.
	// A verb with no recorded answer refuses by name rather than
	// falling through to the demo container's data — which would answer
	// a question about a 64-layer hybrid with a 24-layer worked example.
	const recordOnly = (verb: string): Line[] => [
		{ text: `${verb}: no recorded answer for qwen3.8-27b`, tone: "err" },
		{ text: "this record holds SHOW REPRESENTATIONS · SHOW PRECISION · DIFF · VERIFY — the runs that were made", tone: "dim" },
		{ text: "OPEN vindex3-demo to walk a mounted container instead", tone: "dim" },
	];
	const need = (): Line[] => [
		{ text: "no model open — OPEN vindex3-demo, or OPEN qwen3.8-27b for the recorded hybrid", tone: "err" },
	];
	switch (cmd.kind) {
		case "help":
			return { lines: HELP };
		case "clear":
			return { lines: [], clear: true };
		case "snapshot":
			return { lines: [{ text: SNAPSHOT_ID, tone: "dim" }, { text: "immutable · versioned · the terminal's whole universe", tone: "dim" }] };
		case "show-models":
			return {
				lines: [
					{ text: "MODEL              SIZE       ARCH          STATUS", tone: "dim" },
					...MODELS.map((m) => ({
						text: `${m.name.padEnd(19)}${m.size.padEnd(11)}${m.arch.padEnd(14)}${m.status}`,
						tone: m.status.startsWith("READY") ? ("ok" as const) : ("dim" as const),
					})),
				],
			};
		case "use": {
			// Two things can be opened, and they are not the same kind of
			// thing. vindex3-demo is a container this surface mounts.
			// qwen3.8-27b is a RECORD of runs made against a container
			// that is not distributed — so it answers with what was
			// measured, and refuses to pretend it is executing.
			if (cmd.model === "vindex3-demo")
				return {
					lines: [{ text: "opened — vindex3-demo (worked example · 24 layers · 32 experts · moe-decoder)", tone: "ok" }],
					model: "vindex3-demo",
				};
			if (cmd.model === "qwen3.8-27b")
				return {
					lines: [
						{ text: "opened — qwen3.8-27b (recorded · 64 layers · hybrid gated-deltanet / gated attention)", tone: "ok" },
						{ text: "a RECORD, not a connection: the container is not distributed, and these are runs made against it", tone: "dim" },
						{ text: "storage and quality measured · Q-BANK-1 — SHOW PRECISION · DIFF BF16 NVFP4 layer.0.ffn.down · VERIFY", tone: "dim" },
					],
					model: "qwen3.8-27b",
				};
			return {
				lines: [
					{ text: `${cmd.model}: LIVE ENDPOINT PENDING`, tone: "err" },
					{ text: "this surface mounts vindex3-demo, and holds the qwen3.8-27b record — SHOW MODELS", tone: "dim" },
				],
			};
		}
		case "show-components":
			if (!model) return { lines: need() };
			if (model === "qwen3.8-27b") return { lines: recordOnly("SHOW COMPONENTS") };
			if (cmd.layer !== undefined) {
				if (cmd.layer < 0 || cmd.layer >= DEMO.layers) return { lines: [{ text: `layer.${cmd.layer}: out of range — 0..${DEMO.layers - 1}`, tone: "err" }] };
				return { lines: DEMO.layerObjects(cmd.layer).map((t) => ({ text: t })) };
			}
			return { lines: [...DEMO.components.map((t) => ({ text: t })), { text: `layers 0..${DEMO.layers - 1} — SHOW COMPONENTS layer.N to open one`, tone: "dim" }] };
		case "describe": {
			if (!model) return { lines: need() };
			const a = cmd.address;
			const semantic = semanticPanel(a);
			if (semantic) return semantic;
			if (/^layer\.12\.routed\.gate_up$/i.test(a))
				return {
					lines: [
						{ text: "ADDRESS          layer.12.routed.gate_up" },
						{ text: "ROLE             routed gate/up bank (class 4)" },
						{ text: "ENTRIES          32 experts · homogeneous" },
						{ text: "DIMS             input 2048 · intermediate 6144" },
						{ text: "REPRESENTATIONS  exact-q6k (baseline · source-equivalent)", tone: "accent" },
						{ text: "                 native-mxfp4 (source-exact)", tone: "accent" },
						{ text: "SELECTED BY      profile — never converted", tone: "dim" },
					],
				};
			const lm = a.match(/^layer\.(\d+)/i);
			if (lm)
				return {
					lines: [
						{ text: `ADDRESS          ${a}` },
						{ text: "ROLE             see SHOW COMPONENTS layer." + lm[1] },
						{ text: "REPRESENTATION   exact-q6k · source-equivalent" },
						{ text: "PROVENANCE       SHOW PROVENANCE " + a, tone: "dim" },
					],
				};
			return { lines: [{ text: `${a}: not found in vindex3-demo — try FIND, or SHOW COMPONENTS`, tone: "err" }] };
		}
		case "walk-weights": {
			if (!model) return { lines: need() };
			if (model === "qwen3.8-27b") return { lines: recordOnly("WALK") };
			const rows = [
				{ l: 24, f: "24:1882", sc: 0.83 },
				{ l: 27, f: "27:0413", sc: 0.79 },
				{ l: 31, f: "31:2050", sc: 0.71 },
			].slice(0, Math.max(1, Math.min(cmd.top, 3)));
			return {
				lines: [],
				panel: {
					designed: <WalkPanel prompt={cmd.prompt} rows={rows} />,
					raw: {
						statement: `WALK "${cmd.prompt}" TOP ${cmd.top}`,
						results: rows.map((r) => ({ layer: r.l, feature: r.f, score: r.sc })),
						note: "a worked shape, not a recorded run — expert-region browse parity is an open row on the Record",
					},
				},
			};
		}
		case "walk-misused":
			return {
				lines: [
					{ text: 'WALK walks the weights — WALK "the capital of France" TOP 3', tone: "err" },
					{ text: `for structure, use TREE ${cmd.address}`, tone: "dim" },
				],
			};
		case "tree": {
			if (!model) return { lines: need() };
			if (model === "qwen3.8-27b") return { lines: recordOnly("TREE") };
			const lm = cmd.address.match(/^layer\.(\d+)/i);
			const l = lm ? Number(lm[1]) : 12;
			return {
				lines: [],
				panel: treePanel(l, l === 12, "compiled snapshot · the worked example", {
					address: `layer.${l}`,
					children: {
						attention: ["q", "k", "v", "output"],
						norms: 2,
						router: { candidates: 32, chosen: 4 },
						experts: { count: 32, each: ["gate", "up", "down"], gate_up_representations: l === 12 ? 2 : 1 },
					},
				}),
			};
		}
		case "show-representations":
			if (!model) return { lines: need() };
			return {
				lines: [
					{ text: "REGION SET                     VARIANTS                          BASELINE", tone: "dim" },
					{ text: "layer.12.routed.gate_up        exact-q6k · native-mxfp4          exact-q6k", tone: "accent" },
					{ text: "layer.*.routed.*               exact-q6k                         exact-q6k" },
					{ text: "control · dense · norms        source precision — preserved", tone: "dim" },
					{ text: "profiles select among present variants; selecting an absent one fails closed", tone: "dim" },
				],
			};
		case "show-provenance":
			if (!model) return { lines: need() };
			return {
				lines: [
					{ text: `ADDRESS          ${cmd.address ?? "vindex3-demo"}` },
					{ text: "AUTHORITY        canonical" },
					{ text: "SOURCE HASH      recorded at extraction · re-hashed at verify" },
					{ text: "SEGMENT HASH     recorded per representation" },
					{ text: "INVARIANT        Declared ≡ Resolved ≡ Graph ≡ Encoded", tone: "accent" },
					{ text: "(demo snapshot carries the shape of provenance; live hashes arrive with the endpoint)", tone: "dim" },
				],
			};
		case "show-authority":
			if (!model) return { lines: need() };
			return {
				lines: [
					{ text: `ADDRESS          ${cmd.address ?? "vindex3-demo"}` },
					{ text: "FIDELITY         source-equivalent (exact-q6k baseline)" },
					{ text: "DERIVED          authority is the weakest fidelity across active selections", tone: "dim" },
					{ text: "RULE             a profile cannot claim above its derived level", tone: "accent" },
				],
			};
		case "show-precision":
			return { lines: [], panel: precisionPanel(panelModel(model)) };
		case "explain-representation":
			return { lines: [], panel: explainRepresentationPanel(cmd.address) };
		case "diff":
			return { lines: [], panel: diffPanel(cmd.address, panelModel(model)) };
		case "verify":
			return { lines: [], panel: verifyPanel(panelModel(model)) };
		case "explain-plan": {
			if (!model) return { lines: need() };
			const l = cmd.layer ?? 12;
			return {
				lines: [
					{ text: `layer.${l} — generic operation program`, tone: "dim" },
					{ text: "  pre_attention_norm     norm" },
					{ text: "  q/k/v projections      linear ×3" },
					{ text: "  position               rope (from the per-layer policy table)" },
					{ text: "  attention              scores · softmax · aggregate" },
					{ text: "  o projection           linear" },
					{ text: "  post_attention_norm    norm" },
					{ text: "  router                 route · top-k" },
					{ text: "  experts                gather · gated-mlp · weighted reduction" },
					{ text: "  combine                residual merge" },
					{ text: "every operand accounted; a missing one refuses by name — never skipped", tone: "accent" },
				],
			};
		}
		case "find": {
			if (!model) return { lines: need() };
			const t = cmd.term.toLowerCase();
			const hits: Line[] = [];
			if ("router".includes(t) || t.includes("rout")) hits.push({ text: "layer.0..23.router · layer.0..23.routed.gate_up · layer.0..23.routed.down" });
			if (t.includes("embed")) hits.push({ text: "target.embedding · target.output_head (reuses embedding)" });
			if (t.includes("norm")) hits.push({ text: "layer.*.norms · target.final_norm" });
			if (t.includes("expert") || t.includes("moe")) hits.push({ text: "layer.*.routed.gate_up · layer.*.routed.down — 32 experts each" });
			if (t.includes("repr") || t.includes("quant") || t.includes("mxfp") || t.includes("q6")) hits.push({ text: "layer.12.routed.gate_up — 2 physically present variants" });
			return { lines: hits.length ? hits : [{ text: `no matches for "${cmd.term}" in vindex3-demo`, tone: "dim" }] };
		}
		case "read":
			return {
				lines: [
					{ text: "READ requires the live endpoint — bytes are not compiled into the site", tone: "err" },
					{ text: "the snapshot carries structure and metadata; raw payloads arrive with the live endpoint", tone: "dim" },
				],
			};
		case "infer":
			return {
				lines: [
					{ text: "INFER requires the live endpoint — execution is not compiled into the site", tone: "err" },
					{ text: "when it lands: the same container you have been walking becomes executable", tone: "dim" },
				],
			};
		case "forbidden":
			return {
				lines: [
					{ text: `${cmd.verb}: no such operation in this universe`, tone: "err" },
					{ text: "profile PUBLIC_EXPLORER is read-only — mutation verbs are not represented in the AST, so they cannot happen", tone: "dim" },
				],
			};
		case "unknown":
			return { lines: cmd.input ? [{ text: `parse error: ${cmd.input}`, tone: "err" }, { text: "HELP lists the grammar", tone: "dim" }] : [] };
	}
}

/* ── Designed results — a command need not return text. The DESIGNED
   view is the HAUSE rendering; RAW (one tab away) is the structured
   object it was projected from. ── */

function EntityCard({ ent, address, physical }: { ent: Entity; address: string; physical?: string }) {
	return (
		<div className="flex flex-col gap-2">
			<p className="voice-editorial text-lg sm:text-xl m-0">{ent.display}</p>
			<p className="voice-evidence text-xs m-0" style={{ color: "var(--color-accent)" }}>{ent.five}</p>
			<p className="voice-system text-sm opacity-85 leading-relaxed m-0 max-w-xl">{ent.role}</p>
			{physical && (
				<p className="voice-evidence text-[11px] opacity-60 m-0">
					PHYSICAL&nbsp;&nbsp;{physical}
				</p>
			)}
			<div className="flex flex-wrap gap-2 mt-1">
				<a
					href={`/ask?q=${encodeURIComponent("what does " + ent.names[0] + " do?")}`}
					className="voice-evidence text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 border"
					style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)" }}
				>
					ASK — what does {ent.names[0]} do? →
				</a>
				<a
					href={ent.href}
					className="voice-evidence text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 border opacity-70"
					style={{ borderColor: "var(--color-mist)" }}
				>
					THE ANATOMY →
				</a>
			</div>
			<p className="voice-evidence text-[10px] opacity-40 m-0 mt-1">{address} · from the VINDEX knowledge graph</p>
		</div>
	);
}

function WalkPanel({ prompt, rows }: { prompt: string; rows: { l: number; f: string; sc: number }[] }) {
	return (
		<div className="flex flex-col gap-2">
			<p className="voice-evidence text-xs m-0" style={{ color: "var(--color-accent)" }}>
				WALK &quot;{prompt}&quot; — read from the stored gate rows, in place
			</p>
			<p className="voice-evidence text-[10px] opacity-45 m-0">
				a worked shape, not a recorded run — expert-region browse parity is an open row on the Record
			</p>
			{rows.map((r) => (
				<div key={r.f} className="grid grid-cols-[4.5rem_minmax(0,8rem)_2.5rem_1fr] gap-3 items-center">
					<span className="voice-evidence text-[11px] opacity-60">layer {r.l}</span>
					<span className="voice-evidence text-[11px]">feature {r.f}</span>
					<span className="voice-evidence text-[11px]" style={{ color: "var(--color-accent)" }}>{r.sc.toFixed(2)}</span>
					<div className="h-2.5 border" style={{ borderColor: "var(--color-mist)" }}>
						<div
							className="h-full"
							style={{
								width: `${r.sc * 100}%`,
								backgroundImage:
									"repeating-linear-gradient(45deg, var(--color-accent) 0, var(--color-accent) 1px, transparent 1px, transparent 4px)",
							}}
						/>
					</div>
				</div>
			))}
			<p className="voice-evidence text-[10px] opacity-45 m-0">
				no forward pass · no side index · a worked shape — browse parity is an open row on the Record
			</p>
		</div>
	);
}

/** A semantic address answered as a designed panel — knowledge-graph
 *  content (what the part IS), so it renders identically on either
 *  transport; container-level facts stay with the container. */
function semanticPanel(a: string): { lines: Line[]; panel: TerminalPanel } | null {
	const sem = semanticEntity(a);
	if (!sem) return null;
	const physical =
		sem.id === "gate" || sem.id === "up"
			? "stored with its pair as routed.gate_up — consumed together, stored together"
			: sem.id === "down"
				? "stored as routed.down — consumed apart, stored apart"
				: sem.id === "router"
					? "32 × 2048 · f32 · preserved at source precision"
					: undefined;
	return {
		lines: [],
		panel: {
			designed: <EntityCard ent={sem} address={a} physical={physical} />,
			raw: {
				address: a,
				entity: { id: sem.id, five: sem.five, role: sem.role, group: sem.group, relations: sem.relations },
				physical: physical ?? null,
				authority: "the VINDEX knowledge graph — one vocabulary, linked authorities",
			},
			graph: sem.relations.map((r) => ({
				from: sem.display,
				rel: r.rel.replace(/_/g, " "),
				to: entity(r.to)?.display ?? r.to,
			})),
		},
	};
}

/** Route a semantic address to its graph entity — the same records
 *  Ask's definitions and the Anatomy chapter answer from. */
function semanticEntity(address: string): Entity | undefined {
	const m = address.toLowerCase().match(/^layer\.\d+\.(.+)$/);
	if (!m) return undefined;
	const rest = m[1];
	const map: Record<string, string> = {
		attention: "attention",
		"attention.q": "q",
		"attention.k": "k",
		"attention.v": "v",
		"attention.o": "o",
		"attention.output": "o",
		ffn: "feed-forward",
		mlp: "feed-forward",
		experts: "expert",
		expert: "expert",
		"ffn.gate": "gate",
		"mlp.gate": "gate",
		"experts.gate": "gate",
		"ffn.up": "up",
		"mlp.up": "up",
		"experts.up": "up",
		"ffn.down": "down",
		"mlp.down": "down",
		"experts.down": "down",
		router: "router",
		norm: "norm",
		norms: "norm",
	};
	const id = map[rest];
	return id ? entity(id) : undefined;
}

const SEED = ["TREE layer.12", 'WALK "the capital of France" TOP 3', "DESCRIBE layer.12.attention", "DESCRIBE layer.12.ffn.gate", "SHOW REPRESENTATIONS", "SHOW AUTHORITY layer.12"];

const LIVE_SEED = [
	"SHOW COMPONENTS;",
	"SHOW LAYERS;",
	"SHOW REPRESENTATIONS;",
	"SHOW PROVENANCE;",
	"SHOW AUTHORITY;",
	'EXPLAIN INFER "[3]";',
	'INFER "[3]" GENERATE 8;',
];

const LIVE_HELP: Line[] = [
	{ text: "PUBLIC_EXPLORER grammar — enforced in the server, after parsing, before execution:", tone: "dim" },
	{ text: "  SHOW MODELS / COMPONENTS / LAYERS       the catalogue, the graph, the plan" },
	{ text: '  SHOW REPRESENTATIONS ["object"]         the physically present variants' },
	{ text: '  SHOW PROVENANCE ["object"]              whole hashes and lineage' },
	{ text: "  SHOW AUTHORITY                          the container's own declaration" },
	{ text: '  DESCRIBE "entity" · WALK "prompt"       browse the bound system' },
	{ text: "  SELECT * FROM EDGES LIMIT n             the knowledge surface" },
	{ text: '  EXPLAIN INFER "prompt"                  the executable plan, rendered' },
	{ text: '  INFER "prompt" [TOP n] [GENERATE ≤ 32]  execute — really' },
	{ text: "  STATS · HELP · CLEAR", tone: "dim" },
	{ text: "every other statement parses — and refuses with the profile's own words", tone: "dim" },
];

function liveBanner(): Line[] {
	return [
		{ text: "Connected — live · " + LIVE_ENDPOINT.replace("https://", "") + " · profile PUBLIC_EXPLORER", tone: "ok" },
		{ text: "Container: vindex3-demo — a miniature two-layer system, synthetic weights; the format, graph, and execution are real", tone: "dim" },
		{ text: "Type HELP, or start with SHOW COMPONENTS;", tone: "dim" },
	];
}


type Transport = "snapshot" | "live";

/* ── Completion — commands, then addresses like a filesystem ── */

const SNAPSHOT_VERBS = [
	"SHOW MODELS", "SHOW COMPONENTS", "SHOW REPRESENTATIONS", "SHOW PROVENANCE", "SHOW AUTHORITY",
	"OPEN vindex3-demo", "DESCRIBE ", "TREE ", 'WALK "', "FIND ", "EXPLAIN EXECUTION", "SHOW PRECISION", "EXPLAIN REPRESENTATION ", "READ ", "INFER ",
	"HELP", "CLEAR", "SNAPSHOT",
];
const LIVE_VERBS = [
	"SHOW MODELS;", "SHOW COMPONENTS;", "SHOW LAYERS;", "SHOW REPRESENTATIONS;", "SHOW PROVENANCE;",
	"SHOW AUTHORITY;", "STATS;", "DESCRIBE ", "WALK ", "SELECT * FROM EDGES LIMIT 5;",
	"EXPLAIN INFER ", "INFER ", "HELP", "CLEAR",
];
const CHILDREN: Record<string, string[]> = {
	"": ["attention", "ffn", "router", "norm", "routed"],
	attention: ["q", "k", "v", "output"],
	ffn: ["gate", "up", "down"],
	routed: ["gate_up", "down"],
};

function completeLine(input: string, live: boolean): string[] {
	const m = input.match(/^((?:DESCRIBE|TREE)\s+)(\S*)$/i);
	if (m) {
		const [, head, addr] = m;
		const am = addr.match(/^(layer\.\d+)\.(.*)$/i);
		if (am) {
			const [, base, rest] = am;
			const parts = rest.split(".");
			const partial = parts.pop() ?? "";
			const parent = parts[parts.length - 1] ?? "";
			const kids = (CHILDREN[parent] ?? []).filter((k) => k.startsWith(partial.toLowerCase()));
			return kids.map((k) => head + [base, ...parts, k].join("."));
		}
		if ("layer.12".startsWith(addr.toLowerCase()) && addr.length > 0) return [head + "layer.12"];
		return [];
	}
	const verbs = live ? LIVE_VERBS : SNAPSHOT_VERBS;
	const up = input.toUpperCase();
	return input.length > 0 ? verbs.filter((v) => v.toUpperCase().startsWith(up) && v.toUpperCase() !== up) : [];
}

function snapshotBanner(model: string | null): Line[] {
	// A recorded model is not a connection. Saying "Connected" over a
	// record would be the substitution this whole surface exists to
	// refuse — so the verb changes with the thing.
	if (model === "qwen3.8-27b") {
		return [
			{ text: "Opened — qwen3.8-27b · recorded · schema 6 · 18.4 GiB deployable", tone: "ok" },
			{
				text: "This is a RECORD, not a connection: the container is not distributed, and these panels are runs made against it.",
				tone: "dim",
			},
			{
				text: "Storage and quality measured · Q-BANK-1, 1,740 positions — try SHOW PRECISION, DIFF BF16 NVFP4 layer.0.ffn.down, VERIFY",
				tone: "dim",
			},
		];
	}
	return [
		{ text: "Connected — " + SNAPSHOT_ID, tone: "ok" },
		{ text: "Profile: PUBLIC_EXPLORER (read-only) · the live endpoint connects quietly in the background", tone: "dim" },
		{ text: "Type now — HELP for the grammar, Tab completes, or start with TREE layer.12;", tone: "dim" },
	];
}

export function VindexTerminal() {
	const [transport, setTransport] = useState<Transport>("snapshot");
	// The demo model is open from the first keystroke — no ritual
	// between a visitor and their first WALK.
	// The URL may name the model: /explorer?model=qwen3.8-27b opens that
	// record directly, so a link can land on the thing it is about.
	const [model, setModel] = useState<string | null>("vindex3-demo");
	const [notice, setNotice] = useState<Line | undefined>(undefined);
	const [autorun, setAutorun] = useState<string | undefined>(undefined);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const named = params.get("model");
		if (named && MODELS.some((m) => m.name === named)) setModel(named);
		setAutorun(params.get("run") ?? undefined);
		let cancelled = false;
		(async () => {
			try {
				// Generous timeout: the machine auto-stops when idle and a
				// cold start takes a few seconds. Nobody waits on this —
				// the snapshot answers from the first keystroke.
				const r = await fetch(`${LIVE_ENDPOINT}/v1/health`, { signal: AbortSignal.timeout(20000) });
				if (cancelled || !r.ok) return;
				// The live endpoint serves vindex3-demo and nothing else.
				// Switching a Qwen record onto it would answer Qwen
				// questions with another model's container — quietly, and
				// with a green LIVE line vouching for it.
				if (named === "qwen3.8-27b") return;
				setTransport("live");
				setNotice({
					text: "● LIVE — " + LIVE_ENDPOINT.replace("https://", "") + " connected · profile PUBLIC_EXPLORER · statements now execute on a real container (vindex3-demo: miniature, synthetic weights — the format is real)",
					tone: "ok",
				});
			} catch {
				/* the snapshot is already serving */
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	async function runLive(raw: string): Promise<TerminalResult> {
		const trimmed = raw.trim().replace(/;+$/, "");
		const up = trimmed.toUpperCase();
		if (up === "CLEAR") return { lines: [], clear: true };
		if (up === "HELP" || up === "?") return { lines: LIVE_HELP };
		const dm = trimmed.match(/^DESCRIBE\s+(\S+)$/i);
		if (dm) {
			const semantic = semanticPanel(dm[1]);
			if (semantic) return semantic;
		}
		if (/^SHOW\s+PRECISION$/i.test(trimmed)) return { lines: [], panel: precisionPanel(panelModel(model)) };
		const em = trimmed.match(/^EXPLAIN\s+REPRESENTATION\s+(\S+)$/i);
		if (em) return { lines: [], panel: explainRepresentationPanel(em[1]) };
		const dfm = trimmed.match(/^DIFF\s+(?:BF16\s+NVFP4\s+)?(\S+)$/i);
		if (dfm) return { lines: [], panel: diffPanel(dfm[1], panelModel(model)) };
		if (/^VERIFY$/i.test(trimmed)) return { lines: [], panel: verifyPanel(panelModel(model)) };
		// The typed protocol endpoints: structured facts from the REAL
		// container, rendered as designed panels — RAW is the server's
		// own JSON. A failed fetch falls through to /v1/query lines.
		const LIVE_TAG = "live · " + LIVE_ENDPOINT.replace("https://", "");
		const typed = async <T,>(path: string, build: (data: T) => TerminalResult): Promise<TerminalResult | null> => {
			try {
				const r = await fetch(`${LIVE_ENDPOINT}${path}`, { signal: AbortSignal.timeout(15000) });
				if (!r.ok) return null;
				return build((await r.json()) as T);
			} catch {
				return null;
			}
		};
		if (/^(SHOW\s+COMPONENTS|TREE\b)/i.test(trimmed)) {
			const result = await typed<ComponentsData>("/v1/components", (d) => ({ lines: [], panel: componentsPanel(d, LIVE_TAG) }));
			if (result) return result;
		}
		if (/^SHOW\s+REPRESENTATIONS/i.test(trimmed)) {
			const result = await typed<RepresentationsData>("/v1/representations", (d) => ({ lines: [], panel: representationsPanel(d, LIVE_TAG) }));
			if (result) return result;
		}
		if (/^SHOW\s+PROVENANCE/i.test(trimmed)) {
			const result = await typed<ProvenanceData>("/v1/provenance", (d) => ({ lines: [], panel: provenancePanel(d, LIVE_TAG) }));
			if (result) return result;
		}
		if (/^SHOW\s+AUTHORITY/i.test(trimmed)) {
			const result = await typed<AuthorityData>("/v1/authority", (d) => ({ lines: [], panel: authorityPanel(d, LIVE_TAG) }));
			if (result) return result;
		}
		if (/^STATS\b/i.test(trimmed)) {
			const result = await typed<Record<string, unknown>>("/v1/stats", (d) => ({ lines: [], panel: statsPanel(d, LIVE_TAG) }));
			if (result) return result;
		}
		if (FORBIDDEN.test(trimmed))
			return {
				refused: true,
				lines: [{ text: `${trimmed.split(/\s+/)[0].toUpperCase()}: no such operation in this universe`, tone: "err" }],
			};
		try {
			const r = await fetch(`${LIVE_ENDPOINT}/v1/query`, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ statement: trimmed + ";" }),
				signal: AbortSignal.timeout(30000),
			});
			const body = (await r.json().catch(() => null)) as { lines?: string[]; error?: string } | null;
			const outLines = body?.lines;
			if (r.ok && outLines) return { lines: outLines.map((text) => ({ text })) };
			const lines: Line[] = [{ text: body?.error ?? `the endpoint answered ${r.status}`, tone: "err" }];
			if (r.status === 403) lines.push({ text: "refused in the server, after parsing, before execution — nothing began", tone: "dim" });
			return { refused: true, lines };
		} catch {
			return {
				refused: true,
				lines: [{ text: "the live endpoint did not answer — the snapshot still serves; try again for live", tone: "err" }],
			};
		}
	}

	function runSnapshot(raw: string): TerminalResult {
		const cmd = parse(raw);
		const out = execute(cmd, model);
		if (out.model !== undefined) setModel(out.model);
		return {
			lines: out.lines,
			panel: out.panel,
			clear: out.clear,
			refused: cmd.kind === "forbidden" || (cmd.kind === "unknown" && cmd.input !== ""),
		};
	}

	return (
		<Terminal
			kicker="THE EXPLORER — ENTER A MODEL"
			headline="psql, for a model."
			banner={transport === "live" ? liveBanner() : snapshotBanner(model)}
			prompt="vindex>"
			seeds={transport === "live" ? LIVE_SEED : SEED}
			execute={(line) => (transport === "live" ? runLive(line) : runSnapshot(line))}
			complete={(line) => completeLine(line, transport === "live")}
			autorun={autorun}
			notice={notice}
			fallback="Type from the first moment: the immutable snapshot answers instantly, and when the live endpoint wakes, a quiet ● LIVE line appears and the same grammar starts executing on a real container — the capability profile enforced in the server, after parsing, before execution. And a command need not return text: DESCRIBE a semantic address or WALK the weights and the answer arrives as a designed object — the HAUSE rendering in front, the RAW structured result one tab away, joined to the same knowledge graph Ask resolves."
			footnote="The model is the database — as an interaction, not a metaphor. Read-only · rate-limited · nothing to drop."
		/>
	);
}
