import type { Metadata } from "next";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";
import { QueryVindex } from "@/components/QueryVindex";

export const metadata: Metadata = {
	title: "Ask",
	description: "Ask VINDEX3 — a deterministic query engine over the site's versioned knowledge graph: question → canonical form → graph path → evidence → answer.",
};

export default function AskPage() {
	return (
		<main>
			<Hero
				kicker="ASK VINDEX3 · THE GRAPH IS THE AUTHORITY · READ-ONLY"
				title="ASK"
				dek="Any answerable question about the public VINDEX3 universe — resolved against the knowledge graph, never guessed. Ask does not return chat: it returns typed VINDEX explanations — a definition, a component flow, a status report, the specification's own words — each rendered by HAUSE, each showing its interpretation, its path, and the Record line it answers to. When the graph does not establish something, Ask says exactly that."
			/>

			<QueryVindex />

			<Connection
				text="Prefer to walk the structure yourself?"
				links={[
					{ href: "/explorer", label: "THE EXPLORER — ENTER A MODEL" },
					{ href: "/ladder", label: "THE RECORD" },
				]}
			/>
		</main>
	);
}
