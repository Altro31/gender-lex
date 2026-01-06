import { ModelStatus } from "@repo/db/models"
import type { MessageMapper } from "@repo/types/sse"
import z from "zod"

export const sseModels = {
    "model.status.change": z.object({
        id: z.string(),
        status: z.nativeEnum(ModelStatus),
        message: z.string().optional(),
    }),
} satisfies Record<keyof MessageMapper, any>
