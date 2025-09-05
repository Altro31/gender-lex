import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import type { LanguageModelV2 } from '@ai-sdk/provider'
import { Injectable } from '@nestjs/common'
import { type Model } from '@repo/db/models'
import { ClsService } from 'nestjs-cls'
import { RawAnalysis } from 'src/app/lib/types'

// @ts-nocheck
// const schema = AnalysisSchema?.pick({
// 	name: true,
// 	originalText: true,
// 	modifiedTextAlternatives: true,
// 	biasedTerms: true,
// 	biasedMetaphors: true,
// 	additionalContextEvaluation: true,
// 	impactAnalysis: true,
// 	conclusion: true,
// }) as any

@Injectable()
export class AiService {
	constructor(private readonly clsService: ClsService) {}

	analice(content: string) {
		// const session = this.clsService.get<Session>('session')
		// const { experimental_output } = await generateText({
		// 	model: provider.languageModel('deepseek'),
		// 	prompt: `lang=${session.lang} <analice>${content}</analice>`,
		// 	system: genderLexSystemPrompt,
		// 	stopWhen: stepCountIs(3),
		// 	experimental_output: Output.object({ schema }),
		// })

		// return experimental_output as RawAnalysis
		return {} as RawAnalysis
	}

	buildLanguageModel(model: Model): LanguageModelV2 {
		const provider = createOpenAICompatible({
			baseURL: model.connection.url,
			name: '',
			apiKey: model.apiKey ?? undefined,
		})
		return provider(model.connection.identifier)
	}
}
