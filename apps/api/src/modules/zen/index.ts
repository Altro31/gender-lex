import { rawPrisma } from "@/lib/prisma"
import { decrypt, encrypt } from "@repo/auth/encrypt"
import { enhance } from "@repo/db"
import { createElysiaHandler } from "@zenstackhq/server/elysia"
import Elysia from "elysia"

export default new Elysia({
    prefix: "api/crud",
    name: "zen.controller",
    tags: ["Zenstack"],
    detail: { hide: true },
}).use(
    createElysiaHandler({
        getPrisma: async (context: any) => {
            return enhance(
                rawPrisma,
                { user: context.user },
                {
                    encryption: {
                        encrypt: async (_, __, plain) =>
                            encrypt(plain, context.env.ENCRYPTION_KEY),
                        decrypt: async (_, __, plain) =>
                            decrypt(plain, context.env.ENCRYPTION_KEY),
                    },
                },
            )
        },
        basePath: "/api/crud",
    }),
)
