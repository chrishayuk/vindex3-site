import type { Metadata } from "next";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { Observation } from "@chrishayuk/hause/components/forms/Observation";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";
import { VindexTerminal } from "@/components/VindexTerminal";
import { cliBadge } from "@/data/release";

const TRANSPORTS: {
	kicker: string;
	/// "LIVE" for the served endpoint, "DRAFT" for a surface still being
	/// designed, or the CLI badge from `data/release` — never a version
	/// typed in here, which is how the footer came to cite 0.5.0 for a
	/// week after 0.8.0 shipped.
	status: string;
	lines: string[];
	caption: string;
}[] = [
	{
		kicker: "VINDEX3.ORG",
		status: "LIVE",
		lines: ['vindex> WALK "the capital of France" TOP 3', "vindex> TREE layer.12", "vindex> DESCRIBE layer.12.attention"],
		caption:
			"The terminal above — a browser speaking the query surface against the hardened public endpoint: a real container, the profile enforced in the server. When the endpoint sleeps, an immutable snapshot answers instead.",
	},
	{
		kicker: "THE VINDEX CLI",
		status: cliBadge(),
		lines: ["$ vindex encode hf://Qwen/Qwen3-0.6B --output qwen3-0.6b", "$ vindex inspect qwen3-0.6b", "$ vindex plan hf://zai-org/GLM-5.3-Flash --json"],
		caption:
			"On your machine. From 0.8.0 vindex brings a model in directly from Hugging Face — headers first, then bytes over ranges, the checkpoint never landing on disk — and every reading verb (inspect, describe, representations, diff, represent, precision, verify, export) answers from the artifact alone, speaking --json. plan says what VINDEX understands about any repo from its headers, and since plan schema 4 the verdict names the commit it judged and the planner that judged it.",
	},
	{
		kicker: "THE QUERY PROTOCOL",
		status: "DRAFT",
		lines: [
			"GET  /v1/capabilities",
			"GET  /v1/models",
			"GET  /v1/components/:address",
			"GET  …/:address/representations",
			"GET  …/:address/provenance",
			"POST /v1/plan",
			"POST /v1/query",
		],
		caption:
			"Between the two, a surface small enough to stay stable. This site is one client. The CLI is another. Any independent VINDEX3 reader could serve it. Two of these are load-bearing rather than convenient: /v1/capabilities is how a client learns what a server will do instead of inferring it from the address — a server enforces its own profile and says so, and this page hides any control the answer does not authorise. /v1/plan judges a model that has not been brought in yet, from its headers, so entering a model can begin before the model exists locally.",
	},
];

function Transports() {
	return (
		<section className="hause-grid py-16 sm:py-24">
			{TRANSPORTS.map((t) => (
				<div key={t.kicker} className="col-span-12 md:col-span-4 mb-10 md:mb-0 flex flex-col">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-3">
						<span className="opacity-50">{t.kicker} · </span>
						<span style={{ color: t.status === "LIVE" ? "var(--color-status-supported)" : "var(--color-accent)" }}>
							{t.status}
						</span>
					</p>
					<div className="border p-4 mb-4" style={{ borderColor: "var(--color-mist)", background: "var(--color-ink)" }}>
						{t.lines.map((l) => (
							<p key={l} className="voice-evidence text-[12px] leading-relaxed whitespace-pre" style={{ color: "var(--color-white)" }}>
								{l}
							</p>
						))}
					</div>
					<p className="voice-system text-sm opacity-70 leading-relaxed">{t.caption}</p>
				</div>
			))}
			<div className="col-span-12 mt-2 flex flex-wrap gap-x-6 gap-y-2">
				<a
					href="https://github.com/chrishayuk/larql/blob/main/docs/vindex3-format.md"
					className="voice-evidence text-[11px] tracking-[0.1em] uppercase border-b pb-0.5 opacity-70 hover:opacity-100"
					style={{ borderColor: "var(--color-accent)" }}
				>
					THE SPEC · vindex3-format.md →
				</a>
				<a
					href="https://github.com/chrishayuk/larql/tree/main/crates/vindex-cli"
					className="voice-evidence text-[11px] tracking-[0.1em] uppercase border-b pb-0.5 opacity-70 hover:opacity-100"
					style={{ borderColor: "var(--color-accent)" }}
				>
					THE CLI · crates/vindex-cli →
				</a>
				<a
					href="/get-started"
					className="voice-evidence text-[11px] tracking-[0.1em] uppercase border-b pb-0.5 opacity-70 hover:opacity-100"
					style={{ borderColor: "var(--color-accent)" }}
				>
					GET STARTED · INSTALL &amp; RUN IT LOCALLY →
				</a>
			</div>
		</section>
	);
}

export const metadata: Metadata = {
	title: "Explore & Query an AI Model Artifact Like a Database",
	alternates: { canonical: "/explorer" },
	description: "Enter a model — a read-only VINDEX3 query surface: walk components, representations, provenance, and execution plans.",
};

export default function ExplorerPage() {
	return (
		<main>
			<Hero
				kicker="THE EXPLORER · PROFILE PUBLIC_EXPLORER · READ-ONLY"
				title="ENTER A MODEL"
				dek="Most model sites let you download, run, chat. Here you enter, inspect, query, walk — because the model is the database, as an interaction, not a metaphor."
			/>

			<VindexTerminal />

			<Statement text="Every interactive feature on this site demonstrates something the format itself makes possible." />

			<Observation
				label="ONE GRAMMAR, THREE TRANSPORTS"
				text="The terminal above is not a demo language — it is the format's query surface, and it is built to travel. The same commands will run on your machine, against a local container, through a small command-line tool that owns nothing but the format. Between the two sits a deliberately tiny protocol. Same commands, same semantics, different transport."
			/>

			<Transports />

			<Statement text="The rule that keeps the grammar honest: if an independent implementation could support a command, it belongs. If only one engine could, it stays out." />

			<Connection
				text="The chapters explain what you are walking."
				links={[
					{ href: "/container", label: "ONE DIRECTORY, ONE ROOT" },
					{ href: "/ask", label: "ASK VINDEX3 — NATURAL LANGUAGE, SAME UNIVERSE" },
					{ href: "/ladder", label: "THE RECORD" },
				]}
			/>
		</main>
	);
}
