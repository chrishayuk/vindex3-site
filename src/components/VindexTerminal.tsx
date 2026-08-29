"use client";

import { useRef, useState } from "react";
import { tick, refuse } from "@chrishayuk/hause/sound";

/**
 * ENTER A MODEL — the terminal.
 *
 * psql for a model: a terminal-shaped, read-only VINDEX3 query
 * surface. The browser parses each line into a tiny allowlisted AST —
 * if a capability is not represented there, it cannot happen; shell
 * syntax and mutation verbs simply do not exist in this universe.
 *
 * V1 executes against an immutable demo snapshot compiled into the
 * site (the same worked-example container the Bytes encoder uses),
 * and the banner says so. The transport is designed to swap to a
 * live public VINDEX query endpoint (profile PUBLIC_EXPLORER) without
 * changing the grammar: byte-level READ and INFER already answer
 * honestly that they require the live endpoint.
 */

type Line = { text: string; tone?: "accent" | "dim" | "err" | "ok" };

const SNAPSHOT_ID = "vindex3-demo · compiled snapshot · 3.0-draft-2 / 2026-08-29";

// ---------- the demo universe (matches the Bytes encoder's worked example) ----------
const MODELS = [
	{ name: "vindex3-demo", size: "15.2 GiB", arch: "moe-decoder", status: "READY (snapshot)" },
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

// ---------- the allowlisted AST ----------
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
	| { kind: "walk"; address: string }
	| { kind: "find"; term: string }
	| { kind: "explain-plan"; layer?: number }
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
	m = s.match(/^WALK\s+(\S+)$/i);
	if (m) return { kind: "walk", address: m[1] };
	m = s.match(/^FIND\s+(.+)$/i);
	if (m) return { kind: "find", term: m[1] };
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
	{ text: "  WALK <address>                      traverse its graph" },
	{ text: "  SHOW REPRESENTATIONS [<address>]    the physical variants" },
	{ text: "  SHOW PROVENANCE [<address>]         hashes and lineage" },
	{ text: "  SHOW AUTHORITY [<address>]          the derived fidelity" },
	{ text: "  EXPLAIN EXECUTION [layer.N]         the generic op program" },
	{ text: "  FIND <term>                         search the catalogue" },
	{ text: "  READ <addr>[a..b]                   raw bytes (live endpoint)" },
	{ text: "  INFER <prompt>                      execute (live endpoint)" },
	{ text: "  SNAPSHOT · HELP · CLEAR", tone: "dim" },
];

