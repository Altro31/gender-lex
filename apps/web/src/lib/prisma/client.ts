import { getSession } from '@/lib/auth/auth-server'
import { authClient } from '@repo/db/client'
import envs from '@/lib/env/env-server'

export async function getPrisma() {
	const session = await getSession()
	const key = envs.ENCRYPTION_KEY
	return authClient.$setAuth(session?.user)
}
