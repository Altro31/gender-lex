import { z } from "zod/mini"

export type ModelSchema = z.infer<typeof ModelSchema>
export const ModelSchema = z.object({
	name: z.string(),
	provider: z.string(),
	connection: z.object({
		identifier: z.string(),
		url: z.string(),
	}),
	apiKey: z.optional(z.string()),
	settings: z.object({
		temperature: z.optional(z.number().check(z.minimum(0), z.maximum(1))),
	}),
})
