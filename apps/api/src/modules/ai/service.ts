import { EnvsService } from '@/shared/envs.service'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import type { ChatMessage, Model } from '@repo/db/models'
import { streamText, type ModelMessage } from 'ai'
import { Effect } from 'effect'
import { chatbotSystemPrompt } from '../chatbot/prompts/system.prompt'

export class AiService extends Effect.Service<AiService>()('AiService', {
	effect: Effect.gen(function* () {
		const envs = yield* EnvsService

		const google = createGoogleGenerativeAI({ apiKey: envs.GEMINI_API_KEY })
		const geminiModel = google('gemini-3-flash-preview')

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
					const conversationHistory: ModelMessage[] = history.map(
						msg => ({
							role: msg.sender === 'user' ? 'user' : 'assistant',
							content: msg.content,
						}),
					)

					const result = streamText({
						model: geminiModel,
						messages: conversationHistory,
						system: chatbotSystemPrompt,
					})

					return result.toUIMessageStream()
				}),
		}
	}),
	dependencies: [EnvsService.Default],
}) {
	static provide = Effect.provide(this.Default)
}
