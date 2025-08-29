import { createAnthropic } from '@ai-sdk/anthropic'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import type { LanguageModelV2 } from '@ai-sdk/provider'
import { Injectable } from '@nestjs/common'
import { $Enums } from '@repo/db/models'
import { ClsService } from 'nestjs-cls'
import { RawAnalysis } from 'src/app/lib/types'
import type { LanguageModelConnectionOptions } from 'src/app/modules/ai/interfaces/language-model-connection-options.interface'

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

	buildLanguageModel(
		providerName: $Enums.Provider,
		{ identifier, url, apiKey }: LanguageModelConnectionOptions,
	): LanguageModelV2 {
		const provider = providerMap[providerName]({
			baseURL: url,
			name: '',
			apiKey,
		})
		return provider(identifier)
	}
}

const providerMap = {
	[$Enums.Provider.openai]: createOpenAICompatible,
	[$Enums.Provider.anthropic]: createAnthropic,
}

createAnthropic()
