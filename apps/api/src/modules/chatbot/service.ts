import { Effect } from 'effect'
import { ChatbotRepository } from './repository'
import { AuthService } from '@/shared/auth/auth.service'
import { effectify } from '@repo/db/effect'
import { EnvsService } from '@/shared/envs.service'
import { generateText } from 'ai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'

export class ChatbotService extends Effect.Service<ChatbotService>()(
	'ChatbotService',
	{
		effect: Effect.gen(function* () {
			const repo = yield* ChatbotRepository
			const { session } = yield* AuthService
			const envs = yield* EnvsService

			// Setup Gemini AI model
			const geminiProvider = createOpenAICompatible({
				baseURL: 'https://generativelanguage.googleapis.com/v1beta',
				name: 'gemini',
				apiKey: envs.GEMINI_API_KEY,
			})
			const geminiModel = geminiProvider('gemini-2.0-flash-exp')

			return {
				// Get or create a conversation for a user
				getOrCreateConversation: () =>
					Effect.gen(function* () {
						const existing = yield* Effect.tryPromise(() =>
							repo.chatConversation.findFirst({
								where: { userId: session?.userId },
								orderBy: { updatedAt: 'desc' },
							}),
						)

						if (existing) {
							return existing
						}

						return yield* Effect.tryPromise(() =>
							repo.chatConversation.create({
								data: { userId: session!.userId },
							}),
						)
					}),

				// Send a message and get bot response
				sendMessage: (content: string) =>
					Effect.gen(function* () {
						// Get or create conversation
						const conversation = yield* Effect.tryPromise(() =>
							repo.chatConversation.findFirst({
								where: { userId: session?.userId },
								orderBy: { updatedAt: 'desc' },
							}),
						).pipe(
							Effect.flatMap(conv => {
								if (conv) return Effect.succeed(conv)
								return Effect.tryPromise(() =>
									repo.chatConversation.create({
										data: { userId: session!.userId },
									}),
								)
							}),
						)

						// Save user message
						const userMessage = yield* Effect.tryPromise(() =>
							repo.chatMessage.create({
								data: {
									conversationId: conversation.id,
									content,
									sender: 'user',
								},
							}),
						)

						// Get conversation history for context
						const messages = yield* effectify(
							repo.chatMessage.findMany({
								where: {
									conversationId: conversation.id,
								},
								orderBy: { createdAt: 'asc' },
								take: 10, // Last 10 messages for context
							}),
						)

						// Build message history for AI
						const conversationHistory = messages
							.slice(-10) // Last 10 messages
							.map(msg => ({
								role: msg.sender === 'user' ? 'user' : 'assistant',
								content: msg.content,
							}))

						// Generate AI response using Gemini
						const { text: botResponse } = yield* Effect.promise(() =>
							generateText({
								model: geminiModel,
								messages: conversationHistory as any,
								system: `Eres un asistente útil para la plataforma Gender-Lex, una herramienta de análisis de sesgos de género en textos. 
								
								Puedes ayudar a los usuarios con:
								- Información sobre modelos LLM y su configuración
								- Gestión de presets para análisis de sesgos
								- Explicación de resultados de análisis
								- Guía sobre cómo usar la plataforma
								- Sugerencias para lenguaje más inclusivo
								
								Responde de manera amigable, concisa y útil. Si no estás seguro de algo, admítelo honestamente.`,
							}),
						)

						// Save bot message
						const botMessage = yield* Effect.tryPromise(() =>
							repo.chatMessage.create({
								data: {
									conversationId: conversation.id,
									content: botResponse,
									sender: 'bot',
								},
							}),
						)

						return { userMessage, botMessage }
					}),

				// Get conversation history
				getMessages: () =>
					Effect.gen(function* () {
						return yield* effectify(
							repo.chatMessage.findMany({
								where: {
									conversation: {
										user: { id: session?.userId },
									},
								},
								orderBy: { createdAt: 'asc' },
							}),
						)
					}),
			}
		}),
		dependencies: [
			ChatbotRepository.Default,
			AuthService.Default,
			EnvsService.Default,
		],
	},
) {
	static provide = Effect.provide(this.Default)
}
