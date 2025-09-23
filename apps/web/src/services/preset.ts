"use server"

import { getPrisma } from "@/lib/prisma/client"
import { actionClient } from "@/lib/safe-action"
import { PresetSchema } from "@/sections/preset/form/preset-schema"
import type { Route } from "next"
import { revalidatePath } from "next/cache"
import { z } from "zod/mini"

export async function findPresets({ page, q }: { page: number; q?: string }) {
	const prisma = await getPrisma()

	return prisma.preset.findMany({
		where: { name: { contains: q, mode: "insensitive" } },
		skip: (page - 1) * 10,
		take: 10,
		include: { Models: { include: { Model: true } } },
		orderBy: [{ createdAt: "desc" }, { updatedAt: "desc" }],
	})
}

export const createPreset = actionClient
	.inputSchema(PresetSchema)
	.action(async ({ parsedInput: { Models, ...rest } }) => {
		const prisma = await getPrisma()
		const data = await prisma.preset.create({
			data: {
				...rest,
				Models: {
					create: Models.map((model) => ({
						role: model.role,
						Model: { connect: { id: model.Model.id } },
					})),
				},
			},
		})

		revalidatePath("/presets" as Route, "page")

		return {
			success: true,
			data,
		}
	})

export const editPreset = actionClient
	.inputSchema(z.tuple([z.string(), PresetSchema]))
	.action(async ({ parsedInput: [id, { Models, ...rest }] }) => {
		const prisma = await getPrisma()

		const data = await prisma.$transaction(async (tx) => {
			await prisma.preset.update({
				where: { id },
				data: {
					Models: {
						deleteMany: {},
					},
				},
				select: { id: true },
			})
			return prisma.preset.update({
				where: { id },
				data: {
					...rest,
					Models: {
						create: Models.map((model) => ({
							role: model.role,
							Model: { connect: { id: model.Model.id } },
						})),
					},
				},
				select: { id: true },
			})
		})

		revalidatePath("/presets" as Route, "page")

		return {
			success: true,
			data,
		}
	})

export const deletePreset = actionClient
	.inputSchema(z.string())
	.action(async ({ parsedInput: id }) => {
		const prisma = await getPrisma()

		await prisma.preset.delete({ where: { id } })

		revalidatePath("/presets" as Route, "page")

		return {
			success: true,
		}
	})

export const clonePreset = actionClient
	.inputSchema(z.string())
	.action(async ({ parsedInput: id }) => {
		const prisma = await getPrisma()
		const { Models, ...rest } = await prisma.preset.findUniqueOrThrow({
			where: { id },
			omit: {
				id: true,
				createdAt: true,
				isDefault: true,
				updatedAt: true,
				usedAt: true,
				userId: true,
			},
			include: {
				Models: {
					// select: { role: true, Model: { select: { id: true } } },
					include: { Model: true },
				},
			},
		})

		const cloned = await prisma.preset.create({
			data: {
				name: rest.name + " (Copy)",
				description: rest.description,
				Models: {
					create: Models.map((pm) => ({
						role: pm.role,
						Model: { connect: { id: pm.modelId } },
					})),
				},
			},
		})

		revalidatePath("/presets" as Route, "page")

		return {
			success: true,
			data: cloned,
		}
	})

export const getPresetsSelect = async ({ page }: { page: number }) => {
	const prisma = await getPrisma()

	return prisma.preset.findMany({
		skip: page * 20,
		take: 20,
	})
}

export const getLastUsedPreset = async () => {
	const prisma = await getPrisma()

	return prisma.preset.findFirst({
		orderBy: [{ usedAt: "desc" }],
	})
}
