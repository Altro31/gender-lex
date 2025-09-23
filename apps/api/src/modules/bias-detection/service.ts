import auth from "@/lib/auth"
import { genderLexSystemPrompt } from "@/modules/bias-detection/prompts/system.prompt"
import { aiService } from "@/modules/ai/service"
import type { Analysis, Model } from "@repo/db/models"
import { AnalysisSchema } from "@repo/db/zod"
import { generateText, Output, stepCountIs } from "ai"
import Elysia from "elysia"

type RawAnalysis = Pick<
    Analysis,
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
    modifiedTextAlternatives: true,
    biasedTerms: true,
    biasedMetaphors: true,
    additionalContextEvaluation: true,
    impactAnalysis: true,
    conclusion: true,
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
                const languageModel = aiService!.buildLanguageModel(
                    analysis!.Preset!.Models![0]!.Model,
                )
                console.log(analysis)
                const { experimental_output } = await generateText({
                    model: languageModel,
                    prompt: `lang=${session?.lang} <analice>${analysis.originalText}</analice>`,
                    system: genderLexSystemPrompt,
                    stopWhen: stepCountIs(3),
                    experimental_output: Output.object({ schema }),
                })

                return experimental_output as RawAnalysis
            },
        },
    }))
