"use server"

import { client } from "@/lib/api/client"
import { getPrisma } from "@/lib/prisma/client"
import { actionClient } from "@/lib/safe-action"
import { ModelSchema } from "@/sections/model/form/model-schema"
import { returnValidationErrors } from "next-safe-action"
import { revalidatePath } from "next/cache"
import { z } from "zod/mini"

export async function findModels({
	q,
	page = "1",
	status,
}: {
	q?: string
	page?: string
	status?: string
}) {
	const prisma = await getPrisma()
	return prisma.model.findMany({
		where: {
			name: { contains: q, mode: "insensitive" },
			status: status as any,
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
		const { data } = await client.POST("/model", {
			body,
		})

		revalidatePath("/models", "page")

		return {
			success: true,
			data,
		}
	})

export const editModel = actionClient
	.inputSchema(z.tuple([z.string(), ModelSchema]))
	.action(async ({ parsedInput: [id, body] }) => {
		const { data, error } = await client.PUT("/zen/model/{id}", {
			params: { path: { id } },
			body: { data: { id, type: "model", attributes: body } },
		})
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
		const { data, error } = await client.DELETE("/zen/model/{id}", {
			params: { path: { id } },
		})
		if (error)
			return returnValidationErrors(
				ModelSchema,
				error.errors[0]!.zodErrors!,
			)

		revalidatePath("/models", "page")

		return {
			success: true,
			data,
		}
	})

export const testConnection = actionClient
	.inputSchema(z.string())
	.action(async ({ parsedInput: id }) => {
		const { data } = await client.POST("/model/{id}/test-connection", {
			params: { path: { id } },
		})

		revalidatePath("/models", "page")
		if (!data?.ok) throw new Error("Failed to connect model")
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
