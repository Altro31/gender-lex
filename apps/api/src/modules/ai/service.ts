import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import type { ChatMessage, Model } from '@repo/db/models'
import { type ModelMessage } from 'ai'
import { Effect } from 'effect'

export class AiService extends Effect.Service<AiService>()('AiService', {
	effect: Effect.gen(function* () {
		return {
			buildLanguageModel: (model: Model) =>
				Effect.gen(function* () {
					const provider = createOpenAICompatible({
						baseURL: model.connection.url,
						name: '',
						apiKey: model.apiKey ?? undefined,
					})
					return {
						languageModel: provider(model.connection.identifier),
						options: model.settings,
					}
				}),

			chatbot: (history: Pick<ChatMessage, 'content' | 'sender'>[]) =>
				Effect.gen(function* () {
					

					return {}
				}),
		}
	}),
}) {
	static provide = Effect.provide(this.Default)
}
