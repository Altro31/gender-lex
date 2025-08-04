import { getSession } from "@/lib/auth/auth-server"
import { NextResponse, type NextRequest } from "next/server"

export const matches = ["/auth/login", "/auth/register"]

export async function rejectAuthRoutes(req: NextRequest) {
	const session = await getSession()
	if (
		session &&
		matches.some((route) => req.nextUrl.pathname.startsWith(route))
	) {
		return NextResponse.redirect(new URL("/", req.url))
	}
}
