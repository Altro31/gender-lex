import auth from "@/lib/auth"
import { aiService } from "@/modules/ai/service"
import { genderLexSystemPrompt } from "@/modules/bias-detection/prompts/system.prompt"
import type { Analysis, Model } from "@repo/db/models"
import {
    AnalysisSchema,
    BiasedMetaphorSchema,
    BiasedTermSchema,
    ModifiedAlternativeSchema,
} from "@repo/db/zod"
import { generateText, Output, stepCountIs } from "ai"
import Elysia from "elysia"

type RawAnalysis = Pick<
    Analysis,
    | "name"
    | "originalText"
    | "modifiedTextAlternatives"
    | "biasedTerms"
    | "biasedMetaphors"
    | "additionalContextEvaluation"
    | "impactAnalysis"
    | "conclusion"
>

// @ts-nocheck
const schema = AnalysisSchema?.pick({
    name: true,
    originalText: true,
    impactAnalysis: true,
    conclusion: true,
    additionalContextEvaluation: true,
}).extend({
    modifiedTextAlternatives: ModifiedAlternativeSchema.array().default([]),
    biasedTerms: BiasedTermSchema.array().default([]),
    biasedMetaphors: BiasedMetaphorSchema.array().default([]),
}) as any

export const biasDetectionService = new Elysia({
    name: "bias-detection.service",
})
    .use(auth)
    .use(aiService)
    .derive({ as: "global" }, ({ session, aiService }) => ({
        biasDetectionService: {
            async analice(
                analysis: Analysis & { Preset: { Models: { Model: Model }[] } },
            ) {
                const model = aiService!.buildLanguageModel(
                    analysis!.Preset!.Models![0]!.Model,
                )
                const { experimental_output } = await generateText({
                    model: model.languageModel,
                    prompt: `lang=${session?.lang} <analice>${analysis.originalText}</analice>`,
                    system: genderLexSystemPrompt,
                    stopWhen: stepCountIs(3),
                    experimental_output: Output.object({ schema }),
                    temperature: model.options.temperature,
                })
                return experimental_output as RawAnalysis
            },
        },
    }))
