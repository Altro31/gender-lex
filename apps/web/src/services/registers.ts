'use server'

import { client } from '@/lib/api/client'
import { auth, getSession } from '@/lib/auth/auth-server'
import { getDB } from '@/lib/db/client'
import { actionClient } from '@/lib/safe-action'
import { cookies, headers } from 'next/headers'
import z from 'zod'

export async function setTheme(isDark: boolean) {
	const cookiesStore = await cookies()
	cookiesStore.set('THEME_DARK', isDark + '')
}

export const setLanguage = actionClient
	.inputSchema(z.string())
	.action(async ({ parsedInput: lang }) => {
		const session = await getSession()
		if (!session) throw new Error('Unauthorized')
		const db = await getDB()
		const data = await db.session.update({
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
