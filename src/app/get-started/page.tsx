import type { Metadata } from "next";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { Observation } from "@chrishayuk/hause/components/forms/Observation";
import { Snippet } from "@chrishayuk/hause/components/forms/Snippet";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";
import { JsonLd } from "@chrishayuk/hause/components/JsonLd";
import { softwareApplicationLd } from "@chrishayuk/hause/seo";
import { RELEASE } from "@/data/release";

export const metadata: Metadata = {
	title: "Get Started: Bring a Model In From Hugging Face and Run It",
	alternates: { canonical: "/get-started" },
	description:
		"Three commands. vindex encode brings a model in from Hugging Face with the checkpoint never landing on disk, vindex inspect shows what it understood, larql run makes it speak — recorded runs of vindex 0.8.0.",
};

/**
 * The on-ramp, in the on-ramp form: Hero → Snippet walk → Connection.
 *
 * Path one is three commands — encode, inspect, run — and every output
 * shown is a recorded run (2026-09-02, M3 Max): vindex 0.8.0 built at the
 * commit the release tag names, larql built from the same commit, against
 * Qwen/Qwen3-0.6B at the commit the encode pinned. Nothing is
 * illustrative. Path two keeps the earlier recorded tour of the reading
 * verbs against the 3B granite container (2026-08-30). The one shape
 * shown without a transcript — serve — says so.
 */
