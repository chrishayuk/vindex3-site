import type { Metadata } from "next";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { Observation } from "@chrishayuk/hause/components/forms/Observation";
import { Anatomy } from "@chrishayuk/hause/components/forms/Anatomy";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";
import { ClosureFigure } from "@/components/StoryFigures";

export const metadata: Metadata = {
	title: "Execution",
	description: "The execution surface, operand closure, and the compiler boundary — how an encoded description becomes computation aimed at zero architecture branches — the design goal the held-out architecture test will prove.",
};

/**
 * The execution-contract exhibit: living spec §8 and ABI §8.3.
 * Surface fields follow graph/surface.rs; the operand vocabulary
 * follows graph/roles.rs — both quoted from the code, not paraphrased.
 */
export default function ExecutionPage() {
	return (
		<main>
			<Hero
				kicker="EXECUTION · LIVING SPEC §8 · ABI §8.3"
				title="FROM DESCRIPTION TO COMPUTATION"
				dek="A component says what part of the system it is. Its execution surface says what the generic operations need to run it — every value fully resolved when the container was built."
			/>

			<Statement text="The most dangerous fact in a system is the one whose deletion changes nothing." />

			<Observation
				label="WHAT THIS FIXES"
				text="That is what a hidden default is: a value the code supplies when nobody is looking — invisible precisely because removing it changes no output, until the day it changes everything. This chapter is a hunt for hidden defaults. Every operand must map to an operation. Every operation must carry judged semantics. And the proof is causal: mutate the stored fact and the computation must change. Where mutation changes nothing, a default was hiding."
			/>

			<Statement text="An executor reads; it never defaults." />

			<Anatomy
				kicker="ExecutionSurface — GROUPED BY OPERATION"
				objectLabel="Seven surfaces. No family knowledge in any of them."
				layers={[
					{
						label: "attention",
						note: "AttentionSurface",
						detail:
							"Everything softmax attention needs, judged in advance — including the facts no tensor evidence can reveal, like parameter-free QK normalisation, which is a judged semantic.",
						children: [
							{ label: "geometry", detail: "num_q_heads · num_kv_heads · head_dim" },
							{ label: "scaling", detail: "query_scale? · score_scale · logit_softcapping?" },
							{ label: "qk norm", detail: "qk_norm_scope · qk_norm_weight_offset · parameter_free_qk_norm" },
							{ label: "gating", detail: "output_gate? — attention output gating is a generic primitive, not a family quirk" },
							{ label: "extras", detail: "sinks? · attention_bias?" },
						],
					},
					{
						label: "ffn · moe",
						note: "FfnSurface · MoeSurface",
						detail:
							"The feed-forward contract, dense or routed through the same shape: a dense layer is simply the surface with no MoE block.",
						children: [
							{ label: "ffn", detail: "intermediate_size · activation · ffn_type · gate_policy · moe?" },
							{ label: "routing", detail: "experts · top_k · router_kind · routing_policy · router_bias" },
							{ label: "expert storage", detail: "expert_intermediate_size · expert_format · gate_up_layout?" },
							{ label: "structure", detail: "shared_experts · branch_scale? · dense_prefix_layers? · hybrid" },
						],
					},
					{
						label: "norm",
						note: "NormSurface",
						detail:
							"Where normalisation sits is operand evidence, judged as placement — PreOnly or PrePost. Count is not semantics; placement is.",
						children: [{ label: "fields", detail: "pre · post? · final_norm · placement (PreOnly | PrePost)" }],
					},
					{
						label: "head",
						note: "HeadSurface",
						detail: "What embedding and output-head objects need — the only surface an Embedding or OutputHead object carries.",
						children: [
							{ label: "fields", detail: "vocab_size · embedding_norm? · embed_scale? · output_multiplier? · final_logit_softcapping? · head_reuses_embedding" },
						],
					},
					{
						label: "linear_attention · kda · mla",
						note: "THE OTHER ATTENTION FAMILIES",
						detail:
							"Recurrent and latent attention carried as first-class surfaces, present only when the model uses them — never inferred from a model name.",
						children: [
							{ label: "linear_attention", detail: "key_heads · key_head_dim · value_heads · value_head_dim · conv_kernel · state_dtype?" },
							{ label: "mla", detail: "num_heads · kv_lora_rank · qk_nope_head_dim · qk_rope_head_dim · v_head_dim" },
							{ label: "kda", detail: "the KDA geometry, plus kda_gate_lower_bound?" },
						],
					},
				]}
				caption="The completeness contract: a DecoderStack or PerceptionTower object carries attention + ffn + norm; an Embedding or OutputHead object carries head. Anything less does not execute."
			/>

			<section className="hause-grid py-16 sm:py-24">
				<div className="col-span-12 md:col-start-2 md:col-span-10 lg:col-span-9">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-3 opacity-50">
						OPERAND ROLES — THE TYPED VOCABULARY
					</p>
					<p className="voice-system text-sm sm:text-base opacity-80 leading-relaxed max-w-2xl mb-8">
						Every tensor inside a decoder stack is typed by what it is to the generic operations. An operation
						plan binds every operand its programme requires, or refuses. Closure needs the complete set — a
						missing operand is a named refusal, never a silently skipped step.
					</p>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
						<div>
							<p className="voice-evidence text-xs tracking-[0.1em] uppercase mb-3" style={{ color: "var(--color-accent)" }}>
								softmax attention
							</p>
							<pre className="voice-evidence text-xs leading-relaxed whitespace-pre overflow-x-auto m-0">
								{`AttnQ  AttnK  AttnV  AttnO
AttnQBias  AttnKBias  AttnVBias  AttnOBias
AttnOutputGate  AttnSinks
AttnQNorm  AttnKNorm`}
							</pre>
						</div>
						<div>
							<p className="voice-evidence text-xs tracking-[0.1em] uppercase mb-3" style={{ color: "var(--color-accent)" }}>
								gated deltanet — nine, closure needs all
							</p>
							<pre className="voice-evidence text-xs leading-relaxed whitespace-pre overflow-x-auto m-0">
								{`LinearAttnInProjQkv
LinearAttnInProjA  LinearAttnInProjB
LinearAttnInProjZ  LinearAttnConv1d
LinearAttnALog  LinearAttnDtBias
LinearAttnNorm  LinearAttnOutProj`}
							</pre>
						</div>
						<div>
							<p className="voice-evidence text-xs tracking-[0.1em] uppercase mb-3" style={{ color: "var(--color-accent)" }}>
								kimi delta attention — fifteen
							</p>
							<pre className="voice-evidence text-xs leading-relaxed whitespace-pre overflow-x-auto m-0">
								{`KdaQProj  KdaKProj  KdaVProj
KdaQConv1d  KdaKConv1d  KdaVConv1d
KdaFAProj  KdaFBProj
KdaGAProj  KdaGBProj  KdaBProj
KdaALog  KdaDtBias
KdaONorm  KdaOutProj`}
							</pre>
						</div>
						<div>
							<p className="voice-evidence text-xs tracking-[0.1em] uppercase mb-3" style={{ color: "var(--color-accent)" }}>
								mla · ffn
							</p>
							<pre className="voice-evidence text-xs leading-relaxed whitespace-pre overflow-x-auto m-0">
								{`MlaQProj  MlaKvAProj  MlaKvBProj
MlaKvANorm  MlaOutProj

FfnGate  FfnUp  FfnDown`}
							</pre>
						</div>
						<div>
							<p className="voice-evidence text-xs tracking-[0.1em] uppercase mb-3" style={{ color: "var(--color-accent)" }}>
								norms — placement, not count
							</p>
							<pre className="voice-evidence text-xs leading-relaxed whitespace-pre overflow-x-auto m-0">
								{`PreAttentionNorm  PostAttentionNorm
PreFfnNorm  PostFfnNorm
PreExpertsNorm  PostDenseFfnNorm
PostExpertsNorm`}
							</pre>
						</div>
						<div>
							<p className="voice-evidence text-xs tracking-[0.1em] uppercase mb-3" style={{ color: "var(--color-accent)" }}>
								mixture of experts · misc
							</p>
							<pre className="voice-evidence text-xs leading-relaxed whitespace-pre overflow-x-auto m-0">
								{`MoeRouterWeight  MoeRouterBias
MoeRouterScale  MoeRouterPerExpertScale
ExpertGateUp(+Scales/Bias)
ExpertDown(+Scales/Bias)
PerExpertGate/Up/Down(u16)
SharedExpertGate/Up/Down
LayerScalar`}
							</pre>
						</div>
					</div>
				</div>
			</section>

			<Observation
				label="THE REFUSAL THAT TAUGHT THE FORMAT"
				text="The gate earned its place in the vocabulary by refusal. The first real four-norm model shipped an attention-gate weight in every one of its 52 layers — and the closure gate refused all 52, naming what was missing: required primitive, attention output gate. Not a crash. A named absence. The gate’s semantics were then judged from the reference implementation, the primitive entered the IR, and the model closed at 52 layers, twelve of twelve operands each. The format learned something new the only honest way: by refusing to guess it."
			/>

			<ClosureFigure />

			<Observation
				label="THE BOUNDED PROGRAMME VOCABULARY"
				text="What consumes those operands is a programme built from a closed set of operations: linear, fused linear, activation, clamp, multiply, add, scale, normalise, route, gather, weighted reduction, residual merge, pre and post transforms. There is no general graph interpreter. A new architecture either fits the vocabulary, or extends the registry with a new named programme — in the open."
			/>

			<section className="hause-grid py-16 sm:py-24">
				<div className="col-span-12 md:col-start-2 md:col-span-10 lg:col-span-9">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-8 opacity-50">
						THE COMPILER BOUNDARY — WHERE FAMILY KNOWLEDGE IS ALLOWED TO LIVE
					</p>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
						<div className="border-l-2 pl-5" style={{ borderColor: "var(--color-mist)" }}>
							<p className="voice-evidence text-xs tracking-[0.1em] uppercase mb-4">SOURCE COMPILER — FRONT END</p>
							<pre className="voice-evidence text-xs sm:text-sm leading-loose whitespace-pre overflow-x-auto m-0">
								{`HF model_type, upstream reference
        ↓
architecture-specific judgment OK
        ↓
generic VINDEX3 IR`}
							</pre>
						</div>
						<div className="border-l-2 pl-5" style={{ borderColor: "var(--color-accent)" }}>
							<p className="voice-evidence text-xs tracking-[0.1em] uppercase mb-4">EXECUTION — BACK END</p>
							<pre className="voice-evidence text-xs sm:text-sm leading-loose whitespace-pre overflow-x-auto m-0">
								{`VINDEX3 IR
        ↓
generic op plan
        ↓
generic kernels
— no family knowledge here`}
							</pre>
						</div>
					</div>
					<p className="voice-system text-sm opacity-70 leading-relaxed max-w-2xl mt-8">
						VINDEX3 permits architecture-aware ingestion and produces an architecture-independent executable IR.
						The trap this guards against has a name — the naming-convention trap. Dispatching on object-id strings
						is the same defect laundered through a name: the convention becomes an undeclared schema.
					</p>
				</div>
			</section>

			<Statement text="Removing the original checkpoint, config.json, the HF model type and the architecture name must not change execution." />

			<section className="hause-grid py-16 sm:py-24">
				<div className="col-span-12 md:col-start-2 md:col-span-9">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-8 opacity-50">
						THE ENGINEERING CONTRACT, COMPLETE
					</p>
					<pre className="voice-evidence text-sm sm:text-base leading-loose whitespace-pre overflow-x-auto m-0">
						{`four-authority consistency + operand closure     = execution sufficiency
execution sufficiency    + independent parity    = execution correctness
execution correctness    + causal mutation controls = semantic authority`}
					</pre>
				</div>
			</section>

			<Connection
				text="The four authorities in that first line, and the ladder these rungs climb, each have their own exhibit."
				links={[
					{ href: "/authority", label: "WHERE TRUTH COMES FROM" },
					{ href: "/ladder", label: "THE RECORD" },
					{ href: "/graph", label: "COMPONENTS, OBJECTS, EDGES" },
				]}
			/>

			<section className="hause-grid pb-32 pt-8 border-t" style={{ borderColor: "var(--color-mist)" }}>
				<div className="col-span-12">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase opacity-50 mb-4">SOURCES</p>
					<ul className="voice-evidence text-sm opacity-60 flex flex-col gap-1">
						<li>vindex3-format.md §8 (the living spec)</li>
						<li>vindex3-format-spec.md §8.3 (the ABI, 3.0-draft-2)</li>
						<li>reference implementation — graph/surface.rs · graph/roles.rs</li>
					</ul>
				</div>
			</section>
		</main>
	);
}
