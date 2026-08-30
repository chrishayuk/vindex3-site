import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@chrishayuk/hause/components/JsonLd";
import { breadcrumbLd, definedTermLd } from "@chrishayuk/hause/seo";
import { ENTITIES } from "@/data/vindexGraph";
import { conceptSlug } from "@/data/legibility";

/**
 * A concept page is not a glossary entry anyone maintains — it is a
 * projection of one knowledge-graph entity: its definition, its
 * five-word signature, its relationships, and the Explorer command
 * that reaches it in a real artifact. The same record Ask answers
 * from and Anatomy renders. One graph, every surface.
 */

export function generateStaticParams() {
	return ENTITIES.map((e) => ({ slug: conceptSlug(e.id) }));
}

function entity(slug: string) {
	return ENTITIES.find((e) => conceptSlug(e.id) === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	const { slug } = await params;
	const e = entity(slug);
	if (!e) return {};
	return {
		title: `What Is ${e.display} in an LLM?`,
		description: e.role.length > 155 ? `${e.role.slice(0, 152)}…` : e.role,
		alternates: { canonical: `/concepts/${slug}` },
	};
}

export default async function ConceptPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const e = entity(slug);
	if (!e) notFound();
	const url = `https://vindex3.org/concepts/${slug}`;
	const related = e.relations
		.map((r) => ({ rel: r.rel, target: ENTITIES.find((x) => x.id === r.to) }))
		.filter((r): r is { rel: string; target: NonNullable<(typeof ENTITIES)[number]> } => Boolean(r.target));
	return (
		<main>
			<JsonLd
				data={definedTermLd({
					term: e.display,
					definition: e.role,
					url,
					setName: "The VINDEX knowledge graph",
					setUrl: "https://vindex3.org/concepts",
				})}
			/>
			<JsonLd
				data={breadcrumbLd([
					{ name: "VINDEX3", url: "https://vindex3.org" },
					{ name: "Concepts", url: "https://vindex3.org/concepts" },
					{ name: e.display, url },
				])}
			/>
			<section className="hause-grid pt-20 pb-8">
				<div className="col-span-12 md:col-start-2 md:col-span-9">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase opacity-50 mb-4">
						A CONCEPT · PROJECTED FROM THE VINDEX KNOWLEDGE GRAPH
					</p>
					<h1 className="voice-editorial text-4xl sm:text-6xl leading-[1.02] m-0">{e.display}</h1>
					<p className="voice-evidence text-sm mt-4 m-0" style={{ color: "var(--color-accent)" }}>
						{e.five}
					</p>
				</div>
			</section>
			<section className="hause-grid py-6">
				<div className="col-span-12 md:col-start-2 md:col-span-8">
					<p className="voice-system text-base sm:text-lg leading-relaxed m-0 opacity-90">{e.role}</p>
					<p className="voice-system text-sm leading-relaxed mt-5 m-0 opacity-70">{e.detail}</p>
				</div>
			</section>
			{related.length > 0 && (
				<section className="hause-grid py-8">
					<div className="col-span-12 md:col-start-2 md:col-span-9">
						<p className="voice-evidence text-xs tracking-[0.14em] uppercase opacity-50 mb-3">IN THE GRAPH</p>
						<div className="flex flex-col gap-1.5">
							{related.map((r, i) => (
								<p key={i} className="voice-evidence text-[12px] m-0 flex items-baseline gap-2 flex-wrap">
									<span>{e.display.toLowerCase()}</span>
									<span className="text-[10px] tracking-[0.08em] uppercase opacity-50">— {r.rel.replace(/_/g, " ")} →</span>
									<Link
										href={`/concepts/${conceptSlug(r.target.id)}`}
										className="border-b pb-0.5"
										style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)" }}
									>
										{r.target.display.toLowerCase()}
									</Link>
								</p>
							))}
						</div>
					</div>
				</section>
			)}
			<section className="hause-grid py-10">
				<div className="col-span-12 md:col-start-2 md:col-span-9 flex flex-wrap gap-x-6 gap-y-2">
					{e.explorer && (
						<Link
							href={`/explorer?run=${encodeURIComponent(e.explorer)}`}
							className="voice-evidence text-[11px] tracking-[0.1em] uppercase border-b pb-0.5 opacity-70 hover:opacity-100"
							style={{ borderColor: "var(--color-accent)" }}
						>
							SHOW ME — {e.explorer} →
						</Link>
					)}
					{e.href && (
						<Link
							href={e.href}
							className="voice-evidence text-[11px] tracking-[0.1em] uppercase border-b pb-0.5 opacity-70 hover:opacity-100"
							style={{ borderColor: "var(--color-accent)" }}
						>
							THE CHAPTER →
						</Link>
					)}
				</div>
			</section>
		</main>
	);
}
