import { consumeResultStream } from "@/workflows/start-analysis/steps/consume-result-stream"
import type { Analysis, RawAnalysis } from "@repo/db/models"
import type { Context } from "../common-types"
import { biasDetection } from "./steps/bias-detection"
import { extractContent } from "./steps/extract-content"
import { persistOnDatabase } from "./steps/persist-on-database"
import { closeStreamId, streamGeneratedId } from "./steps/stream-generated-id"
import { streamAnalysisUpdate } from "./steps/stream-update"
import { updateOriginalText } from "./steps/update-original-text"
import { updateStatus } from "./steps/update-status"
import { updateWithResult } from "./steps/update-with-result"

interface AnalysisInput {
    presetId: string | undefined
}

export async function startAnalysisWorkflow(
    resource: ReadableStream | string,
    input: AnalysisInput,
    ctx: Context,
) {
    "use workflow"

    const { presetId } = input

    const persistedAnalysis = await persistOnDatabase({ presetId }, ctx)

    await streamGeneratedId(persistedAnalysis.id)
    await closeStreamId()

    const pendingAnalysis = await updateStatus(
        { status: "pending", analysis: persistedAnalysis as Analysis },
        ctx,
    )
    await streamAnalysisUpdate(pendingAnalysis)

    const content = await extractContent(resource)

    const analysisWithOriginalText = await updateOriginalText(
        { content, analysisId: persistedAnalysis.id },
        ctx,
    )
    const analyzingAnalysis = await updateStatus(
        { status: "analyzing", analysis: analysisWithOriginalText },
        ctx,
    )
    await streamAnalysisUpdate(analyzingAnalysis)

    const resultStream = await biasDetection({
        analysis: analyzingAnalysis,
    })
    const result = await consumeResultStream(
        resultStream as ReadableStream<Partial<RawAnalysis>>,
        analyzingAnalysis,
    )

    const updatedWithResult = await updateWithResult(
        { result, analysisId: analyzingAnalysis.id },
        ctx,
    )

    const updated = await updateStatus(
        { status: "done", analysis: updatedWithResult },
        ctx,
    )
    await streamAnalysisUpdate(updated)

    return updated
}
