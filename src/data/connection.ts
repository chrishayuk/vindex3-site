/**
 * WHAT THE EXPLORER IS LOOKING AT, AND WHAT IT IS CONNECTED TO.
 *
 * The terminal used to hold `model: string | null`. That single string
 * stood for three different things, and the differences between them
 * are exactly the ones a user interface must not lose:
 *
 *   a SOURCE            a checkpoint on Hugging Face. Not here. Can be
 *                       planned from its headers; nothing is encoded.
 *   an ENCODED MODEL    a VINDEX3 container this server has. Can be
 *                       read — components, representations, provenance.
 *   a BOUND MODEL       the one container the server's runtime holds.
 *                       Can execute. There is at most one.
 *
 * Collapsing them lets the UI offer a run against something that has
 * not been encoded, or read components off a repo that was never
 * brought in. So the reference is a tagged union and the container is
 * called a Connection, not a Model — there is no single "the model"
 * for it to name.
 *
 * THE RULE THIS MODULE EXISTS TO ENFORCE: selection is not loading.
 * Switching what you are looking at never asks the server to bind,
 * unbind or retain anything. Binding is a separate act through the
 * runtime lifecycle, and it is the server's state, not the browser's.
 *
 * Three owners, kept apart:
 *   browser   recent and pinned sources     many, persisted locally
 *   server    encoded models (/v1/models)   many, server-owned
 *   runtime   the bound model (/v1/runtime) one, server-owned
 */

/** A checkpoint that has not been brought in. `hf://owner/repo`. */
export type SourceRef = { kind: "source"; ref: string };

/** A VINDEX3 container the connected server holds. */
export type ServerModelRef = { kind: "server-model"; id: string };

/** The single container the server's runtime has bound. */
export type RuntimeModelRef = { kind: "runtime-model"; id: string };

export type Reference = SourceRef | ServerModelRef | RuntimeModelRef;

/** The `GET /v1/capabilities` report, as much of it as this client reads. */
export type Capabilities = {
	schema: number;
	profile: string;
	server: { name: string; version: string; revision?: string };
	sources: Record<string, Record<string, boolean>>;
	explorer: Record<string, boolean>;
	runtime: Record<string, unknown> & { backends?: string[] };
};

/**
 * Why a server is not usable, when it is not.
 *
 * `unsupported-schema` is deliberately distinct from `unreachable`: a
 * server that answered with a contract this build does not know is a
 * different problem from one that did not answer, and refusing it is
 * the same discipline the CLI client applies.
 */
export type ServerStatus =
	| "disconnected"
	| "connecting"
	| "connected"
	| "unreachable"
	| "unsupported-schema";

export type ServerConnection = {
	url: string;
	status: ServerStatus;
	capabilities: Capabilities | null;
};

/** Sources the browser remembers. Never sent anywhere. */
export type BrowserSources = { recent: string[]; pinned: string[] };

export type ExplorerConnection = {
	server: ServerConnection;
	selected: Reference | null;
	browserSources: BrowserSources;
	/** From `/v1/models`. Empty until a server answers. */
	serverModels: ServerModelRef[];
	/** From `/v1/runtime`. At most one, and the server owns it. */
	runtime: RuntimeModelRef | null;
};

/** The capabilities schema this client reads. Anything else is refused. */
export const CAPABILITIES_SCHEMA = 1;

/** How many recent sources to keep. A convenience, not a store. */
export const MAX_RECENT = 8;

export function emptyConnection(url = ""): ExplorerConnection {
	return {
		server: { url, status: "disconnected", capabilities: null },
		selected: null,
		browserSources: { recent: [], pinned: [] },
		serverModels: [],
		runtime: null,
	};
}

// ── selection ────────────────────────────────────────────────────────

/**
 * Change what is being looked at. Nothing else.
 *
 * Returns a state whose `serverModels` and `runtime` are the SAME
 * values, not copies — so a test can assert identity and catch a
 * selection that quietly reached for the server.
 */
export function select(state: ExplorerConnection, ref: Reference | null): ExplorerConnection {
	return { ...state, selected: ref };
}

/** Selecting a source also remembers it, because a user who typed it will want it back. */
export function selectSource(state: ExplorerConnection, ref: string): ExplorerConnection {
	return rememberSource(select(state, { kind: "source", ref }), ref);
}

/**
 * Apply what the server reports. Server-owned parts only.
 *
 * The temporal half of "selection is not loading". A refresh brings new
 * capabilities, a new model list and a new runtime binding, and it must
 * leave `selected` exactly as the user left it — including its KIND.
 *
 * The trap this guards is specific: the user selects the encoded model
 * `qwen3-0.6b`, and the server later binds that same container into its
 * runtime. It is tempting to notice the ids match and promote the
 * selection to a `RuntimeModelRef`, since it is "the same model". It is
 * not the same referent. One is a container the server holds; the other
 * is the slot that can execute. Promoting silently changes what the UI
 * offers — an execute button appears under a selection the user made in
 * order to read provenance — and the user never asked for it.
 */
