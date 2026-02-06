import type { AnalysisUpdate } from "@/lib/types/raw-analysis"
import { getUpdateStream } from "@/workflows/start-analysis/steps/utils"
import type { Analysis, RawAnalysis } from "@repo/db/models"
import type { DeepPartial } from "ai"
import { Stream } from "effect"
import { constant } from "effect/Function"

export async function consumeResultStream<T extends Analysis>(
    resultStream: ReadableStream<DeepPartial<RawAnalysis>>,
    analysis: T,
) {
    "use step"

    const stream = getUpdateStream()
    const writer = stream.getWriter()

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

    return result as typeof result & RawAnalysis
}
