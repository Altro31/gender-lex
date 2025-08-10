import { auth } from "@/lib/auth/auth-server"
import { getRequestConfig } from "next-intl/server"
import { headers } from "next/headers"
import type { Session } from "@repo/db/models"

export default getRequestConfig(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	})
	let locale = "en"
	if (session) {
		locale = (session.session as Session).lang!
	}

	return {
		locale,
		messages: (await import(`./langs/${locale}.json`)).default,
	}
})
