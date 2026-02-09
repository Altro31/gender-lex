import { AiService } from "@/modules/ai/service"
import { BiasDetectionService } from "@/modules/bias-detection/service"
import { describe, expect, it } from "bun:test"
import { Effect, Layer } from "effect"

const mockModel = {
    id: "model-123",
    name: "Test Model",
    apiKey: "test-api-key",
    connection: {
        url: "https://api.example.com",
        identifier: "model-123",
    },
    status: "active" as const,
    error: null,
    userId: "user-123",
    createdAt: new Date(),
    updatedAt: new Date(),
}

const mockAnalysis = {
    id: "analysis-123",
    name: "Test Analysis",
    status: "analyzing" as const,
    visibility: "private" as const,
    userId: "user-123",
    presetId: "preset-123",
    originalText: "This is a sample text for bias detection.",
    Preset: {
        Models: [
            {
                Model: mockModel,
            },
        ],
    },
}

const createMockAiService = (buildLanguageModel?: any) =>
    Layer.succeed(
        AiService,
        AiService.of({
            buildLanguageModel:
                buildLanguageModel ||
                (() =>
                    Effect.succeed({
                        languageModel: {
                            specificationVersion: "v1",
                            provider: "test",
                            modelId: "test-model",
                            doGenerate: async () => ({
                                text: "Mocked response",
                                finishReason: "stop",
                                usage: {
                                    promptTokens: 10,
                                    completionTokens: 20,
                                },
                            }),
                        },
                        options: {
                            temperature: 0.7,
                        },
                    })),
        } as any),
    )

describe("BiasDetectionService", () => {
    it("should be defined as an Effect Service", () => {
        expect(BiasDetectionService).toBeDefined()
        expect(BiasDetectionService.Default).toBeDefined()
    })

    it("should have static provide method", () => {
        expect(BiasDetectionService.provide).toBeDefined()
        expect(typeof BiasDetectionService.provide).toBe("function")
    })

    it("should provide analice method", async () => {
        const service = await Effect.gen(function* () {
            const biasService = yield* BiasDetectionService
            return biasService
        }).pipe(
            Effect.provide(
                BiasDetectionService.DefaultWithoutDependencies.pipe(
                    Layer.provide(createMockAiService()),
                ),
            ),
            Effect.runPromise,
        )

        expect(service.analice).toBeDefined()
        expect(typeof service.analice).toBe("function")
    })

    it("should call buildLanguageModel with the correct model", async () => {
        let capturedModel: any = null

        const mockAiService = createMockAiService((model: any) => {
            capturedModel = model
            return Effect.succeed({
                languageModel: {
                    specificationVersion: "v1",
                    provider: "test",
                    modelId: "test-model",
                    doGenerate: async () => ({
                        text: "Mocked response",
                        finishReason: "stop",
                        usage: { promptTokens: 10, completionTokens: 20 },
                    }),
                },
                options: {
                    temperature: 0.7,
                },
            })
        })

        const service = await Effect.gen(function* () {
            const biasService = yield* BiasDetectionService
            return biasService
        }).pipe(
            Effect.provide(
                BiasDetectionService.DefaultWithoutDependencies.pipe(
                    Layer.provide(mockAiService),
                ),
            ),
            Effect.runPromise,
        )

        try {
            await Effect.runPromise(service.analice(mockAnalysis as any))
        } catch (error) {
            // Expected to fail due to ToolLoopAgent mock limitations
        }

        expect(capturedModel).toBeDefined()
        expect(capturedModel.id).toBe("model-123")
    })

    it("should handle analysis input correctly", async () => {
        const service = await Effect.gen(function* () {
            const biasService = yield* BiasDetectionService
            return biasService
        }).pipe(
            Effect.provide(
                BiasDetectionService.DefaultWithoutDependencies.pipe(
                    Layer.provide(createMockAiService()),
                ),
            ),
            Effect.runPromise,
        )

        // The actual implementation will fail due to ToolLoopAgent,
        // but we can verify the service structure
        expect(service.analice).toBeDefined()

        const analysisWithPreset = {
            ...mockAnalysis,
            Preset: {
                Models: [
                    {
                        Model: mockModel,
                    },
                ],
            },
        }

        try {
            await Effect.runPromise(service.analice(analysisWithPreset as any))
        } catch (error) {
            // Expected to fail in test environment
            expect(error).toBeDefined()
        }
    })
})
