import type { Metadata } from "next";
import Link from "next/link";
import { ENTITIES } from "@/data/vindexGraph";
import { conceptSlug } from "@/data/legibility";

export const metadata: Metadata = {
	title: "LLM Concepts, Defined: The VINDEX Knowledge Graph",
	alternates: { canonical: "/concepts" },
	description:
		"Every concept the VINDEX3 exhibition uses — attention, gate/up/down projections, experts, routers, representations, precision — defined once in a knowledge graph and projected here.",
};

export default function ConceptsIndexPage() {
	const groups = new Map<string, typeof ENTITIES>();
	for (const e of ENTITIES) {
		const g = groups.get(e.group) ?? [];
		g.push(e);
		groups.set(e.group, g);
	}
	return (
		<main>
			<section className="hause-grid pt-20 pb-8">
				<div className="col-span-12 md:col-start-2 md:col-span-9">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase opacity-50 mb-4">
						THE VINDEX KNOWLEDGE GRAPH · {ENTITIES.length} ENTITIES
					</p>
					<h1 className="voice-editorial text-4xl sm:text-6xl leading-[1.02] m-0">ONE GRAPH, EVERY SURFACE</h1>
					<p className="voice-system text-sm sm:text-base opacity-70 leading-relaxed max-w-2xl mt-6 m-0">
						These are not glossary entries anyone maintains. Each page is a projection of one knowledge-graph
						entity — the same record Ask answers from, the Anatomy renders, and the Explorer&apos;s DESCRIBE
						reaches. Definitions cannot drift, because there is one set of them.
					</p>
				</div>
			</section>
			{[...groups.entries()].map(([group, entities]) => (
				<section key={group} className="hause-grid py-6">
					<div className="col-span-12 md:col-start-2 md:col-span-9">
						<p className="voice-evidence text-xs tracking-[0.14em] uppercase opacity-50 mb-3">{group}</p>
						<div className="flex flex-wrap gap-2">
							{entities.map((e) => (
								<Link
									key={e.id}
									href={`/concepts/${conceptSlug(e.id)}`}
									className="voice-evidence text-[11px] px-3 py-1.5 border opacity-80 hover:opacity-100"
									style={{ borderColor: "var(--color-mist)" }}
								>
									{e.display}
								</Link>
							))}
						</div>
					</div>
				</section>
			))}
		</main>
	);
}
