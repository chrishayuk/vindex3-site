"use client";

import { useState } from "react";
import { tick } from "@chrishayuk/hause/sound";
import { useInView } from "@chrishayuk/hause/figure";

/**
 * TWO TENSORS, ONE NAME.
 *
 * The page above this asserts that a tensor name is not a meaning. This
 * is the assertion made checkable: two tensors from one real container
 * (Kimi-Linear-48B), both called `q_proj`, belonging to two different
 * operators — read verbatim from `vindex describe layer.N.mixer`.
 *
 * The figure reveals in three steps because the argument has three
 * steps, and the first two are the ones a name-matching reader gets
 * right. Only the third — what each operand actually feeds — shows why
 * the graph has to be the authority: the shapes differ, but a reader
 * that merely noticed the shapes differ would still not know that one
 * of these queries drives a recurrent state and the other addresses a
 * latent cache, which is the fact that decides how each may be
 * represented.
 */

const MONO = "voice-evidence text-xs sm:text-sm";

type Row = {
	operator: string;
	tensor: string;
	shape: string;
	feeds: string;
	consequence: string;
};

const ROWS: Row[] = [
	{
		operator: "KDA",
		tensor: "0.self_attn.q_proj.weight",
		shape: "[4096, 2304]",
		feeds: "a delta-rule state update, beside per-channel decay and write gates",
		consequence:
			"Its programme carries a control path — the gates that decide what the state keeps. Error there compounds into every later position, so the control path is preserved while the bulk projections compile.",
	},
	{
		operator: "MLA",
		tensor: "3.self_attn.q_proj.weight",
		shape: "[6144, 2304]",
		feeds: "a compressed latent cache, decompressed per position",
		consequence:
			"No recurrent state, so nothing here compounds. Its operands are ordinary decoder linear work at an unusual width, and the whole block compiles uniformly.",
	},
];

const STEPS = [
	{ id: 0, label: "THE NAME", hint: "what a string match sees" },
	{ id: 1, label: "THE OPERATOR", hint: "what the graph declares" },
	{ id: 2, label: "THE CONSEQUENCE", hint: "what it decides" },
];

export function NameCollision() {
	const { ref } = useInView();
	const [step, setStep] = useState(0);

	return (
		<section className="hause-grid py-12 sm:py-16">
			<div ref={ref} className="col-span-12 md:col-start-2 md:col-span-10">
				<p className="voice-evidence text-[11px] tracking-[0.12em] uppercase opacity-50 mb-4">
					TWO TENSORS, ONE NAME — Kimi-Linear-48B, recorded
				</p>

				<div className="flex flex-wrap gap-2 mb-6">
					{STEPS.map((s) => (
						<button
							key={s.id}
							onClick={() => {
								tick();
								setStep(s.id);
							}}
							className="voice-evidence text-xs px-4 py-2 border text-left"
							style={{
								borderColor: step === s.id ? "var(--color-accent)" : "var(--color-mist)",
								color: step === s.id ? "var(--color-accent)" : undefined,
								opacity: step === s.id ? 1 : 0.6,
							}}
						>
							{s.label}
							<span className="block voice-evidence text-[10px] tracking-[0.08em] uppercase opacity-50 mt-0.5">
								{s.hint}
							</span>
						</button>
					))}
				</div>

				<div className="flex flex-col gap-3">
					{ROWS.map((r) => (
						<div
							key={r.operator}
							className="border p-4 sm:p-5"
							style={{ borderColor: "var(--color-mist)", background: "var(--bg)" }}
						>
							{/* Step 0: the two are indistinguishable by name alone. */}
							<div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
								<span className={MONO} style={{ color: step === 0 ? "var(--color-accent)" : undefined }}>
									{r.tensor.replace(/^\d+\./, "…")}
								</span>
								{step >= 1 && (
									<>
										<span
											className="voice-evidence text-[11px] tracking-[0.1em] uppercase px-2 py-0.5 border"
											style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)" }}
										>
											{r.operator}
										</span>
										<span className={`${MONO} opacity-60`}>{r.shape}</span>
									</>
								)}
							</div>

							{step >= 1 && (
								<p className="voice-system text-sm opacity-70 leading-relaxed mt-3 mb-0">
									feeds {r.feeds}
								</p>
							)}

							{step >= 2 && (
								<p
									className="voice-system text-sm leading-relaxed mt-3 mb-0 pt-3 border-t"
									style={{ borderColor: "var(--color-mist)" }}
								>
									{r.consequence}
								</p>
							)}
						</div>
					))}
				</div>

				<p className="voice-system text-sm sm:text-base opacity-70 leading-relaxed max-w-2xl mt-6">
					{step === 0 &&
						"Two tensors in one container, indistinguishable by name. A reader that decides what a tensor is by matching strings has already finished — and is already wrong, with every shape still lining up plausibly."}
					{step === 1 &&
						"The graph declares the operator, so the two separate. The shapes differ too — but a shape is a consequence of the operator, not a substitute for knowing it: two operators can agree on a shape, and a reader with no operator has no way to tell that they did."}
					{step === 2 &&
						"And this is why it matters beyond bookkeeping. One of these queries drives a recurrent state whose control path compounds error forward; the other addresses a per-position cache where nothing compounds. Same name, different operator — and therefore a different answer to how it may be represented. The precision map is downstream of this fact."}
				</p>
			</div>
		</section>
	);
}
