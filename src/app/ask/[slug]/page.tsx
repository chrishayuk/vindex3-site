import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@chrishayuk/hause/components/JsonLd";
import { breadcrumbLd, qaLd } from "@chrishayuk/hause/seo";
import { CANON, ENTITIES } from "@/data/vindexGraph";
import { askSlug, conceptSlug } from "@/data/legibility";

/**
 * One canonical answer, one permanent URL — the same structured
 * response Ask renders interactively, projected as a clean page a
 * search engine or answer engine can discover and cite. Graph-derived,
 * so it cannot drift from what Ask says.
 */

export function generateStaticParams() {
	return CANON.map((c) => ({ slug: askSlug(c.id) }));
}

function entry(slug: string) {
	return CANON.find((c) => askSlug(c.id) === slug);
}

function titleCase(s: string) {
	return s.charAt(0).toUpperCase() + s.slice(1);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	const { slug } = await params;
	const c = entry(slug);
	if (!c) return {};
	return {
		title: titleCase(c.summary),
		description: c.answer.length > 155 ? `${c.answer.slice(0, 152)}…` : c.answer,
		alternates: { canonical: `/ask/${slug}` },
	};
}

export default async function AskAnswerPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const c = entry(slug);
	if (!c) notFound();
	const related = c.explore
		.map((id) => ENTITIES.find((e) => e.id === id))
		.filter((e): e is NonNullable<typeof e> => Boolean(e));
	const url = `https://vindex3.org/ask/${slug}`;
	return (
		<main>
			<JsonLd data={qaLd({ question: titleCase(c.summary), answer: c.answer, url })} />
			<JsonLd
				data={breadcrumbLd([
					{ name: "VINDEX3", url: "https://vindex3.org" },
					{ name: "Ask", url: "https://vindex3.org/ask" },
					{ name: titleCase(c.summary), url },
				])}
			/>
			<section className="hause-grid pt-20 pb-8">
				<div className="col-span-12 md:col-start-2 md:col-span-9">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase opacity-50 mb-4">
						A CANONICAL ANSWER · FROM THE VINDEX KNOWLEDGE GRAPH
					</p>
					<h1 className="voice-editorial text-3xl sm:text-5xl leading-[1.05] m-0">{titleCase(c.summary)}</h1>
				</div>
			</section>
			<section className="hause-grid py-8">
				<div className="col-span-12 md:col-start-2 md:col-span-8">
					<p className="voice-system text-base sm:text-lg leading-relaxed m-0 opacity-90">{c.answer}</p>
					{c.record && (
						<p className="voice-evidence text-[11px] mt-4 m-0" style={{ color: "var(--color-accent)" }}>
							{c.record.status} · {c.record.note}
						</p>
					)}
				</div>
			</section>
			{related.length > 0 && (
				<section className="hause-grid py-8">
					<div className="col-span-12 md:col-start-2 md:col-span-9">
						<p className="voice-evidence text-xs tracking-[0.14em] uppercase opacity-50 mb-3">RELATED</p>
						<div className="flex flex-wrap gap-2">
							{related.map((e) => (
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
			)}
			<section className="hause-grid py-10">
				<div className="col-span-12 md:col-start-2 md:col-span-9 flex flex-wrap gap-x-6 gap-y-2">
					<Link
						href="/ask"
						className="voice-evidence text-[11px] tracking-[0.1em] uppercase border-b pb-0.5 opacity-70 hover:opacity-100"
						style={{ borderColor: "var(--color-accent)" }}
					>
						ASK IT LIVE — THE INTERACTIVE SURFACE →
					</Link>
					<Link
						href="/explorer"
						className="voice-evidence text-[11px] tracking-[0.1em] uppercase border-b pb-0.5 opacity-70 hover:opacity-100"
						style={{ borderColor: "var(--color-accent)" }}
					>
						INTERROGATE A REAL CONTAINER →
					</Link>
				</div>
			</section>
		</main>
	);
}
