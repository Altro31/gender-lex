import { AiService } from "@/modules/ai/service"
import { genderLexSystemPrompt } from "@/modules/bias-detection/prompts/system.prompt"
import type { Analysis, Model } from "@repo/db/models"
import { Analysis as AnalysisSchema } from "@repo/db/schema/analysis.ts"
import { Chunk, JSONSchema, Schema, Stream } from "effect"
import { AiRequestError } from "./errors/ai-request-error"

import { jsonSchema, Output, ToolLoopAgent, type ReasoningOutput } from "ai"
import { Effect } from "effect"

type AnaliceInput = Analysis & { Preset: { Models: { Model: Model }[] } }

export type AnalysisOutput = typeof AnalysisOutput.Type
export const AnalysisOutput = AnalysisSchema.pipe(
    Schema.pick(
        "additionalContextEvaluation",
        "biasedMetaphors",
        "biasedTerms",
        "conclusion",
        "impactAnalysis",
        "modifiedTextAlternatives",
        "name",
    ),
)

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

                    const biasAgent = new ToolLoopAgent({
                        model: model.languageModel,
                        instructions: genderLexSystemPrompt,
                        temperature: model.options.temperature,
                        output: Output.object<typeof AnalysisOutput.Type>({
                            schema: jsonSchema(JSONSchema.make(AnalysisOutput)),
                        }),
                    })

                    const res = yield* Effect.tryPromise({
                        try: () =>
                            biasAgent.stream({
                                prompt: `<analice>${analysis.originalText}</analice>`,
                            }),
                        catch(error: any) {
                            console.error(error)
                            return new AiRequestError({ error })
                        },
                    })
                    const reasoningStream = Stream.toReadableStream(
                        Stream.async<ReasoningOutput[]>(emit => {
                            res.reasoning.then(res =>
                                emit(Effect.succeed(Chunk.of(res))),
                            )
                        }),
                    )
                    return {
                        stream: res.partialOutputStream,
                        reasoningStream,
                    }
                }),
            }
        }),
        dependencies: [AiService.Default],
    },
) {
    static provide = Effect.provide(this.Default)
}
