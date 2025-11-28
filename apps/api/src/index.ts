import analysis from "@/modules/analysis"
import model from "@/modules/model"
import sse from "@/modules/sse"
import zen from "@/modules/zen"
import { cors } from "@elysiajs/cors"
import openapi, { fromTypes } from "@elysiajs/openapi"
import { auth } from "@repo/auth/nest"
import { Elysia } from "elysia"
import z from "zod"
import { start } from "workflow/api"
import { handleUserSignup } from "@/workflows/user-signup"

export type App = typeof app
const app = new Elysia()
    .use(cors())
    .mount(auth.handler)
    .use(
        openapi({
            references: fromTypes(),
            mapJsonSchema: {
                zod: (arg: any) =>
                    z.toJSONSchema(arg, { unrepresentable: "any" }),
            },
        }),
    )
    .use(sse)
    .use(model)
    .use(analysis)
    .use(zen)
    .get("/", async () => {
        const run = await start(handleUserSignup, ["albe020531@outlook.com"])
        return { ok: true, id: run.runId }
    })

// console.log(`	🚀Server running at ${app.server?.url}`)
// console.log(`	📖Docs running at ${app.server?.url}openapi`)

export default app.compile()
