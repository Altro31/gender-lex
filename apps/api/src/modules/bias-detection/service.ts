import { AiService } from "@/modules/ai/service"
import { genderLexSystemPrompt } from "@/modules/bias-detection/prompts/system.prompt"
import type { Analysis, Model, RawAnalysis } from "@repo/db/models"
import { Analysis as AnalysisSchema } from "@repo/db/schema/analysis.ts"
import { JSONSchema } from "effect"
import { AiRequestError } from "./errors/ai-request-error"

import { APICallError, generateText, jsonSchema, Output, stepCountIs } from "ai"
import { Effect } from "effect"

type AnaliceInput = Analysis & { Preset: { Models: { Model: Model }[] } }

export class BiasDetectionService extends Effect.Service<BiasDetectionService>()(
    "BiasDetectionService",
    {
        effect: Effect.gen(function* () {
            const aiService = yield* AiService
            return {
                analice: Effect.fn("analice")(function* (
                    analysis: AnaliceInput,
                ) {
                    const model = yield* aiService.buildLanguageModel(
                        analysis!.Preset!.Models![0]!.Model,
                    )
                    const res = yield* Effect.tryPromise({
                        try: () =>
                            generateText({
                                model: model.languageModel,
                                prompt: `<analice>${analysis.originalText}</analice>`,
                                system: genderLexSystemPrompt,
                                stopWhen: stepCountIs(3),
                                output: Output.object<RawAnalysis>({
                                    schema: jsonSchema(
                                        JSONSchema.make(AnalysisSchema),
                                    ),
                                }),
                                temperature: model.options.temperature,
                            }),
                        catch(error: any) {
                            return new AiRequestError({ error })
                        },
                    }).pipe(
                        Effect.catchIf(
                            e => e.error instanceof APICallError,
                            e =>
                                Effect.gen(function* () {
                                    const res = yield* Effect.promise(() =>
                                        generateText({
                                            model: model.languageModel,
                                            prompt: `<analice>${analysis.originalText}</analice>`,
                                            system: genderLexSystemPrompt,
                                            stopWhen: stepCountIs(3),
                                            output: {
                                                ...Output.object<RawAnalysis>({
                                                    schema: jsonSchema(
                                                        JSONSchema.make(
                                                            AnalysisSchema,
                                                        ),
                                                    ),
                                                }),
                                                responseFormat: "schema" as any,
                                            },
                                            temperature:
                                                model.options.temperature,
                                        }),
                                    )
                                    return res
                                }),
                        ),
                    )
                    return res.output
                }),
            }
        }),
        dependencies: [AiService.Default],
    },
) {
    static provide = Effect.provide(this.Default)
}
