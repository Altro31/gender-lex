import type { Context } from "../common-types"
import { biasDetection } from "./steps/bias-detection"
import { extractContent } from "./steps/extract-content"
import { persistOnDatabase } from "./steps/persist-on-database"
import { updateOriginalText } from "./steps/update-original-text"
import { updateStatus } from "./steps/update-status"
import { updateWithResult } from "./steps/update-with-result"

interface AnalysisInput {
    presetId: string
    resource: string | File
}

export async function startAnalysisWorkflow(
    input: AnalysisInput,
    ctx: Context,
) {
    "use workflow"
    console.log("startAnalysisWorkflow")
    const { presetId, resource } = input

    const persistedAnalysis = await persistOnDatabase({ presetId }, ctx)

    await updateStatus(
        { status: "pending", analysisId: persistedAnalysis.id },
        ctx,
    )

    const content = await extractContent({ resource })

    const analysisWithOriginalText = await updateOriginalText(
        { content, analysisId: persistedAnalysis.id },
        ctx,
    )

    await updateStatus(
        { status: "analyzing", analysisId: persistedAnalysis.id },
        ctx,
    )

    const result = await biasDetection({ analysis: analysisWithOriginalText })

    await updateWithResult({ result, analysisId: persistedAnalysis.id }, ctx)

    return updateStatus(
        { status: "pending", analysisId: persistedAnalysis.id },
        ctx,
    )
}
