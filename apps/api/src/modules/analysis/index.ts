import { analysisModels } from "@/modules/analysis/model"
import { effectPlugin } from "@/plugins/effect.plugin"
import { UserProviderService } from "@/shared/user-provider.service"
import { startAnalysisWorkflow } from "@/workflows/start-analysis"
import { Chunk, Console, Effect, Stream } from "effect"
import Elysia, { sse } from "elysia"
import { getRun, start } from "workflow/api"
import { AnalysisService } from "./service"
import type { Analysis } from "@repo/db/models"

export default new Elysia({
    name: "analysis.controller",
    tags: ["Analysis"],
    prefix: "analysis",
})
    .use(effectPlugin)
    .model(analysisModels)
    .post(
        "prepare",
        ({ body, runEffect }) => {
            const toAnalice = [] as {
                resource: File | string
                presetId: string
            }[]
            if (body.files?.length) {
                for (const file of body.files) {
                    toAnalice.push({
                        resource: file,
                        presetId: body.selectedPreset,
                    })
                }
            }
            if (body.text) {
                toAnalice.push({
                    resource: body.text,
                    presetId: body.selectedPreset,
                })
            }
            const program = Effect.gen(function* () {
                const { user } = yield* UserProviderService

                const id = yield* Effect.async<string>(resume => {
                    toAnalice.forEach(async ({ resource, presetId }) => {
                        const run = await start(startAnalysisWorkflow, [
                            resource instanceof File
                                ? resource.stream()
                                : resource,
                            { presetId },
                            { user },
                        ])
                        for await (const event of run.getReadable<string>({
                            namespace: "id",
                        })) {
                            resume(Effect.succeed(event))
                            break
                        }
                    })
                })

                return { id }
            }).pipe(AnalysisService.provide)
            return runEffect(program)
        },
        { body: "prepareInput" },
    )

    .get(
        "status-count",
        ({ runEffect }) => {
            const program = Effect.gen(function* () {
                const analysisService = yield* AnalysisService
                return yield* analysisService.statusCount()
            }).pipe(AnalysisService.provide)
            return runEffect(program)
        },
        { response: "statusCountOutput" },
    )

    .delete(":id", async ({ params, runEffect }) => {
        const program = Effect.gen(function* () {
            const analysisService = yield* AnalysisService
            return yield* analysisService.delete(params.id!)
        }).pipe(AnalysisService.provide)

        return runEffect(program)
    })

    .get(":id", async function* ({ runEffect, params }) {
        const program = Effect.gen(function* () {
            const analysisService = yield* AnalysisService
            const analysis = yield* analysisService.findOne(params.id!)
            const run = getRun(analysis.workflow)

            const stream = Stream.fromAsyncIterable(
                run.getReadable<Analysis>({ namespace: "update" }),
                e => console.log(e),
            )

            return Stream.toAsyncIterable(stream)
        }).pipe(AnalysisService.provide)
        const stream = await runEffect(program)
        for await (const update of stream) {
            const data = sse({ data: update })
            yield data as { data: Analysis }
        }
    })

    .get(
        "",
        ({ runEffect, query }) => {
            const program = Effect.gen(function* () {
                const analysisService = yield* AnalysisService
                return yield* analysisService.findMany(query)
            }).pipe(AnalysisService.provide)

            return runEffect(program)
        },
        { query: "findManyQueryParams" },
    )

    .post(
        ":id/redo",
        ({ runEffect, params }) => {
            const program = Effect.gen(function* () {
                const analysisService = yield* AnalysisService
                return yield* analysisService.redo(params.id!)
            }).pipe(AnalysisService.provide)
            return runEffect(program)
        },
        // { response: 'redoOutput' },
    )
