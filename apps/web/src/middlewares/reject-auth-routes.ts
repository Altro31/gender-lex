import { auth } from "@/lib/auth/auth-server"
import { NextResponse, type NextRequest } from "next/server"

export const matches = ["/auth/login", "/auth/register"]

export async function rejectAuthRoutes(req: NextRequest) {
	const session = await auth.api.getSession(req)
	if (
		session &&
		!session.user.isAnonymous &&
		matches.some((route) => req.nextUrl.pathname.startsWith(route))
	) {
		return NextResponse.redirect(new URL("/", req.url), {
			headers: req.headers,
		})
	}
}
