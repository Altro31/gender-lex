"use server"

import { client } from "@/lib/api/client"
import { getSession } from "@/lib/auth/auth-server"
import { actionClient } from "@/lib/safe-action"
import { ModelSchema } from "@/sections/model/form/model-schema"
import { unauthorized } from "next/navigation"
import { returnValidationErrors } from "next-safe-action"

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
	.action(async ({ parsedInput }) => {
		const { data, error } = await client.POST("/zen/model", {
			body: { data: { type: "model", attributes: parsedInput as any } },
		})
		if (error)
			return returnValidationErrors(
				ModelSchema,
				error.errors[0]!.zodErrors!,
			)

		return {
			success: true,
			data,
		}
	})
