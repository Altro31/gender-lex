import analysis from "@/modules/analysis"
import chatbot from "@/modules/chatbot"
import model from "@/modules/model"
import sse from "@/modules/sse"
import zen from "@/modules/zen"
import { cors } from "@elysiajs/cors"
import openapi, { fromTypes } from "@elysiajs/openapi"
import { auth } from "@repo/auth/api"
import { JSONSchema } from "effect"
import { Elysia } from "elysia"
import z from "zod"
import { authPlugin } from "./plugins/auth.plugin"
import { effectPlugin } from "./plugins/effect.plugin"
import { handleUserSignup } from "./workflows/send-email"
import { start } from "workflow/api"

export type App = typeof app
const app = new Elysia()
    .use(cors())
    .mount(auth.handler)
    .use(
        openapi({
            references: fromTypes(),
            documentation: {
                info: { title: "Gender Lex API", version: "1.0.0" },
                externalDocs: {
                    url: "/api/auth/reference",
                    description: "Auth",
                },
            },
            mapJsonSchema: {
                effect: JSONSchema.make,
                zod: (arg: any) =>
                    z.toJSONSchema(arg, { unrepresentable: "any" }),
            },
        }),
    )
    .use(authPlugin)
    .use(effectPlugin)
    .use(sse)
    .use(model)
    .use(analysis)
    .use(chatbot)
    .use(zen)
    .get("/", () => ({ ok: true }))
    .get("/workflow", async c => {
        await start(handleUserSignup, ["albe@gmail.com"])
        return { message: "User signup workflow started" }
    })

export default app.compile()
