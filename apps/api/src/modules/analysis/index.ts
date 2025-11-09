import { analysisModels } from "@/modules/analysis/model"
import { Effect } from "effect"
import Elysia, { t } from "elysia"
import { AnalysisService } from "./service"
import { effectPlugin } from "@/lib/effect"

export default new Elysia({
    name: "analysis.controller",
    tags: ["Analysis"],
    prefix: "analysis",
})
    .use(effectPlugin)
    .model(analysisModels)
    .post(
        "prepare",
        ({ body, runtime }) => {
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
            const program = Effect.gen(function* () {
                const analysisService = yield* AnalysisService
                return yield* Effect.raceAll(
                    toAnalice.map(i =>
                        analysisService.prepare(i.input, i.preset),
                    ),
                )
            }).pipe(AnalysisService.provide)
            return runtime.runPromise(program)
        },
        { body: "prepareInput", response: "prepareOutput" },
    )

    .post(
        "start/:id",
        ({ runtime, params }) => {
            const program = Effect.gen(function* () {
                const analysisService = yield* AnalysisService
                return (yield* analysisService.start(params.id)) as any
            }).pipe(AnalysisService.provide)
            return runtime.runPromise(program)
        },
        { response: { 200: "startOutput", 404: t.String() } },
    )

    .get(
        "status-count",
        ({ runtime }) => {
            const program = Effect.gen(function* () {
                const analysisService = yield* AnalysisService
                return yield* analysisService.statusCount()
            }).pipe(AnalysisService.provide)
            return runtime.runPromise(program)
        },
        { response: "statusCountOutput" },
    )

    .delete(":id", async ({ params, runtime }) => {
        const program = Effect.gen(function* () {
            const analysisService = yield* AnalysisService
            return yield* analysisService.delete(params.id!)
        }).pipe(AnalysisService.provide)

        return runtime.runPromise(program)
    })

    .get(
        ":id",
        ({ runtime, params }) => {
            const program = Effect.gen(function* () {
                const analysisService = yield* AnalysisService
                return (yield* analysisService.findOne(params.id)) as any
            }).pipe(AnalysisService.provide)

            return runtime.runPromise(program)
        },
        { response: "findOneOutput" },
    )

    .get(
        "",
        ({ runtime, query }) => {
            const program = Effect.gen(function* () {
                const analysisService = yield* AnalysisService
                return yield* analysisService.findMany(query)
            }).pipe(AnalysisService.provide)

            return runtime.runPromise(program)
        },
        { query: "findManyQueryParams" },
    )

    .post(
        ":id/redo",
        ({ runtime, params }) => {
            const program = Effect.gen(function* () {
                const analysisService = yield* AnalysisService
                return yield* analysisService.redo(params.id)
            }).pipe(AnalysisService.provide)

            return runtime.runPromise(program)
        },
        { response: "redoOutput" },
    )
