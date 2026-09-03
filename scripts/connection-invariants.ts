/**
 * The Explorer's connection state, checked.
 *
 * The load-bearing one is SELECTION IS NOT LOADING: switching what you
 * are looking at must never touch the server-owned parts of the state.
 * It is asserted by reference identity, not deep equality — a selection
 * that rebuilt `serverModels` from a fetch would produce an equal array
 * and pass a value comparison while having gone to the server.
 */

import {
	actionsFor,
	applyServerState,
	emptyConnection,
	loadSources,
	MAX_RECENT,
	offers,
	pinSource,
	rememberSource,
	saveSources,
	select,
	selectSource,
	STORAGE_KEY,
	unpinSource,
	type Capabilities,
	type ExplorerConnection,
} from "../src/data/connection";

let failures = 0;
function check(label: string, condition: boolean, detail = "") {
	if (condition) return;
	failures += 1;
	console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
}

const caps: Capabilities = {
	schema: 1,
	profile: "public_explorer",
	server: { name: "larql-server", version: "0.2.0", revision: "3cd1207a" },
	sources: { plan: { hf: true, local: false }, encode: { hf: false, local: false } },
	explorer: { components: true, representations: true, provenance: true, authority: false },
	runtime: { execute: false, backends: ["cpu"] },
};

function connected(): ExplorerConnection {
	const base = emptyConnection("https://example.invalid");
	return {
		...base,
		server: { url: base.server.url, status: "connected", capabilities: caps },
		serverModels: [{ kind: "server-model", id: "qwen3-0.6b" }],
		runtime: { kind: "runtime-model", id: "vindex3-demo" },
	};
}

// ── selection is not loading ─────────────────────────────────────────
{
	const before = connected();
	const after = select(before, { kind: "source", ref: "hf://Qwen/Qwen3-4B" });
	check("selection leaves server models untouched", after.serverModels === before.serverModels);
	check("selection leaves the runtime binding untouched", after.runtime === before.runtime);
	check("selection leaves the server connection untouched", after.server === before.server);
	check("selection actually changed", after.selected?.kind === "source");

	const cleared = select(after, null);
	check("deselecting is allowed", cleared.selected === null);
	check("deselecting still touches nothing else", cleared.runtime === before.runtime);
}

// ── selection survives a server refresh, KIND included ───────────────
{
	// The user selected the encoded model. The server then binds that
	// same container into its runtime. Matching ids must not promote the
	// selection to a runtime reference: it would put an execute button
	// under a selection made in order to read provenance.
	const s = select(connected(), { kind: "server-model", id: "qwen3-0.6b" });
	const refreshed = applyServerState(s, {
		serverModels: [{ kind: "server-model", id: "qwen3-0.6b" }],
		runtime: { kind: "runtime-model", id: "qwen3-0.6b" },
		capabilities: caps,
	});
	check("a refresh keeps the selection's kind", refreshed.selected?.kind === "server-model");
	check(
		"a refresh keeps the selection's identity",
		refreshed.selected === s.selected,
		"the same object, not a rebuilt equal one",
	);
	check("the refresh did land the new runtime binding", refreshed.runtime?.id === "qwen3-0.6b");
	check("the refresh left browser sources alone", refreshed.browserSources === s.browserSources);

	// And the reverse: losing the binding does not clear a selection.
	const unbound = applyServerState(refreshed, { runtime: null });
	check("losing the runtime binding does not deselect", unbound.selected === s.selected);
	check("losing the runtime binding is recorded", unbound.runtime === null);

	// Going offline revokes capability, never selection.
	const offline = applyServerState(unbound, { status: "unreachable", capabilities: null });
	check("going offline keeps the selection", offline.selected === s.selected);
	check("going offline revokes what may be offered", actionsFor(offline, offline.selected).length === 0);
}

