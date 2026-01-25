import type { HonoVariables } from "@/lib/types/hono-variables"
import { AuthDBService } from "@/shared/db/auth-db.service"
import { ApiHandler } from "@repo/db/client"
import { createHonoHandler } from "@zenstackhq/server/hono"
import { Hono } from "hono"

const zen = new Hono<HonoVariables>()

zen.use(
    "/api/model/*",
    createHonoHandler({
        apiHandler: new ApiHandler({ endpoint: "/api/model" }),
        // getSessionUser extracts the current session user from the request,
        // its implementation depends on your auth solution
        getClient: async ctx => {
            const runEffect = ctx.get("runEffect")
            return runEffect(AuthDBService.pipe(AuthDBService.provide)) as any
        },
    }),
)

export default zen
