"use server"

import { client } from "@/lib/api/client"
import { getSession } from "@/lib/auth/auth-server"
import { getPrisma } from "@/lib/prisma/client"
import { actionClient } from "@/lib/safe-action"
import type { HomeSchema } from "@/sections/home/form/home-schema"
import type { Analysis } from "@repo/db/models"
import { revalidatePath } from "next/cache"
import { permanentRedirect, unauthorized } from "next/navigation"
import z from "zod"

export async function prepareAnalysis(input: HomeSchema) {
	const session = await getSession()
	if (!session) unauthorized()
	const formData = new FormData()
	formData.append("preset", input.preset.id)
	if (input.files.length) {
		for (const file of input.files) {
			formData.append("files", file.file)
		}
	} else {
		formData.append("text", input.text)
	}
	const { data, error } = await client.analysis.prepare.post({
		...input,
		files: input.files.map(({ file }) => file),
		preset: input.preset.id,
	})
	if (error) {
		console.error(error.value.summary)
		throw new Error("An error occurred when trying access analysis with id")
	}
	permanentRedirect(`/analysis/${data.id}`)
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
		revalidatePath("/analysis")
	})

export async function findAnalyses({
	q,
	page = "1",
	status,
}: {
	q?: string
	page?: string
	status?: string
}) {
	const prisma = await getPrisma()
	return prisma.analysis.findMany({
		where: {
			name: { contains: q, mode: "insensitive" },
			status: status as any,
		},
		include: { Preset: true },
		skip: (Number(page) - 1) * 10,
		take: 10,
		orderBy: [{ createdAt: "desc" }, { updatedAt: "desc" }],
	})
}

export async function findOneAnalysis(id: string) {
	const session = await getSession()
	if (!session) unauthorized()
	const { data, error } = await client.analysis({ id }).get()
	if (error) throw new Error(error.value.summary)
	return data
}

export async function findRecentAnalyses() {
	const prisma = await getPrisma()
	return prisma.analysis.findMany({
		orderBy: [{ createdAt: "desc" }],
		take: 5,
	})
}

export async function getStatusCount() {
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
		throw new Error("An error occurred when trying access analysis with id")
	}
	permanentRedirect(`/analysis/${data.id}`)
}