export default function GetStartedPage() {
	return (
		<main>
			<JsonLd
				data={softwareApplicationLd({
					name: "vindex",
					description:
						"The format-native VINDEX3 CLI: bring a model in from Hugging Face without the checkpoint landing on disk, then inspect, describe, representations, diff, represent, precision, verify, export — every command answering from the artifact alone, every command speaking --json.",
					url: "https://vindex3.org/get-started",
					downloadUrl: RELEASE.cli.href,
					operatingSystem: "macOS, Linux, Windows (build from source)",
					version: RELEASE.cli.version,
				})}
			/>
			<Hero
				kicker="GET STARTED · THREE COMMANDS · RECORDED RUNS · 2026-09-02"
				title="MODEL IN, MODEL RUNS"
				dek="vindex brings a model in from Hugging Face — headers first, then bytes over ranges, the checkpoint never landing on your disk. vindex inspect shows what it understood. larql run makes it speak. Every line below is a recorded run of the released 0.8.0 against Qwen3-0.6B."
			/>

			<Statement text="VINDEX brings a model into the system. LARQL makes it speak." />

			<Snippet
				label="INSTALL — VINDEX PREBUILT (MACOS ARM64, LINUX X86_64) OR FROM SOURCE · LARQL FROM SOURCE"
				code={`$ curl -L https://github.com/chrishayuk/larql/releases/download/\\
    vindex-v0.8.0/vindex-0.8.0-macos-arm64.tar.gz | tar xz

$ cargo install --git https://github.com/chrishayuk/larql vindex-cli
$ cargo install --git https://github.com/chrishayuk/larql larql-cli

$ vindex --version
vindex 0.8.0`}
				aside="Two tools, split by job. vindex brings a model in and reads the artifact — no inference runtime attached, because an artifact should not require an engine to be understood. larql is the engine: it runs and serves what vindex encoded. Every vindex command takes --json; vindex update keeps you current, explicitly, and nothing phones home."
			/>

			<Snippet
				label="ENCODE — A MODEL COMES IN FROM HUGGING FACE · THE CHECKPOINT NEVER TOUCHES THE DISK"
				code={`$ vindex encode hf://Qwen/Qwen3-0.6B --output qwen3-0.6b
staged         11.47 MB (0.04 MB of headers over 1 shard(s), 11.43 MB of metadata)
standing in for 1.50 GB (1.40 GiB) of tensor payload
pinned at      c1899de289a04d12100db370d81485cdf75e47ca

fetched        1.50 GB (1.40 GiB) of 1.50 GB (1.40 GiB) declared across 311 tensor(s)
checkpoint     never present on this disk

capabilities   tokenizer.json, tokenizer_config.json, generation_config.json
encoded        4 representation(s), 1.50 GB (1.40 GiB) payload
container      qwen3-0.6b`}
				aside="Admission runs on 11.47 MB of headers and metadata standing in for a 1.50 GB checkpoint, pinned to the repository commit the hub named. Only once the model is understood do the tensor bytes move — over byte ranges, straight into the container's segments — so the source checkpoint exists on your machine at no point. The tokenizer and generation config ride along as capabilities: what the container can do, not what it weighs."
			/>

			<Snippet
				label="INSPECT — IDENTITY, GEOMETRY, COHERENCE, FROM THE ARTIFACT ALONE"
				code={`$ vindex inspect qwen3-0.6b
model          Qwen3-0.6B
family         qwen3
generation     3
geometry       28 layers · hidden 1024
authority      canonical

COMPONENT              ROLE              LAYERS   HIDDEN
target                 primarytext           28     1024

graph          4 object(s) · 0 edge(s) · coherent`}
				aside="The container names itself. The model line is index.model, the identity the artifact declares — never a directory name read back off the filesystem — and every reading verb that follows (describe, representations, precision, diff, verify, export) answers from the same artifact, with no source and no engine in the room."
			/>

			<Snippet
				label="RUN — THE CONTAINER SPEAKS · 43.7 TOKENS/S ON THE CPU OF AN M3 MAX"
				code={`$ larql run qwen3-0.6b "The capital of France is"
 Paris. The capital of Italy is Rome. The capital of Spain is Madrid.
 The capital of China is Beijing. The`}
				aside="Text in, text out, from the container's own program: its tokenizer encodes the prompt, the same interpreter larql vindex3 exec reports on runs the plan, and the text streams as it is produced. Greedy on purpose, so a run doubles as a fixture. Recorded with --verbose: weights resident in 1.4 s, 5 prompt tokens, 24 generated, 23 ms per token. The same command with --metal answered identically at 28 ms per token — a 0.6B model is small enough that the CPU kernels win."
			/>

			<Statement text="Three commands. The checkpoint never touched the disk. That is the on-ramp." />

			<Observation
				label="WANT TO LOOK DEEPER"
				text="Three branches from here, in the order people usually need them. Why isn't an architecture supported? — vindex plan answers from headers alone, and since plan schema 4 the verdict names the commit it judged and the planner that judged it. What is a representation, and why is it selection rather than conversion? — the Representation chapter, and the recorded tour of the reading verbs below. What does a container hold when only part of it is resident? — the Container chapter."
			/>

			<Snippet
				label="PLAN — WHAT VINDEX UNDERSTANDS ABOUT A MODEL, BEFORE MOVING ITS WEIGHTS · SCHEMA 4"
				code={`$ vindex plan hf://Qwen/Qwen3-0.6B
staged         11.47 MB (0.04 MB of headers over 1 shard(s), 11.43 MB of metadata)
standing in for 1.50 GB (1.40 GiB) of tensor payload
pinned at      c1899de289a04d12100db370d81485cdf75e47ca

representable  40
mismatched     0
unrepresented  0
blocking       0
admissible     yes — every declaration has a home

$ vindex plan hf://Qwen/Qwen3-0.6B --json | jq '{schema, planner, source: .artifacts[0].source}'
{
  "schema": 4,
  "planner": { "package": "larql-vindex", "package_version": "0.2.0", "semantics_version": 1 },
  "source":  { "path": "hf://Qwen/Qwen3-0.6B",
               "revision": "c1899de289a04d12100db370d81485cdf75e47ca" }
}`}
				aside="A verdict names its subject and its judge. The semantics version moves only when a rule change can flip a verdict — never for a wording or layout fix — so two plans are comparable exactly when it agrees. A cache may key on (commit, semantics version) only when every artifact is pinned to a commit; a revision name like main is provenance, never authority. A plan written by an earlier schema is refused by name rather than read as unattributed."
			/>

			<Statement text="PATH TWO — THE ARTIFACT, UNDERSTOOD WITHOUT AN ENGINE" />

			<Observation
				label="THE READING VERBS · RECORDED 2026-08-30 · GRANITE 3B"
				text="The five commands below are the earlier recorded tour against a 3B granite container, kept because they ran: precision derived from bytes, a representation compiled beside the original, a value-by-value diff, self-verification against recorded hashes, and export to an independent runtime."
			/>

			<Snippet
				label="PRECISION — BITS PER WEIGHT, DERIVED, NEVER A LABEL READ OFF A FILENAME"
				code={`$ vindex precision granite-3b.vindex3
REPRESENTATION               ENCODING     WEIGHTS        BYTES   BITS/W
target.decoder_stack@BF16    BF16      3145932800   6291865600  16.0000
target.embedding@BF16        BF16       256901120    513802240  16.0000
target.output_head@BF16      BF16       256901120    513802240  16.0000`}
			/>

			<Snippet
				label="REPRESENT — COMPILE A REPRESENTATION BESIDE THE ORIGINAL · 12.6 S ON AN M3 MAX"
				code={`$ vindex represent granite-3b.vindex3 granite-r0.vindex3
compiled       target.decoder_stack
tensors        280 re-encoded · 80 carried verbatim
bytes          6291456000 → 1769882720 (3.55× smaller)
preserved      target.embedding — wholly at BF16
preserved      target.output_head — wholly at BF16`}
				aside="Nothing destroyed, the canonical bytes untouched — and the compiled pack's own precision row shows the honest figure: four-bit codes costing 4.5008 bits per weight, because the scales are never free."
			/>

			<Snippet
				label="DIFF — 3.1 BILLION WEIGHTS, VALUE BY VALUE, IN 8.6 SECONDS"
				code={`$ vindex diff granite-r0.vindex3 BF16 NVFP4 decoder_stack \\
    --tensor 0.mlp.down_proj.weight

0.mlp.down_proj.weight — first values
        A             B         ERROR
 -0.003464     -0.003226      0.000238
 -0.000748     -0.000538      0.000210
 -0.003326     -0.003226      0.000100

result   3138112816 of 3145932800 values differ
         rms 0.001029 · max 0.074498`}
				aside="The errors are derived, never asserted: both sides decode through the same arithmetic a matmul would use. An encoding the container does not hold is refused by naming what it does hold."
			/>

			<Snippet
				label="VERIFY — THE ARTIFACT AGAINST ITS OWN RECORDED HASHES"
				code={`$ vindex verify granite-r0.vindex3
target.decoder_stack@BF16          ok
target.decoder_stack@NVFP4         ok
target.embedding@BF16              ok
target.output_head@BF16            ok

verified   yes — the artifact agrees with its own record`}
				aside="The scope is stated plainly: self-verification, from the artifact alone. Proving faithfulness to the source additionally needs the source — that gate lives with the reference implementation."
			/>

			<Snippet
				label="EXPORT — THE SELECTED REPRESENTATION, COMPILED TO GGUF FOR AN INDEPENDENT RUNTIME"
				code={`$ vindex export qwen3.8-nvfp4.vindex3 qwen3.8-27b-vindex-nvfp4.gguf
selected       NVFP4
walk           851 tensors · geometry 851/851 · 496 scale siblings
vocab          248077 tokens + 243 pad · 247587 merges
verified       1347 tensors (496 NVFP4 · 496 scale siblings) · 32 metadata keys
written        qwen3.8-27b-vindex-nvfp4.gguf — 18.80 GB,
               independent reader agrees with the plan`}
				aside="Roles come from the operation plan, selection from the container's own precision programme, and the finished file is parsed back through an independent GGUF reader before the command returns. llama.cpp loads and runs the result; on a fixed token sequence its logits agree with VINDEX3's own execution of the same NVFP4 representation to within 0.0003 nats KL — same model, same representation, two runtimes."
			/>

			<Snippet
				label="SERVE — THE STANDARD SURFACES, FROM THE SAME CONTAINER · A SHAPE, NOT A RECORDED RUN"
				code={`$ larql serve qwen3-0.6b

$ curl localhost:8080/v1/completions -d '{
    "model": "Qwen3-0.6B", "prompt": "The capital of France is",
    "max_tokens": 16 }'`}
				aside="A served V3 container answers /v1/completions, /v1/chat/completions and /v1/responses, sharing every wire shape with the previous generation — only the token source differs. Serving, larql run and the research verb larql vindex3 exec open a container through one authority, so the same container means the same program whichever door you came in by."
			/>

			<Connection
				text="The same verbs run in the browser against a hardened public container, and the same grammar reads back as designed panels. One on-ramp, three transports, one meaning."
				links={[
					{ href: "/explorer", label: "THE EXPLORER" },
					{ href: "/representation", label: "SELECTION, NOT CONVERSION" },
					{ href: "/ladder", label: "THE RECORD" },
				]}
			/>
		</main>
	);
}
