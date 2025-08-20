import { PrismaClient } from '@repo/db/client'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { customSession, anonymous } from 'better-auth/plugins'

const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
	global.prisma = prisma
}

export const auth = betterAuth({
	trustedOrigins: [process.env.UI_URL ?? ''],
	database: prismaAdapter(prisma, { provider: 'postgresql' }),
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
		nextCookies(),
		customSession(async ({ session: { id } }) => {
			const session = await prisma.session.findUnique({
				where: { id },
				include: { user: true },
			})
			if (!session) throw new Error('Session not found')
			return { user: session.user, session }
		}),
		anonymous({
			async onLinkAccount({ anonymousUser, newUser }) {
				await prisma.$transaction([
					prisma.analysis.updateMany({
						where: { userId: anonymousUser.user.id },
						data: { userId: newUser.user.id },
					}),
					prisma.model.updateMany({
						where: { userId: anonymousUser.user.id },
						data: { userId: newUser.user.id },
					}),
					prisma.preset.updateMany({
						where: { userId: anonymousUser.user.id },
						data: { userId: newUser.user.id },
					}),
				])
			},
		}),
	],
})
