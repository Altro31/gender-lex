"use server"

import { client } from "@/lib/api/client"
import { auth, getSession } from "@/lib/auth/auth-server"
import { getPrisma } from "@/lib/prisma/client"
import { actionClient } from "@/lib/safe-action"
import { cookies, headers } from "next/headers"
import z from "zod"

export async function setTheme(isDark: boolean) {
	const cookiesStore = await cookies()
	cookiesStore.set("THEME_DARK", isDark + "")
}

export const setLanguage = actionClient
	.inputSchema(z.string())
	.action(async ({ parsedInput: lang }) => {
		const session = await getSession()
		if (!session) throw new Error("Unauthorized")
		const prisma = await getPrisma()
		const data = await prisma.session.update({
			where: { id: session.session.id },
			data: { lang },
		})
		if (data) {
			await auth.api.getSession({
				headers: await headers(),
				query: { disableCookieCache: true },
			})
			return false
		}

		return true
	})
