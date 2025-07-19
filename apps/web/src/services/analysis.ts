"use server"

import { auth } from "@/auth"
import { endpoints } from "@/lib/endpoints"
import { permanentRedirect, unauthorized } from "next/navigation"

export async function prepareAnalysis(formData: FormData) {
	const session = await auth()
	const res = await fetch(endpoints.ai.analysis.prepare, {
		method: "POST",
		body: formData,
		headers: {
			Authorization: `Bearer ${session?.jwt}`,
		},
	})
	const data = await res.json()
	permanentRedirect("/analice?" + data.id)
}

export async function startAnalysis(id: string) {
	const session = await auth()
	const res = await fetch(endpoints.ai.analysis.start.replace(":id", id), {
		method: "POST",
		headers: {
			Authorization: `Bearer ${session?.jwt}`,
		},
	})
	return res.json()
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
