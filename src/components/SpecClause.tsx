import { Excerpt } from "@chrishayuk/hause/components/forms/Excerpt";
import type { SpecQuote } from "@/data/corpus";

/**
 * The SPEC depth of a Lens: the clause itself, verbatim from the
 * corpus, with a door to the whole document.
 *
 * Every chapter's deepest depth is the same shape, so it is one
 * component rather than seven copies — and because the text is
 * projected rather than retyped, a chapter cannot drift from the
 * specification it claims to be explaining.
 */
const DOC_HREF: Record<string, string> = {
	"vindex3-format-spec.md": "https://github.com/chrishayuk/larql/blob/main/crates/larql-vindex/docs/vindex3-format-spec.md",
	"vindex3-format.md": "https://github.com/chrishayuk/larql/blob/main/docs/vindex3-format.md",
	"vindex3-experiments.md": "https://github.com/chrishayuk/larql/blob/main/docs/vindex3-experiments.md",
	"vindex-generation-policy.md": "https://github.com/chrishayuk/larql/blob/main/docs/vindex-generation-policy.md",
};

export function SpecClause({ quotes }: { quotes: SpecQuote[] }) {
	return (
		<section className="hause-grid">
			<div className="col-span-12 md:col-start-2 md:col-span-9 flex flex-col gap-10">
				{quotes.map((q) => (
					<Excerpt key={q.id} source={q.source} heading={q.heading} text={q.text} trimmed={q.continues} href={DOC_HREF[q.doc]} />
				))}
			</div>
		</section>
	);
}
