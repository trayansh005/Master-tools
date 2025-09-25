import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	console.log(`Middleware: Processing request for ${pathname}`);

	// Check if user has session cookie (indicating they're logged in)
	const sessionCookie = request.cookies.get("connect.sid");
	console.log(`Middleware: Session cookie present: ${!!sessionCookie}`);

	// If user is logged in and trying to access login or register pages, redirect to home
	if (sessionCookie && (pathname === "/auth/login" || pathname === "/auth/register")) {
		console.log(`Middleware: Redirecting logged-in user from ${pathname} to home`);
		return NextResponse.redirect(new URL("/", request.url));
	}

	// Check if user is trying to access protected routes (if any in future)
	// For now, all routes are public except auth redirects above
	console.log(`Middleware: Allowing request to proceed to ${pathname}`);

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
