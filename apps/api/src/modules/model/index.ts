import { modelModels } from "@/modules/model/model"
import { ModelRuntime, ModelService } from "@/modules/model/service"
import { Effect } from "effect"
import Elysia, { t } from "elysia"

export default new Elysia({
    name: "model.controller",
    tags: ["Model"],
    prefix: "model",
})
    .model(modelModels)
    .post(
        "",
        ctx => {
            const program = Effect.gen(function* () {
                const modelService = yield* ModelService
                yield* modelService.create(ctx.body)
                return { ok: true } as const
            })
            return ModelRuntime(ctx).runPromise(program)
        },
        { body: "createModelInput", response: "createModelOutput" },
    )
    .post(
        ":id/test-connection",
        ctx => {
            const program = Effect.gen(function* () {
                const modelService = yield* ModelService
                const res = yield* modelService.testConnection(ctx.params.id)
                return Boolean(res)
            })
            return ModelRuntime(ctx).runPromise(program)
        },
        { response: { 200: "testConnectionOutput", 404: t.String() } },
    )
