import { getSession } from '@/lib/auth/auth-server'
import { authClient } from '@repo/db/client'

export async function getDB() {
	const session = await getSession()
	return authClient.$setAuth(session?.user)
}