function execute(cmd: Cmd, model: string | null): { lines: Line[]; model?: string | null; clear?: boolean } {
	const need = (): Line[] => [{ text: "no model open — OPEN vindex3-demo first", tone: "err" }];
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
		case "use":
			if (cmd.model !== "vindex3-demo")
				return {
					lines: [
						{ text: `${cmd.model}: LIVE ENDPOINT PENDING`, tone: "err" },
						{ text: "this snapshot mounts vindex3-demo only — real containers arrive with the live VINDEX query endpoint", tone: "dim" },
					],
				};
			return { lines: [{ text: "opened — vindex3-demo (worked example · 24 layers · 32 experts · moe-decoder)", tone: "ok" }], model: "vindex3-demo" };
		case "show-components":
			if (!model) return { lines: need() };
			if (cmd.layer !== undefined) {
				if (cmd.layer < 0 || cmd.layer >= DEMO.layers) return { lines: [{ text: `layer.${cmd.layer}: out of range — 0..${DEMO.layers - 1}`, tone: "err" }] };
				return { lines: DEMO.layerObjects(cmd.layer).map((t) => ({ text: t })) };
			}
			return { lines: [...DEMO.components.map((t) => ({ text: t })), { text: `layers 0..${DEMO.layers - 1} — SHOW COMPONENTS layer.N to open one`, tone: "dim" }] };
		case "describe": {
			if (!model) return { lines: need() };
			const a = cmd.address;
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
		case "walk": {
			if (!model) return { lines: need() };
			const lm = cmd.address.match(/^layer\.(\d+)/i);
			const l = lm ? Number(lm[1]) : 12;
			return {
				lines: [
					{ text: `layer.${l}` },
					{ text: ` ├─ part_of        → target.decoder_stack` },
					{ text: ` ├─ attention      → q/k/v/o · bf16` },
					{ text: ` ├─ router         → 32 × 2048 · preserved` },
					{ text: ` ├─ routed.gate_up → 32 experts${l === 12 ? " · 2 representations" : ""}`, tone: l === 12 ? "accent" : undefined },
					{ text: ` └─ routed.down    → 32 experts` },
					{ text: `every edge is data in the container — nothing here was inferred from a name`, tone: "dim" },
				],
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

const SEED = ["SHOW MODELS", "OPEN vindex3-demo", "WALK layer.12", "DESCRIBE layer.12.routed.gate_up", "SHOW AUTHORITY layer.12", "EXPLAIN EXECUTION layer.12"];

export function VindexTerminal() {
	const [lines, setLines] = useState<Line[]>([
		{ text: "Connected — " + SNAPSHOT_ID, tone: "ok" },
		{ text: "Profile: PUBLIC_EXPLORER (read-only) · live endpoint: pending", tone: "dim" },
		{ text: "Type HELP, or start with SHOW MODELS;", tone: "dim" },
	]);
	const [input, setInput] = useState("");
	const [model, setModel] = useState<string | null>(null);
	const endRef = useRef<HTMLDivElement>(null);

	function run(raw: string) {
		const cmd = parse(raw);
		if (cmd.kind === "forbidden" || (cmd.kind === "unknown" && cmd.input)) refuse();
		else tick();
		const prompt = model ? `vindex/${model.split("-")[0]}>` : "vindex>";
		const out = execute(cmd, model);
		setLines((prev) => (out.clear ? [] : [...prev, { text: `${prompt} ${raw}`, tone: "accent" }, ...out.lines]));
		if (out.model !== undefined) setModel(out.model);
		setInput("");
		requestAnimationFrame(() => endRef.current?.scrollIntoView({ block: "nearest" }));
	}

	return (
		<section className="hause-grid py-16 sm:py-24">
			<div className="col-span-12 md:col-start-2 md:col-span-10 lg:col-span-9">
				<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-3 opacity-50">
					THE EXPLORER — ENTER A MODEL
				</p>
				<p className="voice-editorial text-2xl sm:text-3xl mb-8 max-w-2xl">psql, for a model.</p>

				<div
					className="border p-4 sm:p-6 overflow-y-auto"
					style={{ borderColor: "var(--fg)", background: "var(--color-ink)", height: 420 }}
					onClick={() => (document.getElementById("vt-input") as HTMLInputElement | null)?.focus()}
				>
					<div className="flex flex-col gap-1">
						{lines.map((l, i) => (
							<p
								key={i}
								className="voice-evidence text-[12px] sm:text-[13px] leading-relaxed whitespace-pre-wrap"
								style={{
									color:
										l.tone === "accent"
											? "var(--color-accent)"
											: l.tone === "err"
												? "var(--color-status-refuted)"
												: l.tone === "ok"
													? "var(--color-status-supported)"
													: "var(--color-white)",
									opacity: l.tone === "dim" ? 0.55 : 1,
								}}
							>
								{l.text}
							</p>
						))}
					</div>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							if (input.trim()) run(input);
						}}
						className="flex gap-2 mt-2"
					>
						<span className="voice-evidence text-[13px]" style={{ color: "var(--color-accent)" }}>
							{model ? `vindex/${model.split("-")[0]}>` : "vindex>"}
						</span>
						<input
							id="vt-input"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							aria-label="Terminal input"
							autoComplete="off"
							spellCheck={false}
							className="voice-evidence text-[13px] flex-1 bg-transparent outline-none"
							style={{ color: "var(--color-white)", caretColor: "var(--color-accent)" }}
						/>
					</form>
					<div ref={endRef} />
				</div>

				<div className="flex flex-wrap gap-2 mt-4">
					{SEED.map((s) => (
						<button key={s} onClick={() => run(s)} className="voice-evidence text-[11px] px-3 py-1.5 border opacity-70 hover:opacity-100" style={{ borderColor: "var(--color-mist)" }}>
							{s}
						</button>
					))}
				</div>

				<p className="voice-system text-sm opacity-70 leading-relaxed max-w-2xl mt-6">
					Every line is parsed into a tiny allowlisted command set before anything executes — mutation verbs are
					not represented, so they cannot happen. The universe is an immutable snapshot compiled into this site;
					when the live VINDEX query endpoint lands, the same grammar walks a real container, and READ and INFER stop
					refusing.
				</p>
				<p className="voice-evidence text-xs opacity-40 leading-relaxed max-w-2xl mt-3">
					The model is the database — as an interaction, not a metaphor. Read-only · rate-free · nothing to drop.
				</p>
			</div>
		</section>
	);
}
