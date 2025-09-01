"use server"

import { client } from "@/lib/api/client"
import { getSession } from "@/lib/auth/auth-server"
import { actionClient } from "@/lib/safe-action"
import { ModelSchema } from "@/sections/model/form/model-schema"
import { unauthorized } from "next/navigation"
import { returnValidationErrors } from "next-safe-action"
import { revalidatePath } from "next/cache"
import { z } from "zod/mini"

export async function findModels({
	page,
	status,
}: {
	page: number
	status?: string
}) {
	const session = await getSession()
	if (!session) unauthorized()
	return client.GET("/zen/model", {
		params: {
			query: {
				"page[offset]": (page - 1) * 10,
				"filter[status]": status as any,
			},
		},
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
		console.log(error)

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
