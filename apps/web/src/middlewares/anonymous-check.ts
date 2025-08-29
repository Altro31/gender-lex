import { auth } from "@/lib/auth/auth-server"
import { parseSetCookieHeader } from "better-auth/cookies"
import { cookies } from "next/headers"
import { NextRequest } from "next/server"

export async function anonymousCheck(req: NextRequest) {
	const session = await auth.api.getSession(req)
	if (!session) {
		const { headers } = await auth.api.signInAnonymous({
			returnHeaders: true,
		})
		const setCookies = headers.get("set-cookie")
		if (!setCookies) return
		const parsed = parseSetCookieHeader(setCookies)
		const cookieHelper = await cookies()
		parsed.forEach((value, key) => {
			if (!key) return
			const opts = {
				sameSite: value.samesite,
				secure: value.secure,
				maxAge: value["max-age"],
				httpOnly: value.httponly,
				domain: value.domain,
				path: value.path,
			}
			try {
				cookieHelper.set(key, decodeURIComponent(value.value), opts)
				req.cookies.set({
					name: key,
					value: decodeURIComponent(value.value),
				})
			} catch {}
		})
	}
}
