import { getSession } from '@/lib/auth/auth-server'
import { authDB } from '@repo/db/client'

export async function getDB() {
	const session = await getSession()
	return authDB.$setAuth(session?.user)
}
