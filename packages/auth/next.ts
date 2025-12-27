import { client } from '@repo/db/client'
import { zenstackAdapter } from '@zenstackhq/better-auth'
import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { customSession } from 'better-auth/plugins'

export const auth = betterAuth({
	database: zenstackAdapter(client as any, { provider: 'postgresql' }),
	emailAndPassword: { enabled: true },
	socialProviders: {
		google: {
			clientId: process.env.AUTH_GOOGLE_ID ?? '',
			clientSecret: process.env.AUTH_GOOGLE_SECRET ?? '',
			redirectURI: `${process.env.UI_URL ?? ''}/api/auth/callback/google`,
		},
		github: {
			clientId: process.env.AUTH_GITHUB_ID ?? '',
			clientSecret: process.env.AUTH_GITHUB_SECRET ?? '',
			redirectURI: `${process.env.UI_URL ?? ''}/api/auth/callback/github`,
		},
	},
	plugins: [
		nextCookies(),
		customSession(async ({ session: { id } }) => {
			const session = await client.session.findUnique({
				where: { id },
				include: { user: true },
			})
			if (!session) throw new Error('Session not found')
			return session
		}),
	],
})
