export { auth } from "@repo/auth"
import { auth } from "@repo/auth"
import { headers } from "next/headers"

export async function getSession() {
	return auth.api.getSession({ headers: await headers() })
}

export async function refetchSession() {
	return auth.api.getSession({
		headers: await headers(),
		query: { disableCookieCache: true },
	})
}
