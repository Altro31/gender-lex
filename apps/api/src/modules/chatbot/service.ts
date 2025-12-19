import { Effect } from 'effect'
import { ChatbotRepository } from './repository'

export class ChatbotService extends Effect.Service<ChatbotService>()(
	'ChatbotService',
	{
		effect: Effect.gen(function* () {
			const repo = yield* ChatbotRepository

			return {
				// Get or create a conversation for a user
				getOrCreateConversation: (userId: string) =>
					Effect.gen(function* () {
						const existing = yield* Effect.tryPromise(() =>
							repo.chatConversation.findFirst({
								where: { userId },
								orderBy: { updatedAt: 'desc' },
							}),
						)

						if (existing) {
							return existing
						}

						return yield* Effect.tryPromise(() =>
							repo.chatConversation.create({
								data: { userId },
							}),
						)
					}),

				// Send a message and get bot response
				sendMessage: (userId: string, content: string) =>
					Effect.gen(function* () {
						// Get or create conversation
						const conversation =
							yield* Effect.tryPromise(() =>
								repo.chatConversation.findFirst({
									where: { userId },
									orderBy: { updatedAt: 'desc' },
								}),
							).pipe(
								Effect.flatMap(conv => {
									if (conv) return Effect.succeed(conv)
									return Effect.tryPromise(() =>
										repo.chatConversation.create({
											data: { userId },
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

						// Generate bot response
						const botResponse = generateBotResponse(content)

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

						return {
							userMessage,
							botMessage,
						}
					}),

				// Get conversation history
				getMessages: (userId: string) =>
					Effect.gen(function* () {
						const conversation =
							yield* Effect.tryPromise(() =>
								repo.chatConversation.findFirst({
									where: { userId },
									orderBy: { updatedAt: 'desc' },
								}),
							)

						if (!conversation) {
							return []
						}

						return yield* Effect.tryPromise(() =>
							repo.chatMessage.findMany({
								where: { conversationId: conversation.id },
								orderBy: { createdAt: 'asc' },
							}),
						)
					}),
			}
		}),
		dependencies: [ChatbotRepository.Default],
	},
) {
	static provide = Effect.provide(this.Default)
}

// Simple bot response logic
function generateBotResponse(userMessage: string): string {
	const lowerMessage = userMessage.toLowerCase()

	const botResponses = [
		{
			keywords: ['hola', 'hello', 'hi', 'buenos días', 'buenas tardes'],
			response: '¡Hola! ¿Cómo estás? ¿En qué puedo ayudarte?',
		},
		{
			keywords: ['modelo', 'modelos', 'llm'],
			response:
				'Puedo ayudarte con la gestión de modelos LLM. Puedes crear, editar y configurar diferentes modelos desde la sección de Modelos.',
		},
		{
			keywords: ['preset', 'presets', 'configuración'],
			response:
				'Los presets te permiten combinar múltiples modelos con configuraciones específicas. Visita la sección de Presets para crear nuevas combinaciones.',
		},
		{
			keywords: ['análisis', 'sesgo', 'sesgos', 'género'],
			response:
				'Puedo ayudarte con los análisis de sesgos de género. En la sección de Análisis puedes ver todos los análisis realizados y sus resultados.',
		},
		{
			keywords: ['ayuda', 'help', 'soporte'],
			response:
				'Estoy aquí para ayudarte. Puedes preguntarme sobre modelos, presets, análisis o cualquier funcionalidad de la plataforma.',
		},
		{
			keywords: ['gracias', 'thanks', 'thank you'],
			response: '¡De nada! Si necesitas algo más, no dudes en preguntarme.',
		},
		{
			keywords: ['adiós', 'bye', 'hasta luego', 'chao'],
			response:
				'¡Hasta luego! Que tengas un buen día. Estaré aquí cuando me necesites.',
		},
	]

	for (const response of botResponses) {
		if (response.keywords.some(keyword => lowerMessage.includes(keyword))) {
			return response.response
		}
	}

	return 'Entiendo tu consulta. Para obtener ayuda más específica, puedes navegar por las diferentes secciones de la aplicación o contactar con nuestro equipo de soporte.'
}
