import base from "@/lib/base"
import analysis from "@/modules/analysis"
import model from "@/modules/model"
import preset from "@/modules/preset"
import sse from "@/modules/sse"
import user from "@/modules/user"
import zen from "@/modules/zen"
import cors from "@elysiajs/cors"
import openapi, { fromTypes } from "@elysiajs/openapi"
import { Elysia, env } from "elysia"
import z from "zod"

export type App = typeof app
const app = new Elysia()
    .use(
        openapi({
            references: fromTypes(),
            mapJsonSchema: { zod: z.toJSONSchema },
        }),
    )
    .use(cors())
    .use(base)
    .use(sse)
    .use(user)
    .use(analysis)
    .use(model)
    .use(preset)
    .use(zen)
    .get("/", ({ userService }) => {
        return { ok: true }
    })
    .listen(Number(env.PORT))

console.log(`	🚀Server running at ${app.server?.url}`)
console.log(`	📖Docs running at ${app.server?.url}openapi`)
