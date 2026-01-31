import type { HonoVariables } from "@/lib/types/hono-variables"
import { ModelService } from "@/modules/data/model/service"
import type { Model } from "@repo/db/models"
import { CreateModelInput } from "@repo/types/dtos/model"
import { Effect, Stream } from "effect"
import { Hono, type TypedResponse } from "hono"
import { validator } from "hono-openapi"
import { streamSSE } from "hono/streaming"

const model = new Hono<HonoVariables>()
    .post("/", validator("json", CreateModelInput), async c => {
        const runEffect = c.get("runEffect")
        const body = c.req.valid("json")
        const program = Effect.gen(function* () {
            const modelService = yield* ModelService
            yield* modelService.create(body)
            return { ok: true } as const
        }).pipe(ModelService.provide)
        const result = await runEffect(program)
        return c.json(result)
    })
    .post("/:id/test-connection", async c => {
        const runEffect = c.get("runEffect")
        const id = c.req.param("id")
        const program = Effect.gen(function* () {
            const modelService = yield* ModelService
            const res = yield* modelService.testConnection(id)
            return Boolean(res)
        }).pipe(ModelService.provide)
        const result = await runEffect(program)
        return c.json(result)
    })
    .post("/:id/test-connection/stream", async c => {
        const runEffect = c.get("runEffect")
        const id = c.req.param("id")
        const program = Effect.gen(function* () {
            const modelService = yield* ModelService
            return yield* modelService.testConnectionStream(id)
        }).pipe(ModelService.provide)
        const result = await runEffect(program)
        return streamSSE(c, async stream => {
            for await (const update of Stream.toAsyncIterable(result)) {
                await Promise.all([
                    stream.writeSSE({ data: JSON.stringify(update) }),
                    stream.sleep(1000),
                ])
            }
        }) as unknown as TypedResponse<Model, 200, "json">
    })

export default model
