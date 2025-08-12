import { auth, getSession, refetchSession } from "@/lib/auth/auth-server"

export async function anonymousCheck() {
	const session = await getSession()
	if (!session) {
		await auth.api.signInAnonymous()
		await refetchSession()
	}
}
