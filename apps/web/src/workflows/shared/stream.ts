export async function sendStreamData<T>(data: T, stream: WritableStream) {
	"use step"
	const writer = stream.getWriter()
	await writer.write(new TextEncoder().encode(JSON.stringify(data)))
	writer.releaseLock()
}

export async function closeWritable<T>(stream: WritableStream) {
	"use step"
	await stream.close()
}
