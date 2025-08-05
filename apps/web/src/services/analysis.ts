"use server"

import { client } from "@/lib/api/client"
import { getSession } from "@/lib/auth/auth-server"
import { endpoints } from "@/lib/endpoints"
import type { Analysis } from "@repo/db/models"
import { permanentRedirect, unauthorized } from "next/navigation"

export async function prepareAnalysis(formData: FormData) {
	const { data, error } = await client.POST("/ai/analysis/prepare", {
		body: formData as any,
	})
	if (!data) {
		console.error(error)
		throw new Error("An error occurred when trying access analysis with id")
	}
	permanentRedirect(`/analysis/${data.data.id}`)
}

export async function startAnalysis(id: string) {
	const { data, error } = await client.POST("/ai/analysis/start/{id}", {
		params: { path: { id } },
	})
	if (error) {
		console.error(error)
		throw new Error("An error occurred when trying access analysis with id")
	}

	return data as unknown as Analysis
}

export async function deleteAnalysis(id: string) {
	const session = await getSession()
	if (!session) unauthorized()
	await fetch(endpoints.ai.analysis.id.replace(":id", id), {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${session.session.token}`,
		},
	})
}

export async function getAllAnalysis(page: number) {
	const session = await getSession()
	if (!session) unauthorized()
	const res = await client.GET("/zen/analysis", {
		params: { query: { "page[offset]": (page - 1) * 10 } },
	})

	return res.data
}

export async function getOneAnalysis(id: string) {
	const session = await getSession()
	if (!session) unauthorized()
	const res = await fetch(endpoints.ai.analysis.id.replace(":id", id), {
		headers: {
			Authorization: `Bearer ${session.session.token}`,
		},
	})
	return res.json()
}
