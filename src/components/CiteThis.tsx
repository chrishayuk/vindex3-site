import { Provenance } from "@chrishayuk/hause/components/forms/Provenance";
import { Citation } from "@chrishayuk/hause/components/forms/Citation";
import { chapterRecord } from "@/data/citation";

/**
 * The foot of a chapter: the publication record, then the reference.
 *
 * Both are HAUSE forms driven by one record from src/data/citation.ts —
 * the same record the page's citation_* tags are built from — so the
 * chapter cites itself identically wherever it is read.
 */
export function CiteThis({ slug }: { slug: string }) {
	const record = chapterRecord(slug);
	return (
		<>
			<Provenance record={record} citeHref="#cite" />
			<Citation
				record={record}
				note="A chapter of the specification, citable on its own. Cite the version rather than the site — the canonical reference, and how to use it, live at /cite."
			/>
		</>
	);
}
