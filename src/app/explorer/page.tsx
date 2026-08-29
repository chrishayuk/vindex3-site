import type { Metadata } from "next";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { Observation } from "@chrishayuk/hause/components/forms/Observation";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";
import { VindexTerminal } from "@/components/VindexTerminal";

const TRANSPORTS: {
	kicker: string;
	status: "LIVE" | "IN BUILD" | "DRAFT" | "V0 · IN THE REPO";
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
		status: "V0 · IN THE REPO",
		lines: ["$ vindex inspect model.vindex", "$ vindex diff model.vindex BF16 NVFP4 mlp.down", "$ vindex verify model.vindex --json"],
		caption:
			"On your machine, against a local container: inspect, describe, representations, diff, represent, precision, verify — every command answering from the artifact alone, every command speaking --json. No inference runtime attached: an artifact should not require an engine to be understood.",
	},
	{
		kicker: "THE QUERY PROTOCOL",
		status: "DRAFT",
		lines: [
			"GET  /v1/models",
			"GET  /v1/components/:address",
			"GET  …/:address/relations",
			"GET  …/:address/representations",
			"GET  …/:address/provenance",
			"POST /v1/query",
		],
		caption:
			"Between the two, a surface small enough to stay stable. This site is one client. The CLI is another. Any independent VINDEX3 reader could serve it.",
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
			</div>
		</section>
	);
}

export const metadata: Metadata = {
	title: "The Explorer",
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
