'use server'

import { getSession } from '@/lib/auth/auth-server'
import { getPrisma } from '@/lib/prisma/client'
import { actionClient } from '@/lib/safe-action'
import { revalidatePath } from 'next/cache'
import z from 'zod'

const UpdateProfileSchema = z.object({
	name: z.string().min(1, 'El nombre es requerido'),
})

export type getUserProfile = Awaited<ReturnType<typeof getUserProfile>>
export const getUserProfile = async () => {
	'use cache: private'

	const session = await getSession()
	if (!session?.user || session.user.isAnonymous) {
		throw new Error('Usuario no autenticado')
	}

	const prisma = await getPrisma()
	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: {
			id: true,
			name: true,
			email: true,
			emailVerified: true,
			image: true,
			role: true,
			createdAt: true,
			updatedAt: true,
			loggedAt: true,
		},
	})

	if (!user) {
		throw new Error('Usuario no encontrado')
	}

	return user
}

export const updateUserProfile = actionClient
	.inputSchema(UpdateProfileSchema)
	.action(async ({ parsedInput }) => {
		const session = await getSession()
		if (!session?.user || session.user.isAnonymous) {
			throw new Error('Usuario no autenticado')
		}

		const prisma = await getPrisma()
		const updatedUser = await prisma.user.update({
			where: { id: session.user.id },
			data: { name: parsedInput.name },
		})

		revalidatePath('/profile')
		return { success: true, user: updatedUser }
	})

export const updateUserImage = actionClient
	.inputSchema(z.object({ image: z.string().url() }))
	.action(async ({ parsedInput }) => {
		const session = await getSession()
		if (!session?.user || session.user.isAnonymous) {
			throw new Error('Usuario no autenticado')
		}

		const prisma = await getPrisma()
		const updatedUser = await prisma.user.update({
			where: { id: session.user.id },
			data: { image: parsedInput.image },
		})

		revalidatePath('/profile')
		return { success: true, user: updatedUser }
	})
