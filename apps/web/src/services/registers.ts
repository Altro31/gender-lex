"use server"

import { client } from "@/lib/api/client"
import { auth } from "@/lib/auth/auth-server"
import { cookies, headers } from "next/headers"

export async function setTheme(isDark: boolean) {
	const cookiesStore = await cookies()
	cookiesStore.set("THEME_DARK", isDark + "")
}

export async function setLanguage(lang: string) {
	const session = await auth.api.getSession({ headers: await headers() })
	if (!session) throw new Error("")
	const { error } = await client.PATCH("/zen/session/{id}", {
		params: { path: { id: session.session.id } },
		body: {
			data: {
				id: session.session.id,
				type: "session",
				attributes: { lang },
			},
		},
	})
	if (!error) {
		await auth.api.getSession({
			headers: await headers(),
			query: { disableCookieCache: true },
		})
		return false
	}
	console.log(error)

	return true
}