export function applyServerState(
	state: ExplorerConnection,
	update: {
		status?: ServerStatus;
		capabilities?: Capabilities | null;
		serverModels?: ServerModelRef[];
		runtime?: RuntimeModelRef | null;
	},
): ExplorerConnection {
	return {
		...state,
		server: {
			...state.server,
			status: update.status ?? state.server.status,
			capabilities:
				update.capabilities === undefined ? state.server.capabilities : update.capabilities,
		},
		serverModels: update.serverModels ?? state.serverModels,
		runtime: update.runtime === undefined ? state.runtime : update.runtime,
		// Untouched, deliberately and by construction rather than by
		// remembering to leave them alone.
		selected: state.selected,
		browserSources: state.browserSources,
	};
}

// ── browser-owned sources ────────────────────────────────────────────

export function rememberSource(state: ExplorerConnection, ref: string): ExplorerConnection {
	const trimmed = ref.trim();
	if (!trimmed) return state;
	// Most recent first, no duplicates, bounded. A pinned source is not
	// duplicated into recent — pinning is the stronger statement.
	const recent = [trimmed, ...state.browserSources.recent.filter((r) => r !== trimmed)].slice(
		0,
		MAX_RECENT,
	);
	return { ...state, browserSources: { ...state.browserSources, recent } };
}

export function pinSource(state: ExplorerConnection, ref: string): ExplorerConnection {
	const trimmed = ref.trim();
	if (!trimmed || state.browserSources.pinned.includes(trimmed)) return state;
	return {
		...state,
		browserSources: {
			pinned: [...state.browserSources.pinned, trimmed],
			recent: state.browserSources.recent.filter((r) => r !== trimmed),
		},
	};
}

export function unpinSource(state: ExplorerConnection, ref: string): ExplorerConnection {
	return {
		...state,
		browserSources: {
			...state.browserSources,
			pinned: state.browserSources.pinned.filter((r) => r !== ref),
		},
	};
}

// ── capability-driven availability ───────────────────────────────────

/**
 * Whether the connected server offers `capability`, named as a path
 * into the report: `sources.plan.hf`, `explorer.components`,
 * `runtime.execute`.
 *
 * Absent means NO. A disconnected server, a server that never reported
 * the key, and a server that reported `false` are all "do not offer
 * it" — the UI must not distinguish "unknown" from "no" by rendering a
 * control that then fails.
 */
export function offers(state: ExplorerConnection, capability: string): boolean {
	const caps = state.server.capabilities;
	if (!caps || state.server.status !== "connected") return false;
	let node: unknown = caps;
	for (const segment of capability.split(".")) {
		if (typeof node !== "object" || node === null) return false;
		node = (node as Record<string, unknown>)[segment];
	}
	return node === true;
}

/** What this server will do with a reference of each kind. */
export function actionsFor(state: ExplorerConnection, ref: Reference | null): string[] {
	if (!ref) return [];
	switch (ref.kind) {
		case "source":
			// A source is a checkpoint: it can be judged, never read as
			// a container and never executed.
			return offers(state, "sources.plan.hf") ? ["plan"] : [];
		case "server-model": {
			const reads = ["components", "representations", "provenance", "authority"];
			return reads.filter((r) => offers(state, `explorer.${r}`));
		}
		case "runtime-model":
			return offers(state, "runtime.execute") ? ["execute"] : [];
	}
}

// ── persistence: browser sources only ────────────────────────────────

export const STORAGE_KEY = "vindex3.explorer.sources";

/**
 * Only `browserSources` is persisted. Capabilities, server models and
 * the runtime binding are the server's to state, and a remembered copy
 * would let the page claim a capability the server no longer has.
 */
export function saveSources(sources: BrowserSources, storage: Storage | null): void {
	try {
		storage?.setItem(STORAGE_KEY, JSON.stringify(sources));
	} catch {
		/* a browser that refuses storage still works, with no memory */
	}
}

export function loadSources(storage: Storage | null): BrowserSources {
	try {
		const raw = storage?.getItem(STORAGE_KEY);
		if (!raw) return { recent: [], pinned: [] };
		const parsed = JSON.parse(raw) as Partial<BrowserSources>;
		const strings = (v: unknown): string[] =>
			Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
		return { recent: strings(parsed.recent).slice(0, MAX_RECENT), pinned: strings(parsed.pinned) };
	} catch {
		// Corrupt or foreign data is discarded, not repaired: this is a
		// convenience, and guessing at half-parsed state is worse.
		return { recent: [], pinned: [] };
	}
}
