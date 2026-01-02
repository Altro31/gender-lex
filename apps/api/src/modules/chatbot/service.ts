import { AuthService } from '@/shared/auth/auth.service'
import { EnvsService } from '@/shared/envs.service'
import { effectify } from '@repo/db/effect'
import { Effect } from 'effect'
import { ChatbotRepository } from './repository'

import { AiService } from '../ai/service'

const CONVERSATION_HISTORY_LIMIT = 10

export class ChatbotService extends Effect.Service<ChatbotService>()(
	'ChatbotService',
	{
		effect: Effect.gen(function* () {
			const aiService = yield* AiService
			const repo = yield* ChatbotRepository
			const session = yield* AuthService

			const services = {
				// Get or create a conversation for a user
				getOrCreateConversation: () =>
					Effect.gen(function* () {
						const existing = yield* effectify(
							repo.chatConversation.findFirst({
								where: { userId: session.userId },
								orderBy: { updatedAt: 'desc' },
							}),
						)

						if (existing) {
							return existing
						}

						return yield* effectify(
							repo.chatConversation.create({
								data: { userId: session.userId },
							}),
						)
					}),

				// Send a message and get bot response
				sendMessage: (content: string) =>
					Effect.gen(services, function* () {
						// Get or create conversation
						const conversation =
							yield* this.getOrCreateConversation()

						yield* effectify(
							repo.chatMessage.create({
								data: {
									conversationId: conversation.id,
									content,
									sender: 'user',
								},
							}),
						).pipe(Effect.forkDaemon)

						// Get conversation history for context (last N messages)
						const allMessages = yield* effectify(
							repo.chatMessage.findMany({
								where: { conversationId: conversation.id },
								orderBy: { createdAt: 'desc' },
								take: CONVERSATION_HISTORY_LIMIT,
							}),
						)

						// Reverse to get chronological order (oldest to newest)
						const messages = allMessages.reverse()

						// Generate AI response using Gemini
						const stream = yield* aiService.chatbot(messages)
						// yield* Effect.tryPromise(() => result.text).pipe(
						// 	Effect.andThen(Console.log),
						// 	Effect.forkDaemon,
						// )

						// Save bot message
						// const botMessage = yield* Effect.tryPromise(() =>
						// 	repo.chatMessage.create({
						// 		data: {
						// 			conversationId: conversation.id,
						// 			content: botResponse,
						// 			sender: 'bot',
						// 		},
						// 	}),
						// )
						return stream
					}),

				// Get conversation history
				getMessages: () =>
					effectify(
						repo.chatMessage.findMany({
							where: {
								conversation: { user: { id: session?.userId } },
							},
							orderBy: { createdAt: 'asc' },
						}),
					),
			}

			return services
		}),
		dependencies: [
			ChatbotRepository.Default,
			AuthService.Default,
			EnvsService.Default,
			AiService.Default,
		],
	},
) {
	static provide = Effect.provide(this.Default)
}
