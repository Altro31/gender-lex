'use server'

import { auth } from '@/lib/auth/auth-server'
import envs from '@/lib/env/env-server'
import { actionClient } from '@/lib/safe-action'
import { LoginSchema } from '@/sections/auth/login/form/login-schema'
import { RegisterSchema } from '@/sections/auth/register/form/register-schema'
import { redirect } from 'next/navigation'
import z from 'zod'

export const signInEmail = actionClient
	.inputSchema(LoginSchema)
	.action(async ({ parsedInput }) => {
		await auth.api.signInEmail({ body: parsedInput })
		return { success: true }
	})

export const signInSocial = actionClient
	.inputSchema(z.enum(['github', 'google']))
	.action(async ({ parsedInput: provider }) => {
		const res = await auth.api.signInSocial({
			body: { provider, callbackURL: envs.UI_URL },
		})
		if (res.redirect) {
			redirect(res.url ?? '/')
		}
		return { success: true }
	})

export const signUp = actionClient
	.inputSchema(RegisterSchema)
	.action(async ({ parsedInput }) => {
		await auth.api.signUpEmail({ body: parsedInput })
		return { success: true }
	})
