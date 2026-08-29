"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/**
 * The site's opening sequence: a VINDEX3 container as one closed
 * volume that opens into its layers. index.json separates first and
 * holds a beat alone — the one-root rule staged, not captioned — then
 * the remaining layers fan out at the hause stagger.
 *
 * Bespoke to this site (it knows the ABI §5 directory layout), built
 * from DOM + CSS transforms only. The server-rendered state is the
 * exploded, fully-labelled cutaway; motion-capable visitors get it
 * collapsed on mount and opened once in view, so reduced-motion and
 * no-JS both land on a finished drawing rather than a disabled
 * animation.
 */

const LAYERS: { name: string; note: string; root?: boolean; muted?: boolean }[] = [
	{ name: "index.json", note: "SOLE ROOT AUTHORITY", root: true },
	{ name: "moe_manifest.json", note: "PROGRAMME" },
	{ name: "profiles/", note: "EXECUTION" },
	{ name: "control/", note: "CLASS 1" },
	{ name: "dense/", note: "CLASS 2" },
	{ name: "shared/", note: "CLASS 3" },
	{ name: "routed/", note: "CLASSES 4 & 5" },
	{ name: "query/", note: "THE WEIGHTS ARE THE INDEX" },
	{ name: "tokenizer.json · weight_manifest.json", note: "", muted: true },
];

// Row pitch (height + gap) the collapse math assumes — keep in sync with the styles below.
const PITCH = 58;
const CENTER = (LAYERS.length - 1) / 2;

export function ContainerReveal() {
	const sectionRef = useRef<HTMLElement>(null);
	const [open, setOpen] = useState(true);
	const [instant, setInstant] = useState(true);

	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const section = sectionRef.current;
		if (!section) return;

		// Collapse without transition, arm transitions a frame later, then
		// open after a held beat once the section is actually in view.
		setOpen(false);
		let beat: ReturnType<typeof setTimeout> | undefined;
		const raf = requestAnimationFrame(() => requestAnimationFrame(() => setInstant(false)));
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					observer.disconnect();
					beat = setTimeout(() => setOpen(true), 900);
				}
			},
			{ threshold: 0.4 }
		);
		observer.observe(section);
		return () => {
			cancelAnimationFrame(raf);
			observer.disconnect();
			if (beat) clearTimeout(beat);
		};
	}, []);

	return (
		<section
			ref={sectionRef}
			className="hause-grid min-h-[92svh] content-center py-20"
			aria-label="A VINDEX3 container, opening into its layers"
		>
			<div className="col-span-12 md:col-start-3 md:col-span-8">
				<p className="voice-evidence text-xs sm:text-sm tracking-[0.14em] uppercase mb-12" style={{ color: "var(--color-accent)" }}>
					model.vindex/ — A VINDEX3 CONTAINER
				</p>

				<div className="flex flex-col" style={{ gap: 10 }}>
					{LAYERS.map((layer, i) => {
						// Collapsed: the rows stack into one closed volume — a deck with a
						// 5px stepped edge per layer, index.json as the sealed top face.
						const collapseY = (CENTER - i) * (PITCH - 5);
						// Opening: index.json separates first at --motion-cinematic and
						// holds alone; the rest follow after the beat, at the hause stagger.
						const delay = layer.root ? 0 : 1400 + (i - 1) * 140;
						return (
							<Link
								href="/container"
								key={layer.name}
								className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border px-4 sm:px-6 hover:opacity-100"
								style={{
									height: 48,
									zIndex: LAYERS.length - i,
									background: "var(--bg)",
									borderColor: layer.root && open ? "var(--color-accent)" : layer.muted ? "var(--color-mist)" : "var(--fg)",
									borderStyle: layer.muted ? "dashed" : "solid",
									transform: open ? "none" : `translateY(${collapseY}px)`,
									transition: instant
										? "none"
										: `transform var(--motion-cinematic) var(--ease-hause) ${delay}ms, border-color var(--motion-considered) var(--ease-hause) ${delay + 300}ms`,
								}}
							>
								<span
									className="voice-evidence text-xs sm:text-sm truncate"
									style={{
										color: layer.root ? "var(--color-accent)" : undefined,
										opacity: open ? (layer.muted ? 0.5 : 1) : 0,
										transition: instant ? "none" : `opacity var(--motion-considered) var(--ease-hause) ${delay + 300}ms`,
									}}
								>
									{layer.name}
								</span>
								<span
									className="voice-evidence text-[10px] sm:text-xs tracking-[0.1em] uppercase text-right"
									style={{
										color: layer.root ? "var(--color-accent)" : undefined,
										opacity: open ? (layer.root ? 1 : 0.5) : 0,
										transition: instant ? "none" : `opacity var(--motion-considered) var(--ease-hause) ${delay + 500}ms`,
									}}
								>
									{layer.note}
								</span>
							</Link>
						);
					})}
				</div>

				{/* Always-present text fallback — plain and first-visit friendly; the
				    one-root argument itself lives on /container. */}
				<p className="voice-evidence text-xs opacity-40 leading-relaxed max-w-2xl mt-12">
					A model, stored as a directory you can read. One file — index.json — speaks for the whole container.
					Every other part is named, findable, and checkable.
				</p>
				<Link
					href="/container"
					className="voice-evidence text-xs tracking-[0.14em] uppercase border-b pb-0.5 mt-6 w-fit inline-block"
					style={{ borderColor: "var(--color-accent)" }}
				>
					OPEN THE CONTAINER →
				</Link>
			</div>
		</section>
	);
}
