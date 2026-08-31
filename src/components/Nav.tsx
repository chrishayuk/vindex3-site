import { NavShell, type NavLink } from "@chrishayuk/hause/components/NavShell";
import { ModeToggle } from "@chrishayuk/hause/components/ModeToggle";
import { SoundToggle } from "@chrishayuk/hause/components/SoundToggle";

const LINKS: NavLink[] = [
	// Groups are contiguous (the panel groups consecutively); the desktop
	// row is the panelOnly-filtered order — the journey's spine, the
	// Record, the two surfaces, and the boxed doorway last.
	{ href: "/why", label: "Why", group: "THE JOURNEY" },
	{ href: "/anatomy", label: "Anatomy", hide: "md", group: "THE JOURNEY" },
	{ href: "/quantization", label: "Quantization", hide: "lg", group: "THE JOURNEY" },
	{ href: "/discovery", label: "Discovery", panelOnly: true, group: "THE JOURNEY" },
	{ href: "/represent", label: "REPRESENT", hide: "lg", group: "THE JOURNEY" },
	{ href: "/container", label: "Container", panelOnly: true, group: "THE SPEC" },
	{ href: "/graph", label: "Graph", panelOnly: true, group: "THE SPEC" },
	{ href: "/bytes", label: "Bytes", panelOnly: true, group: "THE SPEC" },
	{ href: "/execution", label: "Execution", panelOnly: true, group: "THE SPEC" },
	{ href: "/representation", label: "Representation", panelOnly: true, group: "THE SPEC" },
	{ href: "/authority", label: "Authority", panelOnly: true, group: "THE SPEC" },
	{ href: "/lifecycle", label: "Lifecycle", panelOnly: true, group: "THE SPEC" },
	{ href: "/models/qwen3.8-27b", label: "Qwen3.8-27B", panelOnly: true, group: "THE RECORD" },
	{ href: "/ladder", label: "Record", hide: "sm", group: "THE RECORD" },
	{ href: "/cite", label: "How to cite", panelOnly: true, group: "THE RECORD" },
	{ href: "/ask", label: "Ask", accent: true, group: "ASK & EXPLORE" },
	{ href: "/explorer", label: "Explorer", group: "ASK & EXPLORE" },
	{ href: "/concepts", label: "Concepts", panelOnly: true, group: "ASK & EXPLORE" },
	{ href: "/get-started", label: "Get started", boxed: true, group: "ASK & EXPLORE" },
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
