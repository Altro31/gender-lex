"use server"

import { client } from "@/lib/api/client"
import { getSession } from "@/lib/auth/auth-server"
import { actionClient } from "@/lib/safe-action"
import { PresetSchema } from "@/sections/preset/form/preset-schema"
import { unauthorized } from "next/navigation"
import { returnValidationErrors } from "next-safe-action"
import { revalidatePath } from "next/cache"
import { z } from "zod/mini"
import type { Route } from "next"

export async function findPresets({ page, q }: { page: number; q?: string }) {
	const session = await getSession()
	if (!session) unauthorized()
	return client.GET("/zen/preset", {
		params: {
			query: {
				"page[offset]": (page - 1) * 10,
				"filter[name$contains]": q,
			},
		},
	})
}

export const createPreset = actionClient
	.inputSchema(PresetSchema)
	.action(async ({ parsedInput: body }) => {
		const { data } = await client.POST("/zen/preset", {
			body,
		})

		revalidatePath("/presets" as Route, "page")

		return {
			success: true,
			data,
		}
	})

export const editPreset = actionClient
	.inputSchema(z.tuple([z.string(), PresetSchema]))
	.action(async ({ parsedInput: [id, body] }) => {
		const { data, error } = await client.PUT("/zen/preset/{id}", {
			params: { path: { id } },
			body: { data: { id, type: "model", attributes: body } },
		})
		console.log(error)

		revalidatePath("/presets" as Route, "page")

		return {
			success: true,
			data,
		}
	})

export const deletePreset = actionClient
	.inputSchema(z.string())
	.action(async ({ parsedInput: id }) => {
		const { data, error } = await client.DELETE("/zen/preset/{id}", {
			params: { path: { id } },
		})
		if (error)
			return returnValidationErrors(
				PresetSchema,
				error.errors[0]!.zodErrors!,
			)

		revalidatePath("/presets" as Route, "page")

		return {
			success: true,
			data,
		}
	})
