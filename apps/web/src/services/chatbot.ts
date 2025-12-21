'use server'

import { client } from '@/lib/api/client'
import { actionClient } from '@/lib/safe-action'
import { z } from 'zod'

export const sendMessage = actionClient
	.inputSchema(z.object({ content: z.string() }))
	.action(async ({ parsedInput: body }) => {
		const { data } = await client.chatbot.message.post(body)
		return { success: true, data }
	})

export async function getMessages() {
	'use cache: private'
	const { data, error } = await client.chatbot.messages.get()
	if (error) return { error: true as const, ...error }
	return { data, error: false as const }
}
