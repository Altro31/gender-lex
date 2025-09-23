import { ModelCreateSchema } from "@repo/db/zod"
import { t } from "elysia"

export const modelModels = {
    createModelInput: ModelCreateSchema.pick({
        apiKey: true,
        connection: true,
        name: true,
        settings: true,
    }),
    createModelOutput: t.Object({ ok: t.Literal(true) }),
    testConnectionOutput: t.Boolean(),
}
