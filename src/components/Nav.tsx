import { NavShell, type NavLink } from "@chrishayuk/hause/components/NavShell";
import { ModeToggle } from "@chrishayuk/hause/components/ModeToggle";
import { SoundToggle } from "@chrishayuk/hause/components/SoundToggle";

const LINKS: NavLink[] = [
	{ href: "/why", label: "Why", group: "THE JOURNEY" },
	{ href: "/anatomy", label: "Anatomy", hide: "sm", group: "THE JOURNEY" },
	{ href: "/ask", label: "Ask", group: "ASK & EXPLORE" },
	{ href: "/explorer", label: "Explorer", group: "ASK & EXPLORE" },
	{ href: "/container", label: "Container", hide: "md", group: "THE SPEC" },
	{ href: "/bytes", label: "Bytes", hide: "md", group: "THE SPEC" },
	{ href: "/graph", label: "Graph", hide: "lg", group: "THE SPEC" },
	{ href: "/execution", label: "Execution", hide: "lg", group: "THE SPEC" },
	{ href: "/representation", label: "Representation", hide: "sm", group: "THE SPEC" },
	{ href: "/authority", label: "Authority", hide: "sm", group: "THE SPEC" },
	{ href: "/ladder", label: "Record", group: "THE RECORD" },
];

export function Nav() {
	return (
		<NavShell
			brand={{ href: "/", label: "VINDEX3" }}
			links={LINKS}
			controls={
				<>
					<SoundToggle />
					<ModeToggle />
				</>
			}
		/>
	);
}
