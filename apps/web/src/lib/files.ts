import { z } from "zod"

type SerializedFile = Awaited<ReturnType<typeof serializeFile>>
export const SerializedFile = z.object({
	name: z.string(),
	size: z.number(),
	type: z.string(),
	buffer: z.instanceof(ArrayBuffer),
}) as z.ZodType<SerializedFile>
export async function serializeFile(file: File) {
	return {
		name: file.name,
		size: file.size,
		type: file.type,
		buffer: await file.arrayBuffer(),
	}
}

export function deserializeFile(data: SerializedFile): File {
	return new File([data.buffer], data.name, { type: data.type })
}
