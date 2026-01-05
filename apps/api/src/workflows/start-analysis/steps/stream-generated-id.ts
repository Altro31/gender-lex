import { getWritable } from "workflow"

export async function streamGeneratedId(id: string) {
    "use step"

    const stream = getWritable<string>({ namespace: "id" })
    const writer = stream.getWriter()
    await writer.write(id)
    writer.releaseLock()
}
