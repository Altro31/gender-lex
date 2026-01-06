import z from 'zod'

export const chatbotModels = {
	sendMessageInput: z.object({ content: z.string() }),
	sendMessageOutput: z.object({
		userMessage: z.object({
			id: z.string(),
			content: z.string(),
			sender: z.string(),
			createdAt: z.date(),
		}),
		botMessage: z.object({
			id: z.string(),
			content: z.string(),
			sender: z.string(),
			createdAt: z.date(),
		}),
	}),
}
