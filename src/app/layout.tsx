import type { Metadata } from "next";
import { Fraunces, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";

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
	title: {
		default: "VINDEX3",
		template: "%s — VINDEX3",
	},
	description: "The VINDEX3 specification, as an exhibition.",
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
				<Nav />
				{children}
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
