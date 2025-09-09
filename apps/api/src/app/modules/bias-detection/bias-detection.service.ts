import { Injectable } from '@nestjs/common'
import { AiService } from 'src/app/modules/ai/ai.service'
import { SessionService } from 'src/security/modules/auth/session.service'
import type { Analysis, Model } from '@repo/db/models'
import { genderLexSystemPrompt } from 'src/app/modules/ai/prompts/system.prompt'
import { generateText, Output, stepCountIs } from 'ai'
import { AnalysisSchema } from '@repo/db/zod'
import type { RawAnalysis } from 'src/app/lib/types'
import type { TerminologyService } from 'src/app/modules/terminology/terminology.service'

// @ts-nocheck
const schema = AnalysisSchema?.pick({
	name: true,
	originalText: true,
	modifiedTextAlternatives: true,
	biasedTerms: true,
	biasedMetaphors: true,
	additionalContextEvaluation: true,
	impactAnalysis: true,
	conclusion: true,
}) as any

@Injectable()
export class BiasDetectionService {
	constructor(
		private readonly aiService: AiService,
		private readonly sessionService: SessionService,
		private readonly terminologyService: TerminologyService,
	) {}

	async analice(
		analysis: Analysis & { Preset: { Models: { Model: Model }[] } },
	) {
		const session = this.sessionService.getSession()
		const languageModel = this.aiService.buildLanguageModel(
			analysis.Preset.Models[0].Model,
		)
		const { experimental_output } = await generateText({
			model: languageModel,
			prompt: `lang=${session.lang} <analice>${analysis.originalText}</analice>`,
			system: genderLexSystemPrompt,
			stopWhen: stepCountIs(3),
			experimental_output: Output.object({ schema }),
		})

		return experimental_output as RawAnalysis
	}
}