// ── three referents, three answers ───────────────────────────────────
{
	const s = connected();
	check(
		"a source can only be planned",
		JSON.stringify(actionsFor(s, { kind: "source", ref: "hf://x/y" })) === '["plan"]',
	);
	check(
		"an encoded model offers the reads the server advertises",
		JSON.stringify(actionsFor(s, { kind: "server-model", id: "m" })) ===
			'["components","representations","provenance"]',
		"authority is false in the report and must not be offered",
	);
	check(
		"a bound model offers nothing when the profile does not execute",
		actionsFor(s, { kind: "runtime-model", id: "m" }).length === 0,
	);
	check("no selection offers nothing", actionsFor(s, null).length === 0);
}

// ── absent means no ──────────────────────────────────────────────────
{
	const s = connected();
	check("a reported capability is offered", offers(s, "sources.plan.hf"));
	check("a false capability is not", !offers(s, "sources.plan.local"));
	check("an absent key is not", !offers(s, "explorer.residency"));
	check("a nonsense path is not", !offers(s, "sources.plan.hf.deeper"));
	const disconnected = { ...s, server: { ...s.server, status: "unreachable" as const } };
	check("a server that is not connected offers nothing", !offers(disconnected, "sources.plan.hf"));
}

// ── browser-owned sources ────────────────────────────────────────────
{
	let s = emptyConnection();
	s = rememberSource(s, "hf://a/one");
	s = rememberSource(s, "hf://b/two");
	s = rememberSource(s, "hf://a/one");
	check(
		"most recent first, no duplicates",
		JSON.stringify(s.browserSources.recent) === '["hf://a/one","hf://b/two"]',
	);
	check("blank input is ignored", rememberSource(s, "   ").browserSources.recent.length === 2);

	let many = emptyConnection();
	for (let i = 0; i < MAX_RECENT + 5; i += 1) many = rememberSource(many, `hf://o/r${i}`);
	check("recent is bounded", many.browserSources.recent.length === MAX_RECENT);

	const pinned = pinSource(s, "hf://a/one");
	check("pinning adds to pinned", pinned.browserSources.pinned.includes("hf://a/one"));
	check(
		"pinning removes from recent — it is the stronger statement",
		!pinned.browserSources.recent.includes("hf://a/one"),
	);
	check("pinning twice is idempotent", pinSource(pinned, "hf://a/one").browserSources.pinned.length === 1);
	check("unpinning removes it", unpinSource(pinned, "hf://a/one").browserSources.pinned.length === 0);

	const viaSelect = selectSource(emptyConnection(), "hf://c/three");
	check("selecting a source remembers it", viaSelect.browserSources.recent[0] === "hf://c/three");
	check("selecting a source selects it", viaSelect.selected?.kind === "source");
}

// ── persistence: sources only ────────────────────────────────────────
{
	const store = new Map<string, string>();
	const storage = {
		getItem: (k: string) => store.get(k) ?? null,
		setItem: (k: string, v: string) => void store.set(k, v),
	} as unknown as Storage;

	saveSources({ recent: ["hf://a/b"], pinned: ["hf://c/d"] }, storage);
	const back = loadSources(storage);
	check("sources round-trip", back.recent[0] === "hf://a/b" && back.pinned[0] === "hf://c/d");

	store.set(STORAGE_KEY, "{ not json");
	check("corrupt storage yields empty, not a throw", loadSources(storage).recent.length === 0);

	store.set(STORAGE_KEY, JSON.stringify({ recent: [1, "hf://ok", null] }));
	check("foreign entries are dropped, not coerced", JSON.stringify(loadSources(storage).recent) === '["hf://ok"]');

	check("absent storage is survivable", loadSources(null).pinned.length === 0);
	saveSources({ recent: [], pinned: [] }, null);
}

if (failures > 0) {
	console.error(`\n${failures} connection invariant(s) failed`);
	process.exit(1);
}
console.log("connection invariants pass — selection is not loading; absent capability means no");
