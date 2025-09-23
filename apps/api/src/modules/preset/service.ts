import prisma from "@/lib/prisma"
import Elysia from "elysia"

export const presetService = new Elysia({ name: "preset.service" })
    .use(prisma)
    .derive({ as: "global" }, () => ({ presetService: {} }))
