import { db } from "@repo/db/client"
import type { ModelCreateArgs } from "@repo/db/input"

const models = [
    {
        name: "Qwen3-32b",
        connection: {
            identifier: "qwen/qwen3-32b",
            url: "https://api.groq.com/openai/v1",
        },

        settings: { temperature: 0.2 },
        apiKey: process.env.GROQ_API_KEY,
        isDefault: true,
    },
    {
        name: "GPT-OSS-120b",
        connection: {
            identifier: "openai/gpt-oss-120b",
            url: "https://api.groq.com/openai/v1",
        },

        settings: { temperature: 0.2 },
        apiKey: process.env.GROQ_API_KEY,
        isDefault: true,
    },
    {
        name: "Deepseek-R1-32b",
        connection: {
            identifier: "deepseek-r1-distill-qwen-32b",
            url: "https://api.groq.com/openai/v1",
        },

        settings: { temperature: 0.2 },
        apiKey: process.env.GROQ_API_KEY,
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
