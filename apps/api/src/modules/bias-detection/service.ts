import type { RawAnalysis } from '@repo/db/models'
import { AiService } from '@/modules/ai/service'
import { genderLexSystemPrompt } from '@/modules/bias-detection/prompts/system.prompt'
import { AuthService } from '@/shared/auth/auth.service'
import type { Analysis, Model } from '@repo/db/models'
import { Analysis as AnalysisSchema } from '@repo/db/schema/analysis.js'

import { generateText, Output, stepCountIs } from 'ai'
import { Effect } from 'effect'

type AnaliceInput = Analysis & { Preset: { Models: { Model: Model }[] } }

export class BiasDetectionService extends Effect.Service<BiasDetectionService>()(
	'BiasDetectionService',
	{
		effect: Effect.gen(function* () {
			const aiService = yield* AiService
			const { session } = yield* AuthService
			return {
				analice: (analysis: AnaliceInput) =>
					Effect.gen(function* () {
						const model = yield* aiService.buildLanguageModel(
							analysis!.Preset!.Models![0]!.Model,
						)
						const { experimental_output } = yield* Effect.promise(
							() =>
								generateText({
									model: model.languageModel,
									prompt: `lang=${session?.lang} <analice>${analysis.originalText}</analice>`,
									system: genderLexSystemPrompt,
									stopWhen: stepCountIs(3),
									experimental_output: Output.object({
										schema: AnalysisSchema as any,
									}),
									temperature: model.options.temperature,
								}),
						)
						return experimental_output as RawAnalysis
					}),
			}
		}),
		dependencies: [AiService.Default, AuthService.Default],
	},
) {
	static provide = Effect.provide(this.Default)
}
