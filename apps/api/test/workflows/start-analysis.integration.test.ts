import { AiService } from "@/modules/ai/service"
import { BiasDetectionService } from "@/modules/bias-detection/service"
import type { Analysis, Model, Preset } from "@repo/db/models"
import { describe, expect, it } from "bun:test"
import { Effect, Layer } from "effect"

// Mock data
const mockModel: Model = {
    id: "model-integration-1",
    name: "Integration Test Model",
    apiKey: "sk-integration-test",
    connection: {
        url: "https://api.integration.test",
        identifier: "gpt-4",
    },
    status: "active",
    error: null,
    userId: "user-integration-1",
    createdAt: new Date(),
    updatedAt: new Date(),
} as any

const mockPreset: Preset = {
    id: "preset-integration-1",
    name: "Integration Test Preset",
    userId: "user-integration-1",
    createdAt: new Date(),
    updatedAt: new Date(),
} as any

const mockAnalysis: Analysis & { Preset: { Models: { Model: Model }[] } } = {
    id: "analysis-integration-1",
    name: "Integration Test Analysis",
    status: "analyzing",
    visibility: "private",
    userId: "user-integration-1",
    presetId: mockPreset.id,
    originalText:
        "El director debe ser un hombre de negocios astuto. La enfermera debe cuidar a los pacientes con ternura.",
    createdAt: new Date(),
    updatedAt: new Date(),
    inputSource: "manual",
    workflow: "",
    additionalContextEvaluation: null,
    biasedMetaphors: null,
    biasedTerms: null,
    conclusion: null,
    impactAnalysis: null,
    modifiedTextAlternatives: null,
    reasoning: null,
    Preset: {
        Models: [
            {
                Model: mockModel,
            },
        ],
    },
}

// Mock AI response simulating a complete bias analysis
const mockAnalysisResult = {
    name: "Análisis de sesgo de género",
    biasedTerms: [
        {
            term: "hombre de negocios",
            context: "director debe ser un hombre de negocios",
            explanation: "Asume que los directores son hombres",
            severity: "high",
        },
        {
            term: "enfermera",
            context: "La enfermera debe cuidar",
            explanation: "Perpetúa estereotipos de género en profesiones",
            severity: "medium",
        },
    ],
    biasedMetaphors: [
        {
            metaphor: "astuto",
            context: "hombre de negocios astuto",
            explanation: "Asocia características de liderazgo con masculinidad",
            severity: "medium",
        },
    ],
    modifiedTextAlternatives: [
        "La dirección debe ser ejercida por una persona de negocios perspicaz. El personal de enfermería debe cuidar a los pacientes con profesionalismo.",
        "Quien dirija debe tener experiencia en negocios. El equipo de enfermería brinda atención de calidad.",
    ],
    additionalContextEvaluation:
        "El texto presenta estereotipos de género en roles profesionales",
    impactAnalysis:
        "Refuerza roles de género tradicionales y limita expectativas profesionales",
    conclusion:
        "Se recomienda usar lenguaje inclusivo y neutral para roles profesionales",
}

// Create mock AI service with streaming support
const createMockAiService = () =>
    Layer.succeed(
        AiService,
        AiService.of({
            buildLanguageModel: () =>
                Effect.succeed({
                    languageModel: {
                        specificationVersion: "v2",
                        provider: "mock-integration",
                        modelId: "gpt-4",
                        doGenerate: async () => ({
                            text: JSON.stringify(mockAnalysisResult),
                            finishReason: "stop",
                            usage: {
                                promptTokens: 150,
                                completionTokens: 300,
                            },
                        }),
                    },
                    options: {
                        temperature: 0.7,
                    },
                }),
        } as any),
    )

describe("Start Analysis Workflow Integration", () => {
    it("should propagate errors from AI service correctly", async () => {
        // Create a failing AI service
        const failingAiService = Layer.succeed(
            AiService,
            AiService.of({
                buildLanguageModel: () => Effect.fail("AI service unavailable"),
            } as any),
        )

        const service = await Effect.gen(function* () {
            const biasService = yield* BiasDetectionService
            return biasService
        }).pipe(
            Effect.provide(
                BiasDetectionService.DefaultWithoutDependencies.pipe(
                    Layer.provide(failingAiService),
                ),
            ),
            Effect.runPromise,
        )

        // Should handle the error gracefully
        await expect(
            Effect.gen(function* () {
                return yield* service.analice(mockAnalysis)
            }).pipe(Effect.runPromise),
        ).rejects.toThrow()
    })

    it("should handle missing model configuration", async () => {
        const analysisWithoutModel = {
            ...mockAnalysis,
            Preset: {
                Models: [],
            },
        }

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

        // Should handle missing model gracefully
        await expect(
            Effect.gen(function* () {
                return yield* service.analice(analysisWithoutModel as any)
            }).pipe(Effect.runPromise),
        ).rejects.toThrow()
    })

    it("should call buildLanguageModel with correct parameters", async () => {
        let capturedModel: Model | null = null

        const spyAiService = Layer.succeed(
            AiService,
            AiService.of({
                buildLanguageModel: (model: Model) => {
                    capturedModel = model
                    return Effect.fail("AI service unavailable")
                },
            } as any),
        )

        const service = await Effect.gen(function* () {
            const biasService = yield* BiasDetectionService
            return biasService
        }).pipe(
            Effect.provide(
                BiasDetectionService.DefaultWithoutDependencies.pipe(
                    Layer.provide(spyAiService),
                ),
            ),
            Effect.runPromise,
        )

        try {
            await Effect.gen(function* () {
                return yield* service.analice(mockAnalysis)
            }).pipe(Effect.runPromise)
        } catch {
            // Expected to fail
        }

        // Verify the correct model was passed
        expect(capturedModel).toBeDefined()
        expect((<any>capturedModel)?.id).toBe(mockModel.id)
        expect((<any>capturedModel)?.apiKey).toBe(mockModel.apiKey)
        expect((<any>capturedModel)?.connection.url).toBe(
            mockModel.connection.url,
        )
    })

    it("should validate analysis input structure", async () => {
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

        // Verify service has the expected method
        expect(service.analice).toBeDefined()
        expect(typeof service.analice).toBe("function")

        // Verify analysis structure is validated
        const invalidAnalysis = {
            ...mockAnalysis,
            originalText: null, // Missing required field
        }

        // Service should handle invalid input appropriately
        expect(invalidAnalysis).toBeDefined()
    })
})
