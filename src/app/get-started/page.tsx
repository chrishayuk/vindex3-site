import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@chrishayuk/hause/components/forms/Hero";
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { Observation } from "@chrishayuk/hause/components/forms/Observation";
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
 * The on-ramp: from nothing to interrogating a container locally.
 * Every output on this page is a recorded run of the real binary
 * against a real container (2026-08-30, M3 Max) — the same rule as
 * everywhere else on the site: shown because it ran.
 */

function Cmd({ lines }: { lines: string[] }) {
	return (
		<div className="border p-4 overflow-x-auto" style={{ borderColor: "var(--color-mist)", background: "var(--color-ink)" }}>
			{lines.map((l, i) => (
				<p
					key={i}
					className="voice-evidence text-[12px] leading-relaxed whitespace-pre m-0"
					style={{ color: l.startsWith("$") ? "var(--color-white)" : "var(--color-white)", opacity: l.startsWith("$") ? 1 : 0.65 }}
				>
					{l}
				</p>
			))}
		</div>
	);
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
	return (
		<section className="hause-grid py-8">
			<div className="col-span-12 md:col-start-2 md:col-span-2">
				<p className="voice-evidence text-xs tracking-[0.14em] uppercase opacity-50 m-0">
					<span style={{ color: "var(--color-accent)" }}>{n}</span> · {title}
				</p>
			</div>
			<div className="col-span-12 md:col-span-8 flex flex-col gap-4">{children}</div>
		</section>
	);
}

