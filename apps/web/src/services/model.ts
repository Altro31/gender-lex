'use server'

import { client } from '@/lib/api/client'
import { getDB } from '@/lib/db/client'
import { actionClient } from '@/lib/safe-action'
import { ModelSchema } from '@/sections/model/form/model-schema'
import { cacheTag, updateTag } from 'next/cache'
import { after } from 'next/server'
import { z } from 'zod/mini'

export async function findModels({
	q,
	page = '1',
}: {
	q?: string
	page?: string
}) {
	'use cache: private'
	cacheTag('models')
	const db = await getDB()
	return db.model.findMany({
		where: { name: { contains: q, mode: 'insensitive' } },
		skip: (Number(page) - 1) * 10,
		take: 10,
		orderBy: [
			{ isDefault: 'asc' },
			{ createdAt: 'desc' },
			{ updatedAt: 'desc' },
		],
	})
}

export const createModel = actionClient
	.inputSchema(ModelSchema)
	.action(async ({ parsedInput: body }) => {
		const { data } = await client.model.post(body)

		updateTag('models')
		return { success: true, data }
	})

export const editModel = actionClient
	.inputSchema(z.tuple([z.string(), ModelSchema]))
	.action(async ({ parsedInput: [id, body] }) => {
		const db = await getDB()

		const data = await db.model.update({ where: { id }, data: body })
		after(() => testConnection(id))

		updateTag('models')
		updateTag(`model-${id}`)
		return { success: true, data }
	})

export const deleteModel = actionClient
	.inputSchema(z.string())
	.action(async ({ parsedInput: id }) => {
		const db = await getDB()
		await db.model.delete({ where: { id } })
		updateTag('models')
		return { success: true }
	})

export const testConnection = actionClient
	.inputSchema(z.string())
	.action(async ({ parsedInput: id }) => {
		const { data, error } = await client
			.model({ id })
			['test-connection'].post()

		if (error) throw new Error('Failed to connect model')
		updateTag('models')
		updateTag(`model-${id}`)
		return { success: true, data }
	})

export const getModelsSelect = async ({ page }: { page: number }) => {
	'use cache: private'
	cacheTag('models')
	const db = await getDB()

	return db.model.findMany({
		skip: page * 20,
		take: 20,
		select: { id: true, name: true },
	})
}
