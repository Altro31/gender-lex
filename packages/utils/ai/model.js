import { createAnthropic } from '@ai-sdk/anthropic'
import { createAzure } from '@ai-sdk/azure'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'

/**
 * 
 * @satisfies {{[K in import("@repo/db/models").$Enums.Provider]:any}}
 */
export const providerMap = {
	openai: {
		create: createOpenAICompatible,
		getHeaders: apiKey => ({ Authorization: `Bearer ${apiKey}` }),
	},
	anthropic: {
		create: createAnthropic,
		getHeaders: apiKey => ({ 'x-api-key': apiKey }),
	},
	google: {
		create: createGoogleGenerativeAI,
		getHeaders: apiKey => ({ 'x-goog-api-key': apiKey }),
	},
	azure_openai: {
		create: createAzure,
		getHeaders: apiKey => ({ 'api-key': apiKey }),
	},
}
