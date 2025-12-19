import { client } from "@/lib/api/client"
import { getSession } from "@/lib/auth/auth-server"
import { StreamingTextResponse, StreamData } from "ai"

export const runtime = "edge"

export async function POST(req: Request) {
	try {
		const session = await getSession()
		if (!session) {
			return new Response("Unauthorized", { status: 401 })
		}

		const { messages } = await req.json()
		const lastMessage = messages[messages.length - 1]

		if (!lastMessage || !lastMessage.content) {
			return new Response("No message content", { status: 400 })
		}

		// Send message to our backend chatbot API
		const response = await client.chatbot.message.post({
			content: lastMessage.content,
		})

		if (!response.data) {
			throw new Error("Failed to get response from chatbot")
		}

		// Create a readable stream for the response
		const encoder = new TextEncoder()
		const stream = new ReadableStream({
			start(controller) {
				// Send the bot's message content as a stream
				const text = response.data.botMessage.content
				// Simulate streaming by sending chunks
				const words = text.split(" ")
				let index = 0

				const interval = setInterval(() => {
					if (index < words.length) {
						const chunk = words[index] + " "
						controller.enqueue(encoder.encode(chunk))
						index++
					} else {
						clearInterval(interval)
						controller.close()
					}
				}, 50) // 50ms delay between words for smooth streaming effect
			},
		})

		return new StreamingTextResponse(stream)
	} catch (error) {
		console.error("Chat API error:", error)
		return new Response("Internal Server Error", { status: 500 })
	}
}
