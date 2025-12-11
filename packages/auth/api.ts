import { zenstackAdapter } from '@zenstackhq/better-auth'
import { betterAuth } from 'better-auth'
import { anonymous, customSession } from 'better-auth/plugins'
import { client } from '@repo/db/client'

export const auth = betterAuth({
	trustedOrigins: [process.env.UI_URL ?? ''],
	database: zenstackAdapter(client as any, { provider: 'postgresql' }),
	session: {
		additionalFields: { lang: { type: 'string', defaultValue: 'es' } },
	},
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
		customSession(async ({ session: { id } }) => {
			const session = await client.session.findUnique({
				where: { id },
				include: { user: true },
			})
			if (!session) throw new Error('Session not found')
			return { user: session.user, session }
		}),
		anonymous({
			async onLinkAccount({ anonymousUser, newUser }) {
				await client.$transaction([
					client.analysis.updateMany({
						where: { userId: anonymousUser.user.id },
						data: { userId: newUser.user.id },
					}),
					client.model.updateMany({
						where: { userId: anonymousUser.user.id },
						data: { userId: newUser.user.id },
					}),
					client.preset.updateMany({
						where: { userId: anonymousUser.user.id },
						data: { userId: newUser.user.id },
					}),
				])
			},
		}),
	],
})
