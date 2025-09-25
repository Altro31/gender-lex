"use server"

import { client } from "@/lib/api/client"
import { getPrisma } from "@/lib/prisma/client"
import { actionClient } from "@/lib/safe-action"
import { ModelSchema } from "@/sections/model/form/model-schema"
import { revalidatePath } from "next/cache"
import { z } from "zod/mini"

export async function findModels({
	q,
	page = "1",
}: {
	q?: string
	page?: string
}) {
	const prisma = await getPrisma()
	return prisma.model.findMany({
		where: {
			name: { contains: q, mode: "insensitive" },
		},
		skip: (Number(page) - 1) * 10,
		take: 10,
		orderBy: [
			{ isDefault: "asc" },
			{ createdAt: "desc" },
			{ updatedAt: "desc" },
		],
	})
}

export const createModel = actionClient
	.inputSchema(ModelSchema)
	.action(async ({ parsedInput: body }) => {
		const { data } = await client.model.post(body)

		revalidatePath("/models", "page")

		return {
			success: true,
			data,
		}
	})

export const editModel = actionClient
	.inputSchema(z.tuple([z.string(), ModelSchema]))
	.action(async ({ parsedInput: [id, body] }) => {
		const prisma = await getPrisma()

		const data = await prisma.model.update({ where: { id }, data: body })
		void testConnection(id)
		revalidatePath("/models", "page")

		return {
			success: true,
			data,
		}
	})

export const deleteModel = actionClient
	.inputSchema(z.string())
	.action(async ({ parsedInput: id }) => {
		const prisma = await getPrisma()
		await prisma.model.delete({ where: { id } })
		revalidatePath("/models", "page")
		return {
			success: true,
		}
	})

export const testConnection = actionClient
	.inputSchema(z.string())
	.action(async ({ parsedInput: id }) => {
		const { data, error } = await client
			.model({ id })
			["test-connection"].post()

		revalidatePath("/models", "page")
		if (error) throw new Error("Failed to connect model")
		return {
			success: true,
			data,
		}
	})

export const getModelsSelect = async ({ page }: { page: number }) => {
	const prisma = await getPrisma()

	return prisma.model.findMany({
		skip: page * 20,
		take: 20,
		select: { id: true, name: true },
	})
}
