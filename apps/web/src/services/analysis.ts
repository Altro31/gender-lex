"use server"

import { client } from "@/lib/api/client"
import { getSession } from "@/lib/auth/auth-server"
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
	await client.DELETE("/zen/analysis/{id}", {
		params: { path: { id } },
	})
}

export async function findAnalyses({
	page,
	status,
}: {
	page: number
	status?: string
}) {
	const session = await getSession()
	if (!session) unauthorized()
	return client.GET("/zen/analysis", {
		params: {
			query: {
				"page[offset]": (page - 1) * 10,
				"filter[status]": status as any,
			},
		},
	})
}

export async function findOneAnalysis(id: string) {
	const session = await getSession()
	if (!session) unauthorized()
	return client.GET("/zen/analysis/{id}", {
		params: { path: { id }, query: { include: "Presets" } },
	})
}

export async function getStatusCount() {
	const session = await getSession()
	if (!session) unauthorized()
	return client.GET("/analysis/status-count")
}

export async function redoAnalysis(id: string) {
	const { data, error } = await client.PATCH("/zen/analysis/{id}", {
		params: { path: { id } },
		body: {
			data: { id, type: "analysis", attributes: { status: "pending" } },
		},
	})
	if (error) {
		console.error(error)
		throw new Error("An error occurred when trying access analysis with id")
	}
	permanentRedirect(`/analysis/${data.data.id}`)
}
