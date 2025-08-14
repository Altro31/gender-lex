import { createGroq } from '@ai-sdk/groq'

export function createGroqProvider(apiKey: string) {
	return createGroq({ baseURL: 'https://api.groq.com/openai/v1', apiKey })
}
