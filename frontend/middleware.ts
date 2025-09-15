import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Check if user has session cookie (indicating they're logged in)
	const sessionCookie = request.cookies.get("connect.sid");

	// If user is logged in and trying to access login or register pages, redirect to home
	if (sessionCookie && (pathname === "/auth/login" || pathname === "/auth/register")) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	// Check if user is trying to access protected routes (if any in future)
	// For now, all routes are public except auth redirects above

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
