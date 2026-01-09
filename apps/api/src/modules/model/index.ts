import type { HonoVariables } from "@/lib/types/hono-variables"
import { ModelService } from "@/modules/model/service"
import { Effect } from "effect"
import { Hono } from "hono"
import { validator } from "hono-openapi"
import z from "zod"

const model = new Hono<HonoVariables>()
    .post(
        "/",
        validator(
            "json",
            z.object({
                name: z.string().describe("Name of the AI model"),
                provider: z.string().describe("Provider of the model (e.g., OpenAI, Groq)"),
                apiKey: z.string().describe("API key for the model provider"),
                baseURL: z.string().optional().describe("Base URL for the API endpoint"),
                model: z.string().describe("Model identifier (e.g., gpt-4, llama-3)"),
            }),
            {
                tags: ["Models"],
                summary: "Create a new AI model",
                description: "Register a new AI model configuration for use in analysis",
                responses: {
                    200: {
                        description: "Model created successfully",
                        content: {
                            "application/json": {
                                schema: z.object({
                                    ok: z.literal(true)
                                })
                            }
                        }
                    }
                }
            }
        ),
        async c => {
        const runEffect = c.get("runEffect")
        const body = c.req.valid("json")
        const program = Effect.gen(function* () {
            const modelService = yield* ModelService
            yield* modelService.create(body as any)
            return { ok: true } as const
        }).pipe(ModelService.provide)
        const result = await runEffect(program)
        return c.json(result)
    })
    .post(
        "/:id/test-connection",
        validator(
            "param",
            z.object({
                id: z.string().describe("ID of the model to test")
            }),
            {
                tags: ["Models"],
                summary: "Test model connection",
                description: "Verify that the model configuration is valid and the API is accessible",
                responses: {
                    200: {
                        description: "Connection test result",
                        content: {
                            "application/json": {
                                schema: z.boolean().describe("True if connection successful, false otherwise")
                            }
                        }
                    }
                }
            }
        ),
        async c => {
        const runEffect = c.get("runEffect")
        const id = c.req.param("id")
        const program = Effect.gen(function* () {
            const modelService = yield* ModelService
            const res = yield* modelService.testConnection(id)
            return Boolean(res)
        }).pipe(ModelService.provide)
        const result = await runEffect(program)
        return c.json(result)
    })

export default model
export type ModelAppType = typeof model
