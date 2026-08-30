import { NextRequest, NextResponse } from "next/server";

/**
 * One canonical host. www resolves, but every signal points at the
 * apex — a permanent redirect, never a split identity.
 */
export function middleware(request: NextRequest) {
	const host = request.headers.get("host") ?? "";
	if (host.startsWith("www.")) {
		const url = new URL(request.url);
		url.host = host.slice(4);
		url.protocol = "https:";
		url.port = "";
		return NextResponse.redirect(url, 301);
	}
	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/|api/).*)"],
};
