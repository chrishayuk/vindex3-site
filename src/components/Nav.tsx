import Link from "next/link";
import { ModeToggle } from "@chrishayuk/hause/components/ModeToggle";

export function Nav() {
	return (
		<header className="hause-grid items-center py-6">
			<div className="col-span-6 md:col-span-3">
				<Link href="/" className="voice-system text-sm tracking-[0.12em]">
					VINDEX3
				</Link>
			</div>
			<nav className="col-span-6 md:col-span-9 flex justify-end items-center gap-3 sm:gap-8 flex-nowrap">
				<Link href="/why" className="voice-evidence text-xs tracking-[0.1em] uppercase opacity-70 hover:opacity-100 transition-opacity">
					Why
				</Link>
				<Link href="/container" className="voice-evidence text-xs tracking-[0.1em] uppercase opacity-70 hover:opacity-100 transition-opacity hidden md:inline">
					Container
				</Link>
				<Link href="/bytes" className="voice-evidence text-xs tracking-[0.1em] uppercase opacity-70 hover:opacity-100 transition-opacity hidden md:inline">
					Bytes
				</Link>
				<Link href="/graph" className="voice-evidence text-xs tracking-[0.1em] uppercase opacity-70 hover:opacity-100 transition-opacity hidden lg:inline">
					Graph
				</Link>
				<Link href="/execution" className="voice-evidence text-xs tracking-[0.1em] uppercase opacity-70 hover:opacity-100 transition-opacity hidden lg:inline">
					Execution
				</Link>
				<Link href="/representation" className="voice-evidence text-xs tracking-[0.1em] uppercase opacity-70 hover:opacity-100 transition-opacity hidden sm:inline">
					Representation
				</Link>
				<Link href="/authority" className="voice-evidence text-xs tracking-[0.1em] uppercase opacity-70 hover:opacity-100 transition-opacity hidden sm:inline">
					Authority
				</Link>
				<Link href="/ladder" className="voice-evidence text-xs tracking-[0.1em] uppercase opacity-70 hover:opacity-100 transition-opacity">
					Record
				</Link>
				<ModeToggle />
			</nav>
		</header>
	);
}
