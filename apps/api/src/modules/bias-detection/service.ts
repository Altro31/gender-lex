import { AiService } from "@/modules/ai/service"
import { ModelRepository } from "@/modules/data/model/repository"
import { genderLexSystemPrompt } from "@/modules/bias-detection/prompts/system.prompt"
import type { Analysis, Model, RawAnalysis } from "@repo/db/models"
import { Analysis as AnalysisSchema } from "@repo/db/schema/analysis.ts"
import { effectify } from "@repo/db/effect"
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
            const modelRepository = yield* ModelRepository
            return {
                analice: Effect.fn("analice")(function* (
                    analysis: AnaliceInput,
                ) {
                    // Load balancing: select the least recently used model
                    const models = analysis!.Preset!.Models!
                    
                    if (models.length === 0) {
                        throw new Error("No models available in preset")
                    }
                    
                    const selectedPresetModel = models.reduce((lru, current) => {
                        // Prioritize models that have never been used (usedAt is null)
                        if (!current.Model.usedAt) return current
                        if (!lru.Model.usedAt) return lru
                        // Otherwise, select the one with the oldest usedAt
                        return current.Model.usedAt < lru.Model.usedAt ? current : lru
                    })
                    
                    const model = yield* aiService.buildLanguageModel(
                        selectedPresetModel.Model,
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
                    
                    // Update the model's usedAt timestamp for load balancing
                    yield* effectify(
                        modelRepository.update({
                            where: { id: selectedPresetModel.Model.id },
                            data: { usedAt: new Date() },
                        }),
                    )
                    
                    res.output.reasoning = res.reasoningText
                    return res.output
                }),
            }
        }),
        dependencies: [AiService.Default, ModelRepository.Default],
    },
) {
    static provide = Effect.provide(this.Default)
}
