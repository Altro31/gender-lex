import { protectedRoutes } from "@/middlewares/protected-routes"
import { rejectAuthRoutes } from "@/middlewares/reject-auth-routes"
import { NextResponse } from "next/server"

export async function middleware(req: any) {
	return (
		(await protectedRoutes(req)) ||
		(await rejectAuthRoutes(req)) ||
		NextResponse.next()
	)
}

export const config = {
	runtime: "nodejs",
	matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
}
