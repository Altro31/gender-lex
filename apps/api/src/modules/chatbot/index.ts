import type { HonoVariables } from "@/lib/types/hono-variables"
import { ChatbotService } from "@/modules/chatbot/service"
import { requireAuth } from "@/plugins/auth.plugin"
import { AuthService } from "@/shared/auth/auth.service"
import { Effect } from "effect"
import { Hono } from "hono"
import { validator } from "hono-openapi"
import z from "zod"

const chatbot = new Hono<HonoVariables>()

    .use("*", requireAuth)

    .post(
        "/message",
        validator(
            "json",
            z.object({
                content: z.string().describe("Message content to send to the chatbot")
            }),
            {
                tags: ["Chatbot"],
                summary: "Send a message to the chatbot",
                description: "Send a message and receive an AI-generated response about gender-inclusive language and platform features",
                responses: {
                    200: {
                        description: "Message sent and response received",
                        content: {
                            "application/json": {
                                schema: z.object({
                                    userMessage: z.object({
                                        id: z.string(),
                                        content: z.string(),
                                        sender: z.string(),
                                        createdAt: z.string()
                                    }),
                                    botMessage: z.object({
                                        id: z.string(),
                                        content: z.string(),
                                        sender: z.string(),
                                        createdAt: z.string()
                                    })
                                })
                            }
                        }
                    }
                }
            }
        ),
        async c => {
        const runEffect = c.get("runEffect") as any
        const body = await c.req.json()
        const program = Effect.gen(function* () {
            const chatbotService = yield* ChatbotService
            return yield* chatbotService.sendMessage(body.content)
        }).pipe(ChatbotService.provide)
        const result = await runEffect(program)
        return c.json(result)
    })

    .get(
        "/messages",
        validator(
            "query",
            z.object({}),
            {
                tags: ["Chatbot"],
                summary: "Get conversation history",
                description: "Retrieve all messages from the user's conversation with the chatbot",
                responses: {
                    200: {
                        description: "Messages retrieved successfully",
                        content: {
                            "application/json": {
                                schema: z.array(z.object({
                                    id: z.string(),
                                    content: z.string(),
                                    sender: z.string(),
                                    createdAt: z.string()
                                }))
                            }
                        }
                    }
                }
            }
        ),
        async c => {
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
