import { effectPlugin } from '@/plugins/effect.plugin'
import { chatbotModels } from '@/modules/chatbot/model'
import { ChatbotService } from '@/modules/chatbot/service'
import { AuthService } from '@/shared/auth/auth.service'
import { Effect } from 'effect'
import Elysia, { t } from 'elysia'

export default new Elysia({
	name: 'chatbot.controller',
	tags: ['Chatbot'],
	prefix: 'chatbot',
})
	.use(effectPlugin)
	.model(chatbotModels)
	.post(
		'message',
		({ body, runEffect }) => {
			const program = Effect.gen(function* () {
				const { session, isAuthenticated } = yield* AuthService
				if (!isAuthenticated || !session) {
					return yield* Effect.fail(
						new Error('Unauthorized'),
					)
				}

				const chatbotService = yield* ChatbotService
				return yield* chatbotService.sendMessage(
					session.user.id,
					body.content,
				)
			}).pipe(ChatbotService.provide, AuthService.provide)
			return runEffect(program)
		},
		{ body: 'sendMessageInput', response: 'sendMessageOutput' },
	)
	.get(
		'messages',
		({ runEffect }) => {
			const program = Effect.gen(function* () {
				const { session, isAuthenticated } = yield* AuthService
				if (!isAuthenticated || !session) {
					return yield* Effect.fail(new Error('Unauthorized'))
				}

				const chatbotService = yield* ChatbotService
				return yield* chatbotService.getMessages(session.user.id)
			}).pipe(ChatbotService.provide, AuthService.provide)
			return runEffect(program)
		},
		{ response: 'getMessagesOutput' },
	)
