import type { Metadata } from "next";
import { JsonLd } from "@chrishayuk/hause/components/JsonLd";
import { breadcrumbLd, techArticleLd } from "@chrishayuk/hause/seo";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Answer } from "@chrishayuk/hause/components/forms/Answer";
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { Observation } from "@chrishayuk/hause/components/forms/Observation";
import { Anatomy } from "@chrishayuk/hause/components/forms/Anatomy";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";
import { ClosureFigure } from "@/components/StoryFigures";

export const metadata: Metadata = {
	title: "How a Model Container Executes: The Compiler Boundary",
	alternates: { canonical: "/execution" },
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
			<JsonLd
				data={techArticleLd({
					headline: "Execution",
					description:
						"The execution surface, operand closure and the compiler boundary — how an encoded description becomes computation with zero architecture branches.",
					url: "https://vindex3.org/execution",
					siteUrl: "https://vindex3.org",
					siteName: "VINDEX3",
					dateModified: "2026-08-30",
					about: ["model execution", "state space models", "attention"],
				})}
			/>
			<JsonLd
				data={breadcrumbLd([
					{ name: "VINDEX3", url: "https://vindex3.org" },
					{ name: "Execution", url: "https://vindex3.org/execution" },
				])}
			/>
			<Hero
				kicker="EXECUTION · LIVING SPEC §8 · ABI §8.3"
				title="FROM DESCRIPTION TO COMPUTATION"
				dek="A component says what part of the system it is. Its execution surface says what the generic operations need to run it — every value fully resolved when the container was built."
			/>

			<Answer
				id="how-does-vindex3-execute"
				question="How does VINDEX3 execute a model?"
				answer="VINDEX3 stores a generic model program. Components declare operators — softmax, MLA, KDA, gated-delta, Mamba2 — and each operator declares the semantics, operands and continuation state it requires. The runtime binds every required operand or refuses by name, then lowers the program to generic kernels without ever recovering the source model family: the checkpoint, config and architecture name can be deleted and execution must not change."
			/>

			<Answer
				id="why-no-kv-assumption"
				question="Why doesn't VINDEX3 assume a KV cache?"
				answer="Because KV is one state family, not the definition of continuation. The program declares what persists between tokens: KV rows for softmax attention, a latent-compressed cache for MLA, fixed-size recurrent state for the delta families, SSM state for Mamba2. A pure-SSM container declares its whole continuation with no KV row anywhere — and the runtime reads the declaration from the plan, never from an architecture guess."
				cite="witnessed — mamba2-780m · 2026-08-30"
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
						label: "linear_attention · kda · mla · mamba2",
						note: "THE OTHER OPERATOR FAMILIES",
						detail:
							"Recurrent, latent and state-space operators carried as first-class surfaces, present only when the model uses them — never inferred from a model name.",
						children: [
							{ label: "linear_attention", detail: "key_heads · key_head_dim · value_heads · value_head_dim · conv_kernel · state_dtype?" },
							{ label: "mla", detail: "num_heads · kv_lora_rank · qk_nope_head_dim · qk_rope_head_dim · v_head_dim" },
							{ label: "kda", detail: "the KDA geometry, plus kda_gate_lower_bound?" },
							{ label: "mamba2", detail: "state_size · num_heads · head_dim · expand · conv_kernel · n_groups · chunk_size · the dt clamp (an unbounded side is a declared fact) · rms_norm · the bias estate · activation" },
						],
					},
				]}
				caption="The completeness contract, since graph schema 6: the surfaces follow the component's declared operation program, and presence means semantic presence. A stack whose layers attend carries an attention group; a stack whose program runs an FFN carries an FFN group; a pure-SSM stack carries neither — and writing one anyway is the fabrication schema 6 removed. Object kinds keep identity; they no longer imply operation families. Attention is vocabulary, not ontology."
			/>

			<section className="hause-grid py-16 sm:py-24">
				<div className="col-span-12 md:col-start-2 md:col-span-10 lg:col-span-9">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-8 opacity-50">
						SURFACES FOLLOW THE PROGRAM — SCHEMA 6, WITNESSED
					</p>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
						<div className="border-l-2 pl-5" style={{ borderColor: "var(--color-mist)" }}>
							<p className="voice-evidence text-xs tracking-[0.1em] uppercase mb-4">BEFORE — KIND-IMPLIED</p>
							<pre className="voice-evidence text-xs sm:text-sm leading-loose whitespace-pre overflow-x-auto m-0">
								{`DecoderStack
      ↓
attention assumed
      ↓
FFN assumed
      ↓
KV assumed`}
							</pre>
						</div>
						<div className="border-l-2 pl-5" style={{ borderColor: "var(--color-accent)" }}>
							<p className="voice-evidence text-xs tracking-[0.1em] uppercase mb-4">SCHEMA 6 — PROGRAM-DERIVED</p>
							<pre className="voice-evidence text-xs sm:text-sm leading-loose whitespace-pre overflow-x-auto m-0">
								{`Component
      ↓
declared operator program
  softmax · MLA · KDA
  gated-delta · mamba2
  conv-QKV attention · …
      ↓
required surfaces
      ↓
continuation state`}
							</pre>
						</div>
					</div>
					<pre
						className="voice-evidence text-xs sm:text-sm leading-relaxed whitespace-pre overflow-x-auto m-0 border px-5 py-4 sm:px-7 sm:py-6 mt-10"
						style={{ borderColor: "var(--color-mist)" }}
					>
						{`mamba2-780m — 48 declared Mamba2 operators · 0 attention operators

before schema 6:   48 fabricated attention surfaces   ✕
at schema 6:       48 Mamba2 operators
                    0 attention surfaces
                    0 FFN surfaces                     ✓

mamba2attn-250m — 28 Mamba2 operators · 4 conv-QKV attention operators

at schema 6:       attention exactly where declared
                   conv-QKV, never plain softmax
                    0 FFN surfaces                     ✓`}
					</pre>
					<p className="voice-system text-sm opacity-70 leading-relaxed max-w-2xl mt-6">
						Both directions of the sentence are now executed evidence, not schema tests. An architecture with
						no attention fabricates none: the pure-SSM witness was first refused with nineteen itemised
						findings, then admitted with zero fabricated surfaces and operand closure enforced at encode. And
						an architecture with selected, non-standard attention gets those operators only where declared:
						the hybrid witness carries its four conv-QKV blocks — causal convolution over the fused QKV,
						partial rotary — as their own operator on exactly the declared layers, and runs them at its
						reference's numerical floor. The Record keeps every half.
					</p>
				</div>
			</section>

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
								mamba2 — nine, one norm per layer
							</p>
							<pre className="voice-evidence text-xs leading-relaxed whitespace-pre overflow-x-auto m-0">
								{`Mamba2InProj  Mamba2Conv1d
Mamba2Conv1dBias
Mamba2ALog  Mamba2D  Mamba2DtBias
Mamba2GatedNorm  Mamba2OutProj
Mamba2PreMixerNorm`}
							</pre>
						</div>
						<div>
							<p className="voice-evidence text-xs tracking-[0.1em] uppercase mb-3" style={{ color: "var(--color-accent)" }}>
								conv-QKV attention — five, shared norm role
							</p>
							<pre className="voice-evidence text-xs leading-relaxed whitespace-pre overflow-x-auto m-0">
								{`ConvQkvInProj  ConvQkvConv1d
ConvQkvConv1dBias
ConvQkvOutProj
Mamba2PreMixerNorm`}
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
PostExpertsNorm
placement: PreOnly | PrePost | PreMixer`}
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
				<div className="col-span-12 md:col-start-2 md:col-span-10 lg:col-span-9">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-8 opacity-50">
						STATE IS AN OPERATION REQUIREMENT
					</p>
					<pre
						className="voice-evidence text-xs sm:text-sm leading-relaxed whitespace-pre overflow-x-auto m-0 border px-5 py-4 sm:px-7 sm:py-6"
						style={{ borderColor: "var(--color-mist)" }}
					>
						{`Operator
   ↓ declares
