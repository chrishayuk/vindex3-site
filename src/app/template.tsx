/**
 * Remounts on every navigation, so each page arrives with the
 * route-enter rise — one transition idiom for the whole site.
 */
export default function Template({ children }: { children: React.ReactNode }) {
	return <div className="route-enter">{children}</div>;
}
