import prisma from "@/lib/prisma"
import type { PrismaClient } from "@repo/db"
import Elysia from "elysia"

export class UserService {
    private readonly model: PrismaClient["user"]
    constructor(prisma: PrismaClient) {
        this.model = prisma.user
    }
}

export const userService = new Elysia({ name: "user.service" })
    .use(prisma)
    .derive({ as: "global" }, ({ prisma }) => {
        return { userService: {} }
    })
