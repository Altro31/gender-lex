import { AuthDBService } from '@/shared/db/auth-db.service'
import { Effect } from 'effect'

export class ChatbotRepository extends Effect.Service<ChatbotRepository>()(
	'ChatbotRepository',
	{
		effect: Effect.gen(function* () {
			const db = yield* AuthDBService
			return {
				chatConversation: db.chatConversation,
				chatMessage: db.chatMessage,
			}
		}),
		dependencies: [AuthDBService.Default],
	},
) {
	static provide = Effect.provide(this.Default)
}
