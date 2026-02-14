export async function streamGeneratedId(
    id: string,
    stream: WritableStream<string>,
) {
    "use step"

    const writer = stream.getWriter()
    await writer.write(id)
    writer.releaseLock()
}

export async function closeStreamId(stream: WritableStream<string>) {
    "use step"

    return stream.close()
}
