import { google } from '@ai-sdk/google'
import { groq } from '@ai-sdk/groq'
import { Injectable } from '@nestjs/common'
import type { Session } from '@repo/db/models'
import { AnalysisSchema } from '@repo/db/zod'
import { customProvider, generateText, Output, stepCountIs } from 'ai'
import { ClsService } from 'nestjs-cls'
import { RawAnalysis } from 'src/app/lib/types'
import { genderLexSystemPrompt } from 'src/app/modules/ai/prompts/system.prompt'

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
const schema = AnalysisSchema?.pick({
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
	constructor(private readonly clsService: ClsService) {}

	async analice(content: string) {
		const session = this.clsService.get<Session>('session')
		const { experimental_output } = await generateText({
			model: provider.languageModel('deepseek'),
			prompt: `lang=${session.lang} <analice>${content}</analice>`,
			system: genderLexSystemPrompt,
			stopWhen: stepCountIs(3),
			experimental_output: Output.object({ schema }),
		})

		return experimental_output as RawAnalysis
	}
}
