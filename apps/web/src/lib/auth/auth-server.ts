import { auth } from "@repo/auth/next"
import { headers } from "next/headers"

export { auth } from "@repo/auth/next"

export async function getSession() {
	return auth.api.getSession({ headers: await headers() })
}

export async function refetchSession() {
	return auth.api.getSession({
		headers: await headers(),
		query: { disableCookieCache: true },
	})
}
