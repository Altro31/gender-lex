import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { PrismaClient } from '@repo/db/client'

export function createAuth(
	get: (env: string) => string | undefined,
): ReturnType<typeof betterAuth> {
	const prisma = new PrismaClient()

	return betterAuth({
		trustedOrigins: [get('UI_URL') ?? ''],
		database: prismaAdapter(prisma, { provider: 'postgresql' }),
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
	})
}
