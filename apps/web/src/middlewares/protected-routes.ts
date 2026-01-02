import { getSession } from '@/lib/auth/auth-server'
import { NextResponse, type NextRequest } from 'next/server'

export const matches = [
	'/analysis',
	'/models',
	'/presets',
	'/profile',
	'/auth/forgot-password',
]

export async function protectedRoutes(req: NextRequest) {
	const session = await getSession()
	if (
		!session &&
		matches.some(route => req.nextUrl.pathname.includes(route))
	) {
		return NextResponse.redirect(new URL('/auth/login', req.url))
	}
}
