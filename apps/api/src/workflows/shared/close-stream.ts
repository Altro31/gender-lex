export async function closeStream(stream: WritableStream) {
    "use step"
    await stream.close()
}
