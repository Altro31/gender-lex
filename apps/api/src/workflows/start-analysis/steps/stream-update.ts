import type { AnalysisUpdate } from "@/lib/types/raw-analysis"
import { getUpdateStream } from "@/workflows/start-analysis/steps/utils"
import type { Analysis } from "@repo/db/models"

export async function streamAnalysisUpdate(update: Analysis) {
    "use step"
    const stream = getUpdateStream()
    const writer = stream.getWriter()
    await writer.write({
        id: update.id,
        name: update.name,
        createdAt: update.createdAt,
        originalText: update.originalText,
        status: update.status,
        updatedAt: update.updatedAt,
        visibility: update.visibility,
        additionalContextEvaluation: update.additionalContextEvaluation,
        biasedMetaphors: update.biasedMetaphors,
        modifiedTextAlternatives: update.modifiedTextAlternatives,
        biasedTerms: update.biasedTerms,
        impactAnalysis: update.impactAnalysis,
        conclusion: update.conclusion,
    } as AnalysisUpdate)
    writer.releaseLock()
}
