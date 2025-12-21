import { client } from '@/lib/api/client'

interface MessagePart {
	type: string
	content: string
}

interface ChatMessage {
	role: string
	parts: MessagePart[]
}

export async function POST(request: Request) {
	try {
		const { messages }: { messages: ChatMessage[] } = await request.json()
		
		// Get the last user message
		const lastMessage = messages[messages.length - 1]
		if (!lastMessage || lastMessage.role !== 'user') {
			return new Response(
				JSON.stringify({ error: 'Invalid message format' }),
				{ status: 400, headers: { 'Content-Type': 'application/json' } },
			)
		}

		// Extract text content from the message
		const userContent = lastMessage.parts
			.filter((part) => part.type === 'text')
			.map((part) => part.content)
			.join(' ')

		// Call backend API to send message (which persists to database)
		const { data, error } = await client.chatbot.message.post({
			content: userContent,
		})

		if (error || !data) {
			return new Response(
				JSON.stringify({
					error: error || 'Failed to get response from chatbot',
				}),
				{ status: 500, headers: { 'Content-Type': 'application/json' } },
			)
		}

		// Create a streaming response that mimics TanStack AI format
		const encoder = new TextEncoder()
		const stream = new ReadableStream({
			start(controller) {
				// Send the bot response as a stream
				const botMessage = {
					id: data.botMessage.id,
					role: 'assistant',
					parts: [
						{
							type: 'text',
							content: data.botMessage.content,
						},
					],
				}

				// Send the message data
				controller.enqueue(
					encoder.encode(`data: ${JSON.stringify(botMessage)}\n\n`),
				)

				// Close the stream
				controller.close()
			},
		})

		return new Response(stream, {
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				Connection: 'keep-alive',
			},
		})
	} catch (error) {
		return new Response(
			JSON.stringify({
				error:
					error instanceof Error
						? error.message
						: 'An error occurred',
			}),
			{ status: 500, headers: { 'Content-Type': 'application/json' } },
		)
	}
}
