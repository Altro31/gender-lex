import { effectPlugin } from '@/plugins/effect.plugin'
import { chatbotModels } from '@/modules/chatbot/model'
import { ChatbotService } from '@/modules/chatbot/service'
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
		({ body, runEffect, user }) => {
			if (!user?.id) {
				return new Response('Unauthorized', { status: 401 })
			}

			const program = Effect.gen(function* () {
				const chatbotService = yield* ChatbotService
				return yield* chatbotService.sendMessage(
					user.id,
					body.content,
				)
			}).pipe(ChatbotService.provide)
			return runEffect(program)
		},
		{ body: 'sendMessageInput', response: 'sendMessageOutput' },
	)
	.get('messages', ({ runEffect, user }) => {
		if (!user?.id) {
			return new Response('Unauthorized', { status: 401 })
		}

		const program = Effect.gen(function* () {
			const chatbotService = yield* ChatbotService
			return yield* chatbotService.getMessages(user.id)
		}).pipe(ChatbotService.provide)
		return runEffect(program)
	})
