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
				kicker="ASK VINDEX3 · DETERMINISTIC · READ-ONLY"
				title="ASK"
				dek="Natural language in, evidence out — every answer shows how your question was interpreted, the graph path it traversed, and the Record line it answers to."
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