ContinuationState — one or more typed regions

softmax attention    └─ KV rows              grows with context
MLA                  └─ latent KV            compressed, per position
gated deltanet       ├─ delta matrix         fixed size, folded every token
                     └─ conv history
Mamba2               ├─ SSM state            head_dim × state_size per head
                     └─ conv history
conv-QKV attention   ├─ KV rows              grows with context
                     └─ conv history         fixed, over the fused QKV
future operators     declared, never assumed`}
					</pre>
					<p className="voice-system text-sm opacity-70 leading-relaxed max-w-2xl mt-6">
						An operator may declare more than one continuation region — and operation family does not imply
						state shape. Both recurrence families here carry a convolution history beside their folded state,
						and modelling only the matrix once left a whole buffer invisible until the first single-token
						continuation. Nor is multi-region state peculiar to recurrence: the hybrid witness's conv-QKV
						attention — recognisably attention — requires a KV cache AND a convolution history on the same
						layer, and a provider that can hold only rows refuses the layer rather than allocating half of
						it. KV is one region kind — not the definition of model continuation. Three real witnesses hold
						that sentence up: a KDA + MLA + softmax hybrid carrying three state kinds already executes, a
						pure-SSM container describes its whole continuation as two recurrent regions per layer — eighteen
						million elements, constant in sequence length, no KV row anywhere — and the Mamba2Attn hybrid
						runs both mixed regions through generic execution at its reference's own numerical floor.
						The typed state schema — declared precision for KDA, latent geometry for MLA — is the remaining
						half of the lift, additive within schema 6. The rule underneath does not change: state geometry is
						a container fact, read from the plan, never inferred from architecture.
					</p>
				</div>
			</section>

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
						<li>vindex3-format-spec.md §8.3, §17.4 (the 3.0 Candidate — lift 1 landed at graph schema 6)</li>
						<li>reference implementation — graph/surface.rs · graph/roles.rs</li>
					</ul>
				</div>
			</section>
		</main>
	);
}
