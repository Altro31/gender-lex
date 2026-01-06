import { getWorkflowMetadata, getWritable } from "workflow"
import type { Context } from "../common-types"
import { closeStream } from "../shared/close-stream"
import { biasDetection } from "./steps/bias-detection"
import { extractContent } from "./steps/extract-content"
import { persistOnDatabase } from "./steps/persist-on-database"
import { streamGeneratedId } from "./steps/stream-generated-id"
import { streamAnalysisUpdate } from "./steps/stream-update"
import { updateOriginalText } from "./steps/update-original-text"
import { updateStatus } from "./steps/update-status"
import { updateWithResult } from "./steps/update-with-result"
import type { Analysis } from "@repo/db/models"

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

    const streamId = getWritable<string>({ namespace: "id" })
    const streamUpdate = getWritable<Analysis>({ namespace: "update" })

    const { workflowRunId } = getWorkflowMetadata()

    const persistedAnalysis = await persistOnDatabase(
        { presetId, workflow: workflowRunId },
        ctx,
    )

    await streamGeneratedId(persistedAnalysis.id, streamId)
    await closeStream(streamId)

    await streamAnalysisUpdate(
        await updateStatus(
            { status: "pending", analysisId: persistedAnalysis.id },
            ctx,
        ),
        streamUpdate,
    )

    const content = await extractContent(resource)

    const analysisWithOriginalText = await updateOriginalText(
        { content, analysisId: persistedAnalysis.id },
        ctx,
    )
    await streamAnalysisUpdate(
        await updateStatus(
            { status: "analyzing", analysisId: persistedAnalysis.id },
            ctx,
        ),
        streamUpdate,
    )

    const result = await biasDetection({ analysis: analysisWithOriginalText })

    await updateWithResult({ result, analysisId: persistedAnalysis.id }, ctx)
    const updated = await updateStatus(
        { status: "done", analysisId: persistedAnalysis.id },
        ctx,
    )
    await streamAnalysisUpdate(updated, streamUpdate)

    await closeStream(streamUpdate)

    return updated
}
