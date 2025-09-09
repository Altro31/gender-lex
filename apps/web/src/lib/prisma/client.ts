import { getSession } from "@/lib/auth/auth-server"
import { auth } from "@repo/auth/next"
import { enhance } from "@repo/db"
import { extension, PrismaClient } from "@repo/db/client"

const prisma = (<any>global).prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") {
	;(<any>global).prisma = prisma
}

export async function getPrisma() {
	const session = await getSession()
	return enhance(prisma, { user: session?.user }).$extends(extension)
}
