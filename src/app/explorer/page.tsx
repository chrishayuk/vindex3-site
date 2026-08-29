import type { Metadata } from "next";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";
import { VindexTerminal } from "@/components/VindexTerminal";

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

			<Connection
				text="The grammar here is exactly the subset any independent VINDEX3 implementation could support — nothing engine-specific. The chapters explain what you are walking."
				links={[
					{ href: "/container", label: "ONE DIRECTORY, ONE ROOT" },
					{ href: "/ask", label: "ASK VINDEX3 — NATURAL LANGUAGE, SAME UNIVERSE" },
					{ href: "/ladder", label: "THE RECORD" },
				]}
			/>
		</main>
	);
}
