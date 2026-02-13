import { describe, it, expect, mock } from "bun:test"
import { Effect } from "effect"
import { AiService } from "@/modules/ai/service"

let capturedCfg: any = null

mock.module("@ai-sdk/openai-compatible", () => ({
    createOpenAICompatible: (cfg: any) => {
        capturedCfg = cfg
        return (identifier: string) => ({
            specificationVersion: "v1",
            provider: "mock",
            modelId: identifier,
            doGenerate: async () => ({
                text: "Mocked",
                finishReason: "stop",
                usage: { promptTokens: 0, completionTokens: 0 },
            }),
        })
    },
}))

describe("AiService", () => {
    it("passes config to createOpenAICompatible and returns expected model/options", async () => {
        const model = {
            id: "model-1",
            name: "test-model",
            apiKey: "sk-test",
            connection: { url: "https://api.test", identifier: "model-1" },
            settings: { temperature: 0.3 },
        } as any

        const service = await Effect.gen(function* () {
            const s = yield* AiService
            return s
        }).pipe(Effect.provide(AiService.Default), Effect.runPromise)

        const result = await Effect.runPromise(
            service.buildLanguageModel(model),
        )

        expect(capturedCfg).toBeDefined()
        expect(capturedCfg.baseURL).toBe(model.connection.url)
        expect(capturedCfg.apiKey).toBe(model.apiKey)
        expect(result.options).toEqual(model.settings)
        expect(result.languageModel.modelId).toBe(model.connection.identifier)
    })
})
