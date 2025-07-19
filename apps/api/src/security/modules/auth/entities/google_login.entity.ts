import z from 'zod'

export type GoogleLoginEntity = z.infer<typeof GoogleLoginEntity>
export const GoogleLoginEntity = z.object({
	azp: z.string(),
	aud: z.string(),
	sub: z.string(),
	scope: z.string(),
	exp: z.string(),
	expires_in: z.coerce.string(),
	email: z.string().email(),
	email_verified: z.boolean(),
	access_type: z.enum(['online', 'offline']),
})
