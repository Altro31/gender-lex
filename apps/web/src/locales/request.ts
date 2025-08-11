import { auth } from "@/lib/auth/auth-server"
import type { User } from "@repo/db/models"
import { getRequestConfig } from "next-intl/server"
import { headers } from "next/headers"

export default getRequestConfig(async ({ locale: inputLocale }) => {
	let locale = "en"
	if (!inputLocale) {
		const session = await auth.api.getSession({ headers: await headers() })
		if (session) {
			locale = (session.user as User).lang ?? "en"
		}
	}

	return {
		locale,
		messages: (await import(`./langs/${locale}.json`)).default,
	}
})
