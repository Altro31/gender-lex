"use server"

import { auth } from "@/auth"
import { client } from "@/lib/api/client"
import { endpoints } from "@/lib/endpoints"
import { cookies } from "next/headers"
import { permanentRedirect, unauthorized } from "next/navigation"

export async function prepareAnalysis(formData: FormData) {
	// const session = await auth()
	// const { data } = await client.POST("/ai/analysis/prepare", {
	// 	body: formData as any,
	// 	headers: { Authorization: `Bearer ${session?.jwt}` },
	// })
	// if (!data)
	// 	throw new Error("An error occurred when trying access analysis with id")
	const cookieStore = await cookies()
	cookieStore.set(
		"visitors",
		Number(cookieStore.get("visitors")?.value ?? 0) + 1 + "",
	)
	permanentRedirect("/analysis/" + "1")
}

export async function startAnalysis(id: string) {
	const session = await auth()
	const res = await client.POST("/ai/analysis/start/{id}", {
		params: { path: { id } },
	})
	return res.data
}

export async function deleteAnalysis(id: string) {
	const session = await auth()
	if (!session) unauthorized()
	await fetch(endpoints.ai.analysis.id.replace(":id", id), {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${session.jwt}`,
		},
	})
}

export async function getAllAnalysis(page: number) {
	const session = await auth()
	if (!session) unauthorized()
	const res = await fetch(endpoints.ai.analysis.root, {
		headers: { Authorization: `Bearer ${session.jwt}` },
	})

	return res.json()
}

export async function getOneAnalysis(id: string) {
	const session = await auth()
	if (!session) unauthorized()
	const res = await fetch(endpoints.ai.analysis.id.replace(":id", id), {
		headers: {
			Authorization: `Bearer ${session.jwt}`,
		},
	})
	return res.json()
}
