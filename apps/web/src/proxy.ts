import { rejectAuthRoutes } from '@/middlewares/reject-auth-routes'
import { routingMiddleware } from '@/middlewares/routing-middleware'
import { type NextRequest } from 'next/server'
import { protectedRoutes } from './middlewares/protected-routes'

export async function proxy(req: NextRequest) {
	return (
		(await protectedRoutes(req)) ??
		(await rejectAuthRoutes(req)) ??
		routingMiddleware(req as any)
	)
}

export const config = {
	matcher: [
		'/((?!api|_next|_vercel|.well-known/|favicon.ico|manifest.webmanifest|icon.*.png|sw.js|badge.png).*)',
	],
}
