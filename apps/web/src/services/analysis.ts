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
	const { data, error } = await client.POST("/analysis/prepare", {
		body: formData as any,
	})
	if (!data) {
		console.error(error)
		throw new Error("An error occurred when trying access analysis with id")
	}
	permanentRedirect(`/analysis/${data.id}`)
}

export async function startAnalysis(id: string) {
	const session = await getSession()
	if (!session) unauthorized()
	const { data, error } = await client.POST("/analysis/start/{id}", {
		params: { path: { id } },
	})
	if (error) {
		console.error(error)
		throw new Error("An error occurred when trying access analysis with id")
	}

	return data as unknown as Analysis
}

export const deleteAnalysis = actionClient
	.inputSchema(z.string())
	.action(async ({ parsedInput: id }) => {
		const session = await getSession()
		if (!session) unauthorized()
		await client.DELETE("/zen/analysis/{id}", {
			params: { path: { id } },
		})
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
	return client.GET("/zen/analysis/{id}", {
		params: { path: { id }, query: { include: "Presets" } },
	})
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
	return client.GET("/analysis/status-count")
}

export async function redoAnalysis(id: string) {
	const session = await getSession()
	if (!session) unauthorized()
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
