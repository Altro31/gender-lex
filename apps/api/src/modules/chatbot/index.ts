import type { HonoVariables } from "@/lib/types/hono-variables"
import { ChatbotService } from "@/modules/chatbot/service"
import { requireAuth } from "@/plugins/auth.plugin"
import { AuthService } from "@/shared/auth/auth.service"
import { Effect } from "effect"
import { Hono } from "hono"

const chatbot = new Hono<HonoVariables>()

    .use("*", requireAuth)

    .post("/message", async c => {
        const runEffect = c.get("runEffect") as any
        const body = await c.req.json()
        const program = Effect.gen(function* () {
            const chatbotService = yield* ChatbotService
            return yield* chatbotService.sendMessage(body.content)
        }).pipe(ChatbotService.provide)
        const result = await runEffect(program)
        return c.json(result)
    })

    .get("/messages", async c => {
        const runEffect = c.get("runEffect") as any
        const program = Effect.gen(function* () {
            const chatbotService = yield* ChatbotService
            return yield* chatbotService.getMessages()
        }).pipe(ChatbotService.provide, AuthService.provide)
        const result = await runEffect(program)
        return c.json(result)
    })

export default chatbot
export type ChatbotAppType = typeof chatbot
