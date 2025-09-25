import { getSession } from "@/lib/auth/auth-server"
import { enhance } from "@repo/db"
import { extension, PrismaClient } from "@repo/db/client"
// @ts-ignore
import { encrypt, decrypt } from "@repo/auth/encrypt"
import envs from "@/lib/env/env-server"

const prisma = (<any>global).prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") {
	;(<any>global).prisma = prisma
}

export async function getPrisma() {
	const session = await getSession()
	const key = envs.ENCRYPTION_KEY
	console.log("User", session?.user)
	return enhance(
		prisma,
		{ user: session?.user },
		{
			encryption: {
				encrypt: async (_, __, plain) => encrypt(plain, key),
				decrypt: async (_, __, plain) => decrypt(plain, key),
			},
		},
	).$extends(extension)
}
