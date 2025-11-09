import type { Analysis } from "@repo/db/models"

export type RawAnalysis = Pick<
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
