import type { Analysis } from "@repo/db/models"

export async function streamAnalysisUpdate(
    update: Analysis,
    stream: WritableStream<Analysis>,
) {
    "use step"

    const writer = stream.getWriter()
    await writer.write(update)
    writer.releaseLock()
}
