import z from "zod"

export type ModelSchema = z.infer<typeof ModelSchema>
export const ModelSchema = z.object({
	name: z.string(),
	provider: z.string(),
	connection: z.object({
		identifier: z.string(),
		url: z.string(),
	}),
	apiKey: z.string().optional(),
	settings: z.object({ temperature: z.number().min(0).max(1).optional() }),
})
