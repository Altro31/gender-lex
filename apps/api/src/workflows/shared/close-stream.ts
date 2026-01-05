import { getWritable } from "workflow"

export async function closeStream(namespace?: string) {
    "use step"
    const stream = getWritable({ namespace })
    await stream.close()
}
