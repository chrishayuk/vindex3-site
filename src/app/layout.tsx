import type { Metadata } from "next";
import { Fraunces, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { SiteFooter } from "@chrishayuk/hause/components/SiteFooter";
import { Analytics } from "@chrishayuk/hause/components/Analytics";
import { JsonLd } from "@chrishayuk/hause/components/JsonLd";
import { webSiteLd } from "@chrishayuk/hause/seo";

const fraunces = Fraunces({
	variable: "--font-fraunces",
	subsets: ["latin"],
	weight: ["400", "500", "600"],
});

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	metadataBase: new URL("https://vindex3.org"),
	title: {
		default: "VINDEX3 — A Queryable AI Model Container",
		template: "%s — VINDEX3",
	},
	description:
		"VINDEX3 is a model container that preserves semantic structure, physical representations, provenance and queryability alongside the weights — the model is the database.",
	alternates: { canonical: "/" },
	icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${fraunces.variable} ${inter.variable} ${geistMono.variable}`} suppressHydrationWarning>
			<head>
				<JsonLd
					data={webSiteLd({
						name: "VINDEX3",
						url: "https://vindex3.org",
						description:
							"VINDEX3 is a model container that preserves semantic structure, physical representations, provenance and queryability alongside the weights.",
					})}
				/>
				{/* HAUSE-mode blocking script — runs before paint so the page
				    never flashes the wrong environment. Dark is the default;
				    the stored preference opts a viewer back into light. */}
				<script
					// eslint-disable-next-line react/no-danger
					dangerouslySetInnerHTML={{
						__html: `try{var m=localStorage.getItem('hause-mode');if(m==='light')document.documentElement.dataset.mode='light';}catch(e){}`,
					}}
				/>
			</head>
			<body className="antialiased">
				<Analytics id="G-YTRGXVYVLH" />
				<Nav />
				{children}
				<SiteFooter
					brand="VINDEX3"
					tagline="The model is the database — components named, representations catalogued, claims checkable."
					note="VINDEX3 · 3.0-draft-2 · every metric on this site names its model, hardware and date, and answers to the Record."
					groups={[
						{
							label: "THE JOURNEY",
							links: [
								{ href: "/why", label: "The Physics" },
								{ href: "/anatomy", label: "The Anatomy" },
								{ href: "/quantization", label: "Quantization" },
								{ href: "/discovery", label: "Discovering the Map" },
							],
						},
						{
							label: "THE SPEC",
							links: [
								{ href: "/container", label: "The Container" },
								{ href: "/graph", label: "The System Graph" },
								{ href: "/bytes", label: "The Bytes" },
								{ href: "/execution", label: "Execution" },
								{ href: "/representation", label: "Representation" },
								{ href: "/authority", label: "Authority" },
							],
						},
						{
							label: "ASK & EXPLORE",
							links: [
								{ href: "/ask", label: "Ask VINDEX3" },
								{ href: "/explorer", label: "The Explorer" },
								{ href: "/concepts", label: "The Concepts" },
								{ href: "/get-started", label: "Get Started — the CLI" },
							],
						},
						{
							label: "THE RECORD",
							links: [
								{ href: "/ladder", label: "The Record" },
								{ href: "https://github.com/chrishayuk/larql/blob/main/docs/vindex3-format.md", label: "The spec document", external: true },
								{ href: "https://github.com/chrishayuk/larql/tree/main/crates/vindex-cli", label: "The CLI source", external: true },
								{ href: "https://github.com/chrishayuk/larql/releases/tag/vindex-v0.3.0", label: "The release", external: true },
							],
						},
					]}
				/>
				<footer className="hause-grid py-16 mt-20 border-t" style={{ borderColor: "var(--color-mist)" }}>
					<div className="col-span-12 flex flex-wrap items-baseline justify-between gap-4">
						<p className="voice-evidence text-xs opacity-50">VINDEX3 · SPEC / 2026</p>
						<p className="voice-evidence text-xs opacity-50 flex gap-6">
							<a href="https://hause.design" className="hover:opacity-100">
								SET IN HAUSE →
							</a>
							<a href="https://chrishayuk.com" className="hover:opacity-100">
								CHRISHAYUK →
							</a>
						</p>
					</div>
				</footer>
			</body>
		</html>
	);
}
