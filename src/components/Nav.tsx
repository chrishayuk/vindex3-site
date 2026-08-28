import Link from "next/link";
import { ModeToggle } from "@chrishayuk/house/components/ModeToggle";

export function Nav() {
	return (
		<header className="house-grid items-center py-6">
			<div className="col-span-6 md:col-span-3">
				<Link href="/" className="voice-system text-sm tracking-[0.12em]">
					VINDEX3
				</Link>
			</div>
			<nav className="col-span-6 md:col-span-9 flex justify-end items-center gap-3 sm:gap-8 flex-nowrap">
				<ModeToggle />
			</nav>
		</header>
	);
}
