import isLocalhostIP from "is-local-address"
import { z } from "zod/mini"

export type ModelSchema = z.infer<typeof ModelSchema>
export const ModelSchema = z.object({
	name: z.string().check(z.minLength(1, "Name field is required")),
	connection: z.object({
		identifier: z
			.string()
			.check(z.minLength(1, "Identifier field is required")),
		url: z.url("Url field is required").check(
			z.refine((value) => {
				try {
					const url = new URL(value)
					return !isLocalhostIP(url.hostname)
				} catch {
					return false
				}
			}, "Local urls cannot be used due to network restrictions"),
		),
	}),
	apiKey: z.optional(z.string()),
	settings: z.object({
		temperature: z.number().check(z.minimum(0), z.maximum(1)),
	}),
})
