import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@chrishayuk/hause/components/JsonLd";
import { breadcrumbLd, techArticleLd } from "@chrishayuk/hause/seo";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Answer } from "@chrishayuk/hause/components/forms/Answer";
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { Observation } from "@chrishayuk/hause/components/forms/Observation";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";
import { Provenance } from "@chrishayuk/hause/components/forms/Provenance";
import { Citation } from "@chrishayuk/hause/components/forms/Citation";
import { displayDate } from "@chrishayuk/hause/cite";
import { SPEC, SPEC_HISTORY, CITABLE_SLUGS, chapterRecord } from "@/data/citation";

export const metadata: Metadata = {
	title: "How to Cite VINDEX3: The Specification & Its Chapters",
	alternates: { canonical: "/cite" },
	description:
		"The canonical reference for VINDEX3 3.0 in plain text, BibTeX, APA and CSL-JSON — how to cite the specification, how to cite a single chapter, and why the version is the thing you cite.",
};

/**
 * The reference desk. Every chapter of this site carries its own
 * provenance line and its own reference; this page says what the
 * canonical citable object is, and hands over the four formats.
 *
 * Nothing here is asserted that the record does not hold — there is no
 * DOI on this page because none has been registered, and the page says
 * so rather than promising one.
 */
export default function CitePage() {
	return (
		<main>
			<JsonLd
				data={techArticleLd({
					headline: "How to Cite VINDEX3",
					description:
						"The canonical reference for the VINDEX3 3.0 Candidate specification, and for the individual chapters that make it up.",
					url: "https://vindex3.org/cite",
					siteUrl: "https://vindex3.org",
					siteName: "VINDEX3",
					dateModified: "2026-08-31",
					about: ["citation", "provenance", "specification versioning"],
				})}
			/>
			<JsonLd
				data={breadcrumbLd([
					{ name: "VINDEX3", url: "https://vindex3.org" },
					{ name: "How to cite", url: "https://vindex3.org/cite" },
				])}
			/>

			<Hero
				kicker="THE REFERENCE DESK · 3.0 CANDIDATE"
				title="CITE THE VERSION, NOT THE SITE"
				dek="A specification that changes underneath you is a specification nobody can cite. The version is the object: it has an author, a date, a canonical URL, and a status only the Record can move. Take the reference below, in whichever form your bibliography speaks."
			/>

			<Answer
				id="how-do-i-cite-vindex3"
				question="How do I cite VINDEX3?"
				answer="Cite the version, not the website: VINDEX3 Specification, Version 3.0 Candidate, by Chris Hay, first published 30 August 2026 at vindex3.org/3.0. That URL is durable — 3.1 will be published as a different object rather than as a silent edit of this one. The reference is below in plain text, BibTeX, APA and CSL-JSON, and every chapter of this site carries the same four surfaces: a provenance line, a reference, citation tags in the head, and JSON-LD in the graph."
			/>

			<Provenance record={SPEC} history={SPEC_HISTORY} citeHref="#cite" />

			<Citation
				record={SPEC}
				kicker="THE CANONICAL REFERENCE"
				note="Four surfaces, one record. What you copy here is what this site declares in its head tags and in its structured data — the reference cannot drift from the page, because neither of them is written by hand."
			/>

			<Statement text="A claim that cannot be dated is a claim that cannot be defended." />

			<Observation
				label="NO DOI — AND THE REFERENCE IS STILL COMPLETE"
				text="No DOI has been registered for 3.0, so none appears above. An identifier that does not exist is absent here rather than promised: a reference carrying an author, a version, a first-publication date and a canonical URL is enough for a bibliography to resolve, and enough for a reader to check what was said and when. If a registered identifier is ever minted for a version, it joins the record and appears in all four places at once."
			/>

			<section className="hause-grid py-16 sm:py-24">
				<div className="col-span-12 md:col-start-2 md:col-span-10">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-8 opacity-50">
						CITABLE CHAPTERS — EACH WITH ITS OWN REFERENCE
					</p>
					<div className="flex flex-col">
						{CITABLE_SLUGS.map((slug) => {
							const rec = chapterRecord(slug);
							return (
								<Link
									key={slug}
									href={`${slug}#cite`}
									className="group grid grid-cols-[1fr_auto] sm:grid-cols-[minmax(0,13rem)_1fr_auto] gap-3 sm:gap-6 items-baseline py-3 border-t"
									style={{ borderColor: "var(--color-mist)" }}
								>
									<span className="voice-evidence text-xs sm:text-sm tracking-[0.06em]" style={{ color: "var(--color-accent)" }}>
										{rec.title} →
									</span>
									<span className="voice-system text-sm opacity-60 group-hover:opacity-90 transition-opacity hidden sm:block">
										{rec.abstract}
									</span>
									<span className="voice-evidence text-[10px] tracking-[0.08em] uppercase opacity-40 whitespace-nowrap">
										{displayDate(rec.published)}
										{rec.revised ? ` · REV ${displayDate(rec.revised)}` : ""}
									</span>
								</Link>
							);
						})}
						<div className="border-t" style={{ borderColor: "var(--color-mist)" }} />
					</div>
					<p className="voice-system text-sm opacity-60 max-w-2xl mt-8">
						Each chapter belongs to the specification it appeared in, so its reference names both: the chapter, then
						the version. The Explorer, Ask and the on-ramp carry no reference — they are instruments, and citing an
						instrument cites nothing.
					</p>
				</div>
			</section>

			<Answer
				id="can-i-cite-one-chapter"
				question="Can I cite a single chapter rather than the whole specification?"
				answer="Yes. Every chapter listed above carries its own reference at the foot of the page, naming the chapter, its first publication date, and the specification version it belongs to — for example: Hay, C. (2026). The Bytes. In VINDEX3 Specification (Version 3.0 Candidate). VINDEX3. https://vindex3.org/bytes. Chapter dates are first-publication dates; a substantive revision sets a separate revised date and never quietly moves the original."
			/>

			<Connection
				text="The version itself, with the six claims and the gates that remain — and the Record every date here answers to."
				links={[
					{ href: "/3.0", label: "3.0 — VERSION & STATUS" },
					{ href: "/ladder", label: "THE RECORD" },
					{ href: "/get-started", label: "RUN IT YOURSELF" },
				]}
			/>
		</main>
	);
}
