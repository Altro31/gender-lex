import type { LanguageModelV2 } from "@ai-sdk/provider"
import env from "@/lib/env"
import type { Model } from "@repo/db/models"
import Elysia from "elysia"
import { createOpenAICompatible } from "@ai-sdk/openai-compatible"

export const aiService = new Elysia({ name: "ai.service" })
    .use(env)
    .derive({ as: "global" }, () => ({
        aiService: {
            buildLanguageModel(model: Model): LanguageModelV2 {
                const provider = createOpenAICompatible({
                    baseURL: model.connection.url,
                    name: "",
                    apiKey: model.apiKey ?? undefined,
                })
                return provider(model.connection.identifier)
            },
        },
    }))
