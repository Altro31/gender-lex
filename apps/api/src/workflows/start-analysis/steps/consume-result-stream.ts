import type { AnalysisUpdate } from "@/lib/types/raw-analysis"
import type { AnalysisOutput } from "@/modules/bias-detection/service"
import type { Analysis, RawAnalysis } from "@repo/db/models"
import type { DeepPartial, ReasoningOutput } from "ai"
import { Stream } from "effect"
import { constant } from "effect/Function"

export async function consumeResultStream<T extends Analysis>(
    resultStream: ReadableStream<DeepPartial<AnalysisOutput>>,
    reasoningStream: ReadableStream<ReasoningOutput[]>,
    analysis: T,
    streamUpdate: WritableStream<AnalysisUpdate>,
) {
    "use step"

    const writer = streamUpdate.getWriter()

    const analysisStream = Stream.fromReadableStream({
        evaluate: constant(resultStream),
        onError: console.error,
    }).pipe(Stream.toAsyncIterable)

    let result = {
        id: analysis.id,
        name: analysis.name,
        createdAt: analysis.createdAt,
        originalText: analysis.originalText,
        status: analysis.status,
        updatedAt: analysis.updatedAt,
        visibility: analysis.visibility,
    }

    for await (const update of analysisStream) {
        result = { ...result, ...update } as T
        await writer.write(result as AnalysisUpdate)
    }

    writer.releaseLock()
    const reasoningOutput = await reasoningStream.getReader().read()

    return {
        ...(result as typeof result & RawAnalysis),
        reasoning: JSON.stringify(reasoningOutput.value),
    }
}
