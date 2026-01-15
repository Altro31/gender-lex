import { db } from "@repo/db/client"
import type { ModelCreateArgs } from "@repo/db/input"

const models = [
    {
        name: "Qwen3-1.7b",
        connection: {
            identifier: "qwen_qwen3-1.7b",
            url: "http://localhost:1234/v1",
        },

        settings: { temperature: 0.2 },
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
