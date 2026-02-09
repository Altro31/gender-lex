import { ModelStatus } from "@repo/db/models"
import type { MessageMapper } from "@repo/types/sse"
import z from "zod"

export const sseModels = {
    "model.status.change": z.object({
        id: z.string(),
        status: z.nativeEnum(ModelStatus),
        message: z.string().optional(),
    }),
    "model:test-started": z.object({
        modelId: z.string(),
    }),
} satisfies Record<keyof MessageMapper, any>
