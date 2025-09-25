import auth from "@/lib/auth"
import base from "@/lib/base"
import { decrypt, encrypt } from "@repo/auth/encrypt"
import { enhance, type PrismaClient } from "@repo/db"
import { PrismaClient as PrismaClientClass } from "@repo/db/client"
import Elysia from "elysia"

export const rawPrisma = new PrismaClientClass({ log: ["info"] })

export default new Elysia({ name: "prisma" })
    .use(base)
    .use(auth)
    .derive({ as: "global" }, ({ user, env }) => {
        return {
            prisma: enhance(
                rawPrisma as any,
                { user },
                {
                    logPrismaQuery: true,
                    encryption: {
                        encrypt: async (_, __, plain) =>
                            encrypt(plain, env.ENCRYPTION_KEY),
                        decrypt: async (_, __, plain) =>
                            decrypt(plain, env.ENCRYPTION_KEY),
                    },
                },
            ) as PrismaClient,
        }
    })
