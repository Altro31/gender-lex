import type { AnalysisUpdate } from "@/lib/types/raw-analysis"
import type { AnalysisOutput } from "@/modules/bias-detection/service"
import { closeStream } from "@/workflows/shared/close-stream"
import { consumeResultStream } from "@/workflows/start-analysis/steps/consume-result-stream"
import type { Analysis } from "@repo/db/models"
import { getWorkflowMetadata, getWritable } from "workflow"
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

    const streamUpdate = getWritable<AnalysisUpdate>({ namespace: "update" })

    const { workflowRunId } = getWorkflowMetadata()

    const persistedAnalysis = await persistOnDatabase(
        { presetId, workflow: workflowRunId },
        ctx,
    )
    const streamId = getWritable<string>({ namespace: "id" })
    await streamGeneratedId(persistedAnalysis.id, streamId)
    await closeStreamId(streamId)

    const pendingAnalysis = await updateStatus(
        { status: "pending", analysis: persistedAnalysis as Analysis },
        ctx,
    )
    await streamAnalysisUpdate(pendingAnalysis, streamUpdate)

    const content = await extractContent(resource)

    const analysisWithOriginalText = await updateOriginalText(
        { content, analysisId: persistedAnalysis.id },
        ctx,
    )
    const analyzingAnalysis = await updateStatus(
        { status: "analyzing", analysis: analysisWithOriginalText },
        ctx,
    )
    await streamAnalysisUpdate(analyzingAnalysis, streamUpdate)

    const [resultStream, reasoningStream] = await biasDetection({
        analysis: analyzingAnalysis,
    })
    const result = await consumeResultStream(
        resultStream as ReadableStream<Partial<AnalysisOutput>>,
        reasoningStream,
        analyzingAnalysis,
        streamUpdate,
    )
    const updatedWithResult = await updateWithResult(
        {
            result,
            analysisId: analyzingAnalysis.id,
        },
        ctx,
    )

    const updated = await updateStatus(
        { status: "done", analysis: updatedWithResult },
        ctx,
    )
    await streamAnalysisUpdate(updated, streamUpdate)

    await closeStream(streamUpdate)

    return updated
}
