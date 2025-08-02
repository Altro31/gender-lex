"use server"

import { client } from "@/lib/api/client"
import { getSession } from "@/lib/auth-server"
import { endpoints } from "@/lib/endpoints"
import { unauthorized } from "next/navigation"

export async function prepareAnalysis(formData: FormData) {
	const session = await getSession()
	const { data } = await client.POST("/ai/analysis/prepare", {
		body: formData as any,
		headers: { Authorization: `Bearer ${session?.session.token}` },
	})
	if (!data)
		throw new Error("An error occurred when trying access analysis with id")
}

export async function startAnalysis(id: string) {
	const session = await getSession()
	if (!session) unauthorized()
	const res = await client.POST("/ai/analysis/start/{id}", {
		params: { path: { id } },
	})
	return res.data
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
	const res = await fetch(endpoints.ai.analysis.root, {
		headers: { Authorization: `Bearer ${session.session.token}` },
	})

	return res.json()
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