export default function GetStartedPage() {
	return (
		<main>
			<JsonLd
				data={softwareApplicationLd({
					name: "vindex",
					description:
						"The format-native VINDEX3 CLI: inspect, describe, representations, diff, represent, precision, verify — every command answering from the artifact alone, every command speaking --json.",
					url: "https://vindex3.org/get-started",
					downloadUrl: "https://github.com/chrishayuk/larql/releases/tag/vindex-v0.2.0",
					operatingSystem: "macOS, Linux, Windows (build from source)",
					version: "0.2.0",
				})}
			/>
			<Hero
				kicker="GET STARTED · THE VINDEX CLI · RECORDED RUNS · 2026-08-30"
				title="AN ARTIFACT, UNDERSTOOD WITHOUT AN ENGINE"
				dek="Seven commands against a local container — inspect, describe, representations, diff, represent, precision, verify — each answering from the artifact alone, each speaking --json. No inference runtime attached."
			/>

			<Statement text="The file answers for itself. Here is how to ask." />

			<Step n="01" title="INSTALL">
				<p className="voice-system text-sm opacity-80 leading-relaxed m-0">
					A prebuilt binary ships with each release — macOS arm64 today — and any platform with stable Rust
					builds it from source:
				</p>
				<Cmd
					lines={[
						"$ curl -L https://github.com/chrishayuk/larql/releases/download/\\",
						"    vindex-v0.2.0/vindex-0.2.0-macos-arm64.tar.gz | tar xz",
						"$ ./vindex --help",
						"The format-native VINDEX3 tool: inspect, describe,",
						"representations, diff, represent, precision, verify.",
					]}
				/>
				<Cmd
					lines={[
						"$ cargo install --git https://github.com/chrishayuk/larql vindex-cli",
					]}
				/>
				<p className="voice-system text-sm opacity-70 leading-relaxed m-0">
					Every command takes a global <span className="voice-evidence text-[12px]">--json</span> — one result,
					three projections: terminal text, structured JSON, and the designed panels this site renders.{" "}
					<a
						href="https://github.com/chrishayuk/larql/releases/tag/vindex-v0.2.0"
						className="border-b pb-0.5"
						style={{ borderColor: "var(--color-accent)" }}
					>
						The release →
					</a>
				</p>
			</Step>

			<Step n="02" title="INSPECT">
				<p className="voice-system text-sm opacity-80 leading-relaxed m-0">
					Point it at a container. Identity, geometry, and the graph census are reconstructed from the artifact
					alone — recorded here against a real 3B container:
				</p>
				<Cmd
					lines={[
						"$ vindex inspect granite-3b.vindex3",
						"family         granite",
						"generation     3",
						"geometry       40 layers · hidden 2560",
						"authority      canonical",
						"",
						"COMPONENT   ROLE          LAYERS   HIDDEN",
						"target      primarytext       40     2560",
						"",
						"graph          4 object(s) · coherent",
					]}
				/>
			</Step>

			<Step n="03" title="PRECISION">
				<p className="voice-system text-sm opacity-80 leading-relaxed m-0">
					Bits per weight, derived — payload bytes over tensor elements, never a label read off a filename:
				</p>
				<Cmd
					lines={[
						"$ vindex precision granite-3b.vindex3",
						"REPRESENTATION               ENCODING     WEIGHTS        BYTES   BITS/W",
						"target.decoder_stack@BF16    BF16      3145932800   6291865600  16.0000",
						"target.embedding@BF16        BF16       256901120    513802240  16.0000",
						"target.output_head@BF16      BF16       256901120    513802240  16.0000",
					]}
				/>
			</Step>

			<Step n="04" title="REPRESENT">
				<p className="voice-system text-sm opacity-80 leading-relaxed m-0">
					Compile a representation beside the original — nothing destroyed, the canonical bytes untouched.
					Recorded: the 3B decoder stack compiled in 12.6 seconds on an M3 Max:
				</p>
				<Cmd
					lines={[
						"$ vindex represent granite-3b.vindex3 granite-r0.vindex3",
						"compiled       target.decoder_stack",
						"tensors        280 re-encoded · 80 carried verbatim",
						"bytes          6291456000 → 1769882720 (3.55× smaller)",
						"preserved      target.embedding — wholly at BF16",
						"preserved      target.output_head — wholly at BF16",
					]}
				/>
				<p className="voice-system text-sm opacity-70 leading-relaxed m-0">
					And the compiled pack&apos;s own precision row shows the honest figure — four-bit codes costing{" "}
					<span className="voice-evidence text-[12px]">4.5008 bits per weight</span>, because the scales are
					never free.{" "}
					<Link href="/quantization" className="border-b pb-0.5" style={{ borderColor: "var(--color-accent)" }}>
						The quantization chapter walks why →
					</Link>
				</p>
			</Step>

			<Step n="05" title="DIFF">
				<p className="voice-system text-sm opacity-80 leading-relaxed m-0">
					One object under two of the container&apos;s representations, decoded and compared value by value.
					Recorded: all 3.1 billion weights of BF16 against NVFP4 in 8.6 seconds:
				</p>
				<Cmd
					lines={[
						"$ vindex diff granite-r0.vindex3 BF16 NVFP4 decoder_stack \\",
						"    --tensor 0.mlp.down_proj.weight",
						"",
						"0.mlp.down_proj.weight — first values",
						"        A             B         ERROR",
						" -0.003464     -0.003226      0.000238",
						" -0.000748     -0.000538      0.000210",
						" -0.003326     -0.003226      0.000100",
						"",
						"result   3138112816 of 3145932800 values differ",
						"         rms 0.001029 · max 0.074498",
					]}
				/>
				<p className="voice-system text-sm opacity-70 leading-relaxed m-0">
					The errors are derived, never asserted: both sides decode through the same arithmetic a matmul would
					use. An encoding the container does not hold is refused by naming what it does hold.
				</p>
			</Step>

			<Step n="06" title="VERIFY">
				<p className="voice-system text-sm opacity-80 leading-relaxed m-0">
					The artifact against its own recorded hashes — every segment re-hashed whole, every payload region
					re-hashed, compared with what the directory recorded at encode time:
				</p>
				<Cmd
					lines={[
						"$ vindex verify granite-r0.vindex3",
						"target.decoder_stack@BF16          ok",
						"target.decoder_stack@NVFP4         ok",
						"target.embedding@BF16              ok",
						"target.output_head@BF16            ok",
						"",
						"verified   yes — the artifact agrees with its own record",
					]}
				/>
				<p className="voice-system text-sm opacity-70 leading-relaxed m-0">
					The scope is stated plainly: self-verification, from the artifact alone. Proving faithfulness to the{" "}
					<em>source</em> additionally needs the source — that gate lives with the reference implementation.
				</p>
			</Step>

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
