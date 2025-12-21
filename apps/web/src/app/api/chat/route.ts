import { chat, toServerSentEventsStream, toStreamResponse } from '@tanstack/ai'
import { geminiText } from '@tanstack/ai-gemini'

export async function POST(request: Request) {
	// Check for API key
	if (!process.env.GEMINI_API_KEY) {
		return new Response(
			JSON.stringify({ error: 'GEMINI_API_KEY not configured' }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } },
		)
	}

	const { messages, conversationId } = await request.json()
	try {
		// Create a streaming chat response
		const stream = chat({
			adapter: geminiText('gemini-2.5-flash'),
			messages,
			conversationId,
		})
		const readableStream = toServerSentEventsStream(stream)
		// Convert stream to HTTP response
		return new Response(readableStream, {
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
