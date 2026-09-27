import { NavShell, type NavLink } from "@chrishayuk/hause/components/NavShell";
import { ModeToggle } from "@chrishayuk/hause/components/ModeToggle";
import { SoundToggle } from "@chrishayuk/hause/components/SoundToggle";

const LINKS: NavLink[] = [
	{ href: "/why", label: "Why", group: "I · THE ARTIFACT" },
	{ href: "/anatomy", label: "Anatomy", hide: "md", group: "I · THE ARTIFACT" },
	{ href: "/container", label: "Container", panelOnly: true, group: "I · THE ARTIFACT" },
	{ href: "/graph", label: "Graph", panelOnly: true, group: "I · THE ARTIFACT" },
	{ href: "/bytes", label: "Bytes", panelOnly: true, group: "I · THE ARTIFACT" },
	{ href: "/execution", label: "Execution", panelOnly: true, group: "II · THE MACHINE" },
	{ href: "/quantization", label: "Quantization", hide: "lg", group: "II · THE MACHINE" },
	{ href: "/discovery", label: "Discovery", panelOnly: true, group: "II · THE MACHINE" },
	{ href: "/representation", label: "Representation", panelOnly: true, group: "II · THE MACHINE" },
	{ href: "/represent", label: "REPRESENT", hide: "lg", group: "II · THE MACHINE" },
	{ href: "/execution#state", label: "State", panelOnly: true, group: "II · THE MACHINE" },
	{ href: "/record", label: "Observe", hide: "sm", group: "III · THE EVIDENCE" },
	{ href: "/record#intervene", label: "Intervene", panelOnly: true, group: "III · THE EVIDENCE" },
	{ href: "/authority", label: "Authority", panelOnly: true, group: "III · THE EVIDENCE" },
	{ href: "/lifecycle", label: "Lifecycle", panelOnly: true, group: "III · THE EVIDENCE" },
	{ href: "/ladder", label: "Evidence ledger", panelOnly: true, group: "III · THE EVIDENCE" },
	{ href: "/status", label: "Current", panelOnly: true, group: "III · THE EVIDENCE" },
	{ href: "/models/qwen3.8-27b", label: "Qwen3.8-27B", panelOnly: true, group: "III · THE EVIDENCE" },
	{ href: "/cite", label: "How to cite", panelOnly: true, group: "III · THE EVIDENCE" },
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
