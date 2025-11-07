import base from "@/lib/base"
import analysis from "@/modules/analysis"
import model from "@/modules/model"
import sse from "@/modules/sse"
import zen from "@/modules/zen"
import flow from "@/workflow/core/flow.js"
import step from "@/workflow/core/step.js"
import * as webhook from "@/workflow/core/webhook.js"
import { handleUserSignup } from "@/workflows/user-signup"
import cors from "@elysiajs/cors"
import openapi, { fromTypes } from "@elysiajs/openapi"
import { Elysia, env } from "elysia"
import { start } from "workflow/api"
import z from "zod"

export type App = typeof app
const app = new Elysia()
    .use(
        openapi({
            references: fromTypes(),
            mapJsonSchema: {
                zod: (arg: any) =>
                    z.toJSONSchema(arg, { unrepresentable: "any" }),
            },
        }),
    )
    .use(cors())
    .use(base)
    .use(sse)
    .use(analysis)
    .use(model)
    .use(zen)
    .get("/", () => {
        return { ok: true }
    })
    .get("/workflow", async () => {
        const email = `test-${crypto.randomUUID()}@test.com`

        const run = await start(handleUserSignup, [email])
        await run.returnValue
        return { message: "User signup workflow started", runId: run.runId }
    })
    .post("/.well-known/workflow/v1/flow", ({ request }) => flow.POST(request))
    .post("/.well-known/workflow/v1/step", ({ request }) => step.POST(request))
    .all("/.well-known/workflow/v1/webhook/:token", ({ request }) =>
        webhook.POST(request),
    )
    .listen(Number(env.PORT))

console.log(`	🚀Server running at ${app.server?.url}`)
console.log(`	📖Docs running at ${app.server?.url}openapi`)
