import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import type { LanguageModelV2 } from '@ai-sdk/provider'
import { Injectable } from '@nestjs/common'
import { type Model } from '@repo/db/models'

@Injectable()
export class AiService {
	buildLanguageModel(model: Model): LanguageModelV2 {
		const provider = createOpenAICompatible({
			baseURL: model.connection.url,
			name: '',
			apiKey: model.apiKey ?? undefined,
		})
		return provider(model.connection.identifier)
	}
}
