import { protectedRoutes } from "@/middlewares/protected-routes"
import { rejectAuthRoutes } from "@/middlewares/reject-auth-routes"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
	return (
		(await protectedRoutes(req)) ||
		(await rejectAuthRoutes(req)) ||
		NextResponse.next()
	)
}

export const config = {
	runtime: "nodejs",
}
