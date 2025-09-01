import { $Enums } from '@repo/db/models'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createAzure } from '@ai-sdk/azure'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'

export const providerMap = {
	[$Enums.Provider.openai]: {
		create: createOpenAICompatible,
		getHeaders: apiKey => ({ Authorization: `Bearer ${apiKey}` }),
	},
	[$Enums.Provider.anthropic]: {
		create: createAnthropic,
		getHeaders: apiKey => ({ 'x-api-key': apiKey }),
	},
	[$Enums.Provider.google]: {
		create: createGoogleGenerativeAI,
		getHeaders: apiKey => ({ 'x-goog-api-key': apiKey }),
	},
	[$Enums.Provider.azure_openai]: {
		create: createAzure,
		getHeaders: apiKey => ({ 'api-key': apiKey }),
	},
}
