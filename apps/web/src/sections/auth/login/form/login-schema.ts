import { z } from "zod/mini"

export const LoginSchema = z.object({
	email: z.email(),
	password: z.string(),
	rememberMe: z.prefault(z.optional(z.boolean()), false),
})
