import { AiService } from "@/modules/ai/service"
import { genderLexSystemPrompt } from "@/modules/bias-detection/prompts/system.prompt"
import type { Analysis, Model, RawAnalysis } from "@repo/db/models"
import { Analysis as AnalysisSchema } from "@repo/db/schema/analysis.ts"
import { JSONSchema } from "effect"
import { AiRequestError } from "./errors/ai-request-error"

import { jsonSchema, Output, ToolLoopAgent } from "ai"
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

                    const biasAgent = new ToolLoopAgent({
                        model: model.languageModel,
                        instructions: genderLexSystemPrompt,
                        temperature: model.options.temperature,
                        output: Output.object<RawAnalysis>({
                            schema: jsonSchema(JSONSchema.make(AnalysisSchema)),
                        }),
                    })

                    const res = yield* Effect.tryPromise({
                        try: () =>
                            biasAgent.generate({
                                prompt: `<analice>${analysis.originalText}</analice>`,
                            }),
                        catch(error: any) {
                            console.error(error)
                            return new AiRequestError({ error })
                        },
                    })
                    res.output.reasoning = res.reasoningText
                    return res.output
                }),
            }
        }),
        dependencies: [AiService.Default],
    },
) {
    static provide = Effect.provide(this.Default)
}
