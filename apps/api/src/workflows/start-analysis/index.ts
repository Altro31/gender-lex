import { getWorkflowMetadata } from "workflow"
import type { Context } from "../common-types"
import { closeStream } from "../shared/close-stream"
import { biasDetection } from "./steps/bias-detection"
import { extractContent } from "./steps/extract-content"
import { persistOnDatabase } from "./steps/persist-on-database"
import { streamGeneratedId } from "./steps/stream-generated-id"
import { streamUpdate } from "./steps/stream-update"
import { updateOriginalText } from "./steps/update-original-text"
import { updateStatus } from "./steps/update-status"
import { updateWithResult } from "./steps/update-with-result"

interface AnalysisInput {
    presetId: string
}

export async function startAnalysisWorkflow(
    resource: ReadableStream | string,
    input: AnalysisInput,
    ctx: Context,
) {
    "use workflow"

    const { presetId } = input

    const { workflowRunId } = getWorkflowMetadata()

    const persistedAnalysis = await persistOnDatabase(
        { presetId, workflow: workflowRunId },
        ctx,
    )

    await streamGeneratedId(persistedAnalysis.id)

    await closeStream("id")

    await streamUpdate(
        await updateStatus(
            { status: "pending", analysisId: persistedAnalysis.id },
            ctx,
        ),
    )

    const content = await extractContent(resource)

    const analysisWithOriginalText = await updateOriginalText(
        { content, analysisId: persistedAnalysis.id },
        ctx,
    )
    await streamUpdate(
        await updateStatus(
            { status: "analyzing", analysisId: persistedAnalysis.id },
            ctx,
        ),
    )

    const result = await biasDetection({ analysis: analysisWithOriginalText })

    await updateWithResult({ result, analysisId: persistedAnalysis.id }, ctx)
    const updated = await updateStatus(
        { status: "done", analysisId: persistedAnalysis.id },
        ctx,
    )
    await streamUpdate(updated)

    await closeStream("update")

    return updated
}
