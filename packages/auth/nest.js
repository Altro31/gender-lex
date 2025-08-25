import { betterAuth, } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { anonymous, customSession } from 'better-auth/plugins'

export const getBetterAuth = (prisma, getEnv) => betterAuth({
    trustedOrigins: [getEnv("UI_URL") ?? ''],
    database: prismaAdapter(prisma, { provider: 'postgresql' }),
    session: {
        additionalFields: { lang: { type: 'string', defaultValue: 'es' } },
    },
    emailAndPassword: { enabled: true },
    socialProviders: {
        google: {
            clientId: getEnv("AUTH_GOOGLE_ID") ?? '',
            clientSecret: getEnv("AUTH_GOOGLE_SECRET") ?? '',
            redirectURI: `${getEnv("UI_URL") ?? ''}/api/auth/callback/google`,
        },
        github: {
            clientId: getEnv("AUTH_GITHUB_ID") ?? '',
            clientSecret: getEnv("AUTH_GITHUB_SECRET") ?? '',
            redirectURI: `${getEnv("UI_URL") ?? ''}/api/auth/callback/github`,
        },
    },
    plugins: [
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
