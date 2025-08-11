import { PrismaClient } from '@repo/db/client'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { customSession } from 'better-auth/plugins'

export function createAuth(
	get: (env: string) => string | undefined,
): ReturnType<typeof betterAuth> {
	const prisma = new PrismaClient()
	return betterAuth({
		trustedOrigins: [get('UI_URL') ?? ''],
		database: prismaAdapter(prisma, { provider: 'postgresql' }),
		user: {
			additionalFields: { lang: { type: 'string', defaultValue: 'es' } },
		},
		emailAndPassword: { enabled: true },
		socialProviders: {
			google: {
				clientId: get('AUTH_GOOGLE_ID')!,
				clientSecret: get('AUTH_GOOGLE_SECRET')!,
				redirectURI: `${get('UI_URL') ?? ''}/api/auth/callback/google`,
			},
			github: {
				clientId: get('AUTH_GITHUB_ID')!,
				clientSecret: get('AUTH_GITHUB_SECRET')!,
				redirectURI: `${get('UI_URL') ?? ''}/api/auth/callback/github`,
			},
		},
		plugins: [
			nextCookies(),
			customSession(async ({ session, user: { id } }) => {
				const user = await prisma.user.findUnique({ where: { id } })
				return { user, session }
			}) as any,
		],
	})
}
