import { chatbotModels } from '@/modules/chatbot/model'
import { ChatbotService } from '@/modules/chatbot/service'
import { authPlugin } from '@/plugins/auth.plugin'
import { effectPlugin } from '@/plugins/effect.plugin'
import { AuthService } from '@/shared/auth/auth.service'
import { Effect } from 'effect'
import Elysia from 'elysia'

export default new Elysia({
	name: 'chatbot.controller',
	tags: ['Chatbot'],
	prefix: 'chatbot',
})
	.use(authPlugin)
	.use(effectPlugin)
	.model(chatbotModels)
	.post(
		'message',
		async function* ({ body, runEffect }) {
			const program = Effect.gen(function* () {
				const chatbotService = yield* ChatbotService
				return yield* chatbotService.sendMessage(body.content)
			}).pipe(ChatbotService.provide)
			for await (const chunk of await runEffect(program)) {
				yield chunk
			}
		},
		{
			body: 'sendMessageInput',
			// response: 'sendMessageOutput'
		},
	)
	.get('messages', ({ runEffect }) => {
		const program = Effect.gen(function* () {
			const chatbotService = yield* ChatbotService
			return yield* chatbotService.getMessages()
		}).pipe(ChatbotService.provide, AuthService.provide)
		return runEffect(program)
	})
