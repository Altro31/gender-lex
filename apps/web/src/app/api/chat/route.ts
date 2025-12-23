import { chatbotSystemPrompt } from '@/lib/chatbot/system.prompt'
import { authHelpTools } from '@/lib/chatbot/tools/auth-helps'
import envs from '@/lib/env/env-server'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { convertToModelMessages, streamText, UIMessage } from 'ai'
import z from 'zod'

const google = createGoogleGenerativeAI({ apiKey: envs.GEMINI_API_KEY })
const geminiModel = google('gemini-3-flash-preview')

export async function POST(request: Request) {
	const { messages }: { messages: UIMessage[] } = await request.json()
	const conversationHistory = await convertToModelMessages(messages)
	const result = streamText({
		model: geminiModel,
		messages: conversationHistory,
		system: chatbotSystemPrompt,
		tools: { ...authHelpTools },
		///
	})
	return result.toUIMessageStreamResponse()
}
