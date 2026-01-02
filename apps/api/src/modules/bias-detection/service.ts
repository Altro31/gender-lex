import { AiService } from '@/modules/ai/service'
import { genderLexSystemPrompt } from '@/modules/bias-detection/prompts/system.prompt'
import type { Analysis, Model, RawAnalysis } from '@repo/db/models'
import { Analysis as AnalysisSchema } from '@repo/db/schema/analysis.ts'
import { JSONSchema } from 'effect'

import { generateText, jsonSchema, Output, stepCountIs } from 'ai'
import { Effect } from 'effect'

type AnaliceInput = Analysis & { Preset: { Models: { Model: Model }[] } }

export class BiasDetectionService extends Effect.Service<BiasDetectionService>()(
	'BiasDetectionService',
	{
		effect: Effect.gen(function* () {
			const aiService = yield* AiService
			return {
				analice: (analysis: AnaliceInput) =>
					Effect.gen(function* () {
						const model = yield* aiService.buildLanguageModel(
							analysis!.Preset!.Models![0]!.Model,
						)
						const { output } = yield* Effect.promise(() =>
							generateText({
								model: model.languageModel,
								prompt: `<analice>${analysis.originalText}</analice>`,
								system: genderLexSystemPrompt,
								stopWhen: stepCountIs(3),
								output: Output.object({
									schema: jsonSchema(
										JSONSchema.make(AnalysisSchema),
									),
								}),
								temperature: model.options.temperature,
							}),
						)
						return output as RawAnalysis
					}),
			}
		}),
		dependencies: [AiService.Default],
	},
) {
	static provide = Effect.provide(this.Default)
}
