import { ModelStatus } from "@repo/db/models"
import type { MessageMapper } from "@repo/types/sse"
import { t } from "elysia"

export const sseModels = {
    "model.status.change": t.Object({
        id: t.String(),
        status: t.Enum(ModelStatus),
        message: t.Optional(t.String()),
    }),
} satisfies Record<keyof MessageMapper, any>
