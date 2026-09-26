import Link from "next/link";
import { CURRENT } from "@/data/release";

/** A doorway from dated exhibits to the explicitly scoped checkout record. */
export function CurrentStatus({ detail = "The exhibits retain their dated measurements. See the current implementation, command inventory and remaining format gates." }: { detail?: string }) {
	return <aside className="hause-grid py-8" aria-label="Current implementation status">
		<div className="col-span-12 md:col-start-2 md:col-span-9 border-y py-6" style={{ borderColor: "var(--color-mist)" }}>
			<p className="voice-evidence text-xs tracking-widest mb-3">REVIEWED {CURRENT.reviewed} · {CURRENT.label} {CURRENT.commit.slice(0, 8)}</p>
			<p className="voice-system text-base leading-relaxed max-w-3xl">{detail}</p>
			<Link href="/status" className="voice-evidence inline-block text-sm mt-4 border-b pb-1" style={{ borderColor: "var(--color-accent)" }}>CURRENT CAPABILITIES →</Link>
		</div>
	</aside>;
}
