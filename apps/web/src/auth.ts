import envs from "@/env"
import { google } from "@/services/auth"
import NextAuth, { type DefaultSession } from "next-auth"
import Google from "next-auth/providers/google"

declare module "next-auth" {
	interface Session {
		jwt: string
		user: {
			name: string
			email: string
			avatar: string
		} & DefaultSession["user"]
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Google({
			clientId: envs.AUTH_GOOGLE_ID,
			clientSecret: envs.AUTH_GOOGLE_SECRET,
		}),
	],
	callbacks: {
		async jwt({ token, account }) {
			let newToken = token
			if (account?.provider === "google" && account.access_token) {
				const data = await google(account.access_token)
				newToken = {
					...newToken,
					...data,
				}
			}
			return newToken
		},
		session({ session, token }) {
			return {
				...session,
				jwt: token.jwt,
				user: {
					...session.user,
					// @ts-expect-error token has user
					...token.user,
				},
			}
		},
	},
})
