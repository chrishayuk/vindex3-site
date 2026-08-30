import type { Metadata } from "next";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { Observation } from "@chrishayuk/hause/components/forms/Observation";
import { Snippet } from "@chrishayuk/hause/components/forms/Snippet";
import { Connection } from "@chrishayuk/hause/components/forms/Connection";
import { JsonLd } from "@chrishayuk/hause/components/JsonLd";
import { softwareApplicationLd } from "@chrishayuk/hause/seo";

export const metadata: Metadata = {
	title: "Install the vindex CLI: Inspect, Diff & Verify Model Containers",
	alternates: { canonical: "/get-started" },
	description:
		"Install the vindex CLI and interrogate a VINDEX3 container on your own machine — inspect, describe, diff, represent, precision, verify, every command speaking --json.",
};

/**
 * The on-ramp, in the on-ramp form: Hero → Snippet walk → Connection,
 * the same shape as hause.design's Use page, because two sites doing
 * one thing differently is what the design system exists to stop.
 * Every output is a recorded run of the real binary against a real 3B
 * container (2026-08-30, M3 Max) — shown because it ran.
 */
export default function GetStartedPage() {
	return (
		<main>
			<JsonLd
				data={softwareApplicationLd({
					name: "vindex",
					description:
						"The format-native VINDEX3 CLI: inspect, describe, representations, diff, represent, precision, verify — every command answering from the artifact alone, every command speaking --json.",
					url: "https://vindex3.org/get-started",
					downloadUrl: "https://github.com/chrishayuk/larql/releases/tag/vindex-v0.5.0",
					operatingSystem: "macOS, Linux, Windows (build from source)",
					version: "0.5.0",
				})}
			/>
			<Hero
				kicker="GET STARTED · THE VINDEX CLI · RECORDED RUNS · 2026-08-30"
				title="AN ARTIFACT, UNDERSTOOD WITHOUT AN ENGINE"
				dek="Seven commands against a local container — inspect, describe, representations, diff, represent, precision, verify — each answering from the artifact alone, each speaking --json. No inference runtime attached."
			/>

			<Statement text="The file answers for itself. Here is how to ask." />

			<Snippet
				label="INSTALL — PREBUILT (MACOS ARM64) OR FROM SOURCE, ANY PLATFORM WITH STABLE RUST"
				code={`$ curl -L https://github.com/chrishayuk/larql/releases/download/\\
    vindex-v0.5.0/vindex-0.5.0-macos-arm64.tar.gz | tar xz

$ cargo install --git https://github.com/chrishayuk/larql vindex-cli

$ vindex --help
The format-native VINDEX3 tool: inspect, describe,
representations, diff, represent, precision, verify.`}
				aside="Every command takes a global --json — one result, three projections: terminal text, structured JSON, and the designed panels this site renders. From 0.3.0, vindex update keeps you current — explicitly: no verb ever checks for updates on its own, and nothing phones home."
			/>

			<Snippet
				label="INSPECT — IDENTITY, CENSUS, COHERENCE, FROM THE ARTIFACT ALONE"
				code={`$ vindex inspect granite-3b.vindex3
family         granite
generation     3
geometry       40 layers · hidden 2560
authority      canonical

COMPONENT   ROLE          LAYERS   HIDDEN
target      primarytext       40     2560

graph          4 object(s) · coherent`}
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

			<Observation
				label="WHERE CONTAINERS COME FROM"
				text="The vindex CLI reads containers; it does not create them from checkpoints. Encoding a Hugging Face checkpoint into a VINDEX3 container — and proving source ≡ encoded — is the reference implementation's job: larql vindex3 encode, then larql vindex3 verify. The boundary is deliberate: understanding an artifact must never require the engine, but producing one from a source is where an engine earns its keep."
			/>

			<Statement text="Every command here answers from the artifact alone. That is the test of a format." />

			<Connection
				text="The same verbs run in the browser against a hardened public container, and the same grammar reads back as designed panels. Three transports, one meaning."
				links={[
					{ href: "/explorer", label: "THE EXPLORER" },
					{ href: "/quantization", label: "QUANTIZATION" },
					{ href: "/ladder", label: "THE RECORD" },
				]}
			/>
		</main>
	);
}
