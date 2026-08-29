"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The one physics figure that stayed site-local: too small to be a
 * HOUSE form on its own. Its siblings — Procession, Magnitude,
 * Channel, Quantisation — were promoted to HOUSE and are consumed by
 * the Physics page as plain-props forms.
 */

/* ------------------------------------------------------------------
   TENSOR — the grid materialises: border first, then the numbers.
   ------------------------------------------------------------------ */
export function TensorFigure() {
	const ref = useRef<HTMLDivElement>(null);
	const [drawn, setDrawn] = useState(true);
	const [instant, setInstant] = useState(true);

	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					observer.disconnect();
					setInstant(true);
					setDrawn(false);
					requestAnimationFrame(() =>
						requestAnimationFrame(() => {
							setInstant(false);
							setDrawn(true);
						})
					);
				}
			},
			{ threshold: 0.5 }
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<section className="house-grid py-10 sm:py-14">
			<div ref={ref} className="col-span-12 flex flex-col items-center">
				<div
					aria-hidden="true"
					className="relative border w-full max-w-md overflow-hidden"
					style={{
						height: 120,
						borderColor: "var(--fg)",
						background: "var(--bg)",
						opacity: drawn ? 1 : 0.15,
						transition: instant ? "none" : "opacity var(--motion-considered) var(--ease-house)",
					}}
				>
					<div
						className="absolute inset-0"
						style={{
							backgroundImage:
								"repeating-linear-gradient(45deg, var(--color-accent) 0, var(--color-accent) 1px, transparent 1px, transparent 6px)",
							opacity: drawn ? 0.7 : 0,
							clipPath: drawn ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
							transition: instant
								? "none"
								: "clip-path var(--motion-cinematic) var(--ease-house) 200ms, opacity var(--motion-considered) var(--ease-house) 200ms",
						}}
					/>
				</div>
				<p
					className="voice-evidence text-xs mt-3"
					style={{
						opacity: drawn ? 0.6 : 0,
						transition: instant ? "none" : "opacity var(--motion-considered) var(--ease-house) 1300ms",
					}}
				>
					6,144 × 2,048 — one tensor, of thousands
				</p>
			</div>
		</section>
	);
}
