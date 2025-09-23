import { modelModels } from "@/modules/model/model"
import { modelService } from "@/modules/model/service"
import Elysia, { t } from "elysia"

export default new Elysia({
    name: "model.controller",
    tags: ["Model"],
    prefix: "model",
})
    .use(modelService)
    .model(modelModels)
    .post(
        "",
        async ({ modelService, body }) => {
            await modelService.create(body)
            return { ok: true }
        },
        { body: "createModelInput", response: "createModelOutput" },
    )
    .post(
        ":id/test-connection",
        async ({ modelService, params }) =>
            await modelService.testConnection(params.id),
        { response: { 200: "testConnectionOutput", 404: t.String() } },
    )
