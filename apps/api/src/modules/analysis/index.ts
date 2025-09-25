import { analysisModels } from "@/modules/analysis/model"
import { analysisService } from "@/modules/analysis/service"
import Elysia, { t } from "elysia"

export default new Elysia({
    name: "analysis.controller",
    tags: ["Analysis"],
    prefix: "analysis",
})
    .use(analysisService)
    .model(analysisModels)
    .post(
        "prepare",
        ({ analysisService, body }) => {
            const toAnalice = [] as { input: File | string; preset: string }[]
            if (body.files.length) {
                for (const file of body.files) {
                    toAnalice.push({ input: file, preset: body.selectedPreset })
                }
            }
            if (body.text) {
                toAnalice.push({
                    input: body.text,
                    preset: body.selectedPreset,
                })
            }
            return Promise.race(
                toAnalice.map(i => analysisService.prepare(i.input, i.preset)),
            )
        },
        { body: "prepareInput", response: "prepareOutput" },
    )

    .post(
        "start/:id",
        ({ analysisService, params }) => analysisService.start(params.id),
        { response: { 200: "startOutput", 404: t.String() } },
    )

    .get(
        "status-count",
        ({ analysisService }) => analysisService.statusCount(),
        { response: "statusCountOutput" },
    )

    .delete(":id", async ({ analysisService, params }) => {
        analysisService.delete(params.id!)
    })

    .get(
        ":id",
        ({ analysisService, params }) => analysisService.findOne(params.id),
        { response: "findOneOutput" },
    )

    .get("", ({ analysisService, query }) => analysisService.findMany(query), {
        query: "findManyQueryParams",
    })

    .post(
        ":id/redo",
        ({ analysisService, params }) => analysisService.redo(params.id),
        { response: "redoOutput" },
    )
