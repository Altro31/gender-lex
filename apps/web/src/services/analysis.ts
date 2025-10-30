"use server"

import { client } from "@/lib/api/client"
import { getSession } from "@/lib/auth/auth-server"
import { getPrisma } from "@/lib/prisma/client"
import { actionClient } from "@/lib/safe-action"
import type { HomeSchema } from "@/sections/home/form/home-schema"
import { cacheTag, updateTag } from "next/cache"
import { unauthorized } from "next/navigation"
import z from "zod"

export async function prepareAnalysis(input: HomeSchema) {
	const session = await getSession()
	if (!session) unauthorized()
	const { data, error } = await client.analysis.prepare.post({
		...input,
		files: input.files.map(({ file }) => file),
		selectedPreset: input.selectedPreset.id,
	})
	if (error) {
		console.error(error)
		return { error }
	}
	updateTag("analyses")
	return { data, error: null }
}

export async function startAnalysis(id: string) {
	const session = await getSession()
	if (!session) unauthorized()
	const { data, error } = await client.analysis.start({ id }).post()
	if (error) {
		console.error(error.value)
		throw new Error("An error occurred when trying access analysis with id")
	}
	return data
}

export const deleteAnalysis = actionClient
	.inputSchema(z.string())
	.action(async ({ parsedInput: id }) => {
		const session = await getSession()
		if (!session) unauthorized()
		await client.analysis({ id }).delete()
		updateTag("analyses")
	})

export async function findAnalyses(query: {
	q?: string
	page?: string
	status?: string
}) {
	"use cache: private"
	cacheTag("analyses")

	const session = await getSession()
	if (!session) unauthorized()

	const { error, data } = await client.analysis.get({
		query: {
			q: query.q || "",
			page: query.page ? Number(query.page) : 1,
			status: query.status || undefined,
		},
	})
	console.log(error, data)
	if (error) throw new Error(JSON.stringify(error))
	return data
}

export async function findOneAnalysis(id: string) {
	"use cache: remote"
	cacheTag(`analysis-${id}`)
	const session = await getSession()
	if (!session) unauthorized()
	const { data, error } = await client.analysis({ id }).get()
	if (error) throw new Error(error.value.summary)
	return data
}

export async function findRecentAnalyses() {
	"use cache: private"
	cacheTag(`analyses`)
	const prisma = await getPrisma()
	return prisma.analysis.findMany({
		orderBy: [{ createdAt: "desc" }],
		take: 5,
	})
}

export async function getStatusCount() {
	"use cache: private"
	cacheTag(`analyses`)
	const session = await getSession()
	if (!session) unauthorized()
	const { error, data } = await client.analysis["status-count"].get()
	if (error) throw new Error(error.value.summary)
	return data
}

export async function redoAnalysis(id: string) {
	const session = await getSession()
	if (!session) unauthorized()
	const { data, error } = await client.analysis({ id }).redo.post()
	if (error) {
		console.error(error)
		return { error }
	}
	updateTag("analyses")
	updateTag(`analysys-${id}`)
	return { data, error: null }
}
