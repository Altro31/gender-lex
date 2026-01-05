import type { Analysis } from "@repo/db/models"
import { getWritable } from "workflow"

export async function streamUpdate(update: Analysis) {
    "use step"

    const stream = getWritable<Analysis>({ namespace: "update" })
    const writer = stream.getWriter()
    await writer.write(update)
    writer.releaseLock()
}
