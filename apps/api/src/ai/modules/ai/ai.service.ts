import { google } from '@ai-sdk/google'
import { groq } from '@ai-sdk/groq'
import { Injectable } from '@nestjs/common'
import Schemas from '@repo/db/zod'
import { customProvider, generateText, Output, stepCountIs } from 'ai'
import { RawAnalysis } from 'src/ai/lib/types'
import { genderLexSystemPrompt } from 'src/ai/modules/ai/prompts/system.prompt'

export type Model = Parameters<(typeof provider)['languageModel']>[0]
export const models = [
	'deepseek',
	'gemini',
	'llama3_1',
	'llama3_3',
	'qwen',
] as const satisfies Model[]

const provider = customProvider({
	languageModels: {
		deepseek: groq('deepseek-r1-distill-llama-70b'),
		gemini: google('gemini-2.0-flash-exp'),
		llama3_1: groq('llama-3.1-8b-instant'),
		llama3_3: groq('llama-3.3-70b-versatile'),
		qwen: groq('qwen-2.5-32b'),
	},
	textEmbeddingModels: {
		embedding: google.textEmbeddingModel('text-embedding-004'),
	},
})

// @ts-nocheck
const schema = Schemas.AnalysisSchema?.pick({
	originalText: true,
	modifiedTextAlternatives: true,
	biasedTerms: true,
	biasedMetaphors: true,
	additionalContextEvaluation: true,
	impactAnalysis: true,
	conclusion: true,
}) as any

@Injectable()
export class AiService {
	async analice(content: string) {
		const { experimental_output } = await generateText({
			model: provider.languageModel('deepseek'),
			prompt: content,
			system: genderLexSystemPrompt,
			stopWhen: stepCountIs(3),
			experimental_output: Output.object({ schema }),
		})

		return experimental_output as RawAnalysis
	}
}
