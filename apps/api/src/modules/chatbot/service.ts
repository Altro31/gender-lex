import { Effect } from 'effect'
import { ChatbotRepository } from './repository'
import { AuthService } from '@/shared/auth/auth.service'
import { effectify } from '@repo/db/effect'

export class ChatbotService extends Effect.Service<ChatbotService>()(
	'ChatbotService',
	{
		effect: Effect.gen(function* () {
			const repo = yield* ChatbotRepository
			const { session } = yield* AuthService

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
		dependencies: [ChatbotRepository.Default, AuthService.Default],
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
			response:
				'¡De nada! Si necesitas algo más, no dudes en preguntarme.',
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
