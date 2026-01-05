import { db } from "@repo/db/client"
import type { ModelCreateArgs } from "@repo/db/input"

const models = [
    {
        name: "Gemini-2.5 flash",
        connection: {
            identifier: "gemini-2.5-flash",
            url: "https://generativelanguage.googleapis.com/v1beta",
        },

        settings: { temperature: 0.2 },
        apiKey: process.env.GEMINI_API_KEY,
        isDefault: true,
    },
] satisfies ModelCreateArgs["data"][]

await db.$transaction(async tx => {
    const [model] = await Promise.all(
        models.map(async model => {
            const exist = await tx.model.findFirst({
                where: { name: model.name, isDefault: true },
                select: { id: true, apiKey: true },
            })
            if (exist) return Promise.resolve(exist)
            return tx.model.create({ data: model })
        }),
    )

    const defaultPreset = await tx.preset.findFirst({
        where: { isDefault: true },
        select: { id: true },
    })
    if (!defaultPreset) {
        await tx.preset.create({
            data: {
                name: "Default",
                description: "Default preset",
                isDefault: true,
                Models: {
                    create: {
                        role: "primary",
                        isDefault: true,
                        Model: { connect: { id: model?.id } },
                    },
                },
            },
        })
    }
})

console.log("Set defaults models and presets")
