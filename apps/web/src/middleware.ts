import { anonymousCheck } from "@/middlewares/anonymous-check"
import { rejectAuthRoutes } from "@/middlewares/reject-auth-routes"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
	return (
		(await anonymousCheck(req)) ??
		(await rejectAuthRoutes(req)) ??
		NextResponse.next({ request: req })
	)
}

export const config = {
	runtime: "nodejs",
	matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
}
