import { anonymousCheck } from "@/middlewares/anonymous-check"
import { rejectAuthRoutes } from "@/middlewares/reject-auth-routes"
import { routingMiddleware } from "@/middlewares/routing"
import { type NextRequest } from "next/server"

export async function proxy(req: NextRequest) {
	return (
		(await anonymousCheck(req)) ??
		(await rejectAuthRoutes(req)) ??
		routingMiddleware(req as any)
	)
}

export const config = {
	matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
}
