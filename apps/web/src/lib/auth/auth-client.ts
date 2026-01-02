import { lastLoginMethodClient, oneTapClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
	basePath: '/api/auth',
	plugins: [
		lastLoginMethodClient(),
		oneTapClient({
			clientId: process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID!,
			context: 'signin',
		}),
	],
})
export const useSession = authClient.useSession
export function useLastLoginMethod() {
	const method = authClient.getLastUsedLoginMethod()
	const extra = {
		isLastMethod: authClient.isLastUsedLoginMethod,
		clearLastMethod: authClient.clearLastUsedLoginMethod,
	}
	return [method, extra] as const
}
