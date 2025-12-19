import Elysia, { t } from 'elysia'

export const chatbotModels = new Elysia().model({
	sendMessageInput: t.Object({
		content: t.String(),
	}),
	sendMessageOutput: t.Object({
		userMessage: t.Object({
			id: t.String(),
			content: t.String(),
			sender: t.String(),
			createdAt: t.Date(),
		}),
		botMessage: t.Object({
			id: t.String(),
			content: t.String(),
			sender: t.String(),
			createdAt: t.Date(),
		}),
	}),
	getMessagesOutput: t.Array(
		t.Object({
			id: t.String(),
			content: t.String(),
			sender: t.String(),
			createdAt: t.Date(),
		}),
	),
})
