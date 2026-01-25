import type { HonoVariables } from "@/lib/types/hono-variables"
import { UserProviderService } from "@/shared/user-provider.service"
import { startAnalysisWorkflow } from "@/workflows/start-analysis/workflow"
import { ORMErrorReason } from "@repo/db/client"
import { type Analysis } from "@repo/db/models"
import {
    AnalysisFindManyQueryParams,
    ChangeVisibilityInput,
    PrepareAnalyisisInput,
} from "@repo/types/dtos/analysis"
import { Effect, Stream } from "effect"
import { Hono, type TypedResponse } from "hono"
import { validator } from "hono-openapi"
import { streamSSE } from "hono/streaming"
import { getRun, start } from "workflow/api"
import { AnalysisService } from "./service"

const analysis = new Hono<HonoVariables>()
    .onError((e, c) => {
        console.log("Error catcher: ", e)
        return c.json({ error: true }, 200)
    })
    .post("/prepare", validator("form", PrepareAnalyisisInput), async c => {
        const runEffect = c.get("runEffect")
        const body = c.req.valid("form")

        const toAnalice = [] as {
            resource: File | string
            presetId: string | undefined
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
                        resource instanceof File ? resource.stream() : resource,
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
        const result = await runEffect(program)
        return c.json(result)
    })
    .get("/status-count", async c => {
        const runEffect = c.get("runEffect")
        const program = Effect.gen(function* () {
            const analysisService = yield* AnalysisService
            return yield* analysisService.statusCount()
        }).pipe(AnalysisService.provide)
        const result = await runEffect(program)
        return c.json(result)
    })
    .delete("/:id", async c => {
        const runEffect = c.get("runEffect")
        const id = c.req.param("id")
        const program = Effect.gen(function* () {
            const analysisService = yield* AnalysisService
            return yield* analysisService.delete(id!)
        }).pipe(AnalysisService.provide)

        const result = await runEffect(program)
        return c.json(result)
    })
    .get("/:id", async c => {
        const runEffect = c.get("runEffect")
        const id = c.req.param("id")
        c.json({})
        return streamSSE(
            c,
            async stream => {
                const program = Effect.gen(function* () {
                    const analysisService = yield* AnalysisService
                    const analysis = yield* analysisService.findOne(id)
                    if (analysis.status === "done") {
                        return Stream.toAsyncIterable(
                            Stream.fromIterable([analysis]),
                        )
                    }

                    const run = getRun<Analysis>(analysis.workflow)

                    const effectStream = Stream.fromAsyncIterable(
                        run.getReadable<Analysis>({ namespace: "update" }),
                        e => console.log(e),
                    ).pipe(Stream.tap(() => Effect.sleep(100)))

                    return Stream.toAsyncIterable(effectStream)
                }).pipe(
                    AnalysisService.provide,
                    Effect.catchTag(
                        "ClientError",
                        Effect.fn(function* (e) {
                            if (e.details.reason === ORMErrorReason.NOT_FOUND) {
                                stream.writeSSE({
                                    data: JSON.stringify(e.details),
                                })
                                stream.abort()
                            }
                        }),
                    ),
                )

                const asyncIterable = await runEffect(program)
                if (!asyncIterable) return
                for await (const update of asyncIterable) {
                    await stream.writeSSE({ data: JSON.stringify(update) })
                }
            },
            async (e, stream) => {
                stream.writeSSE({
                    event: "error",
                    data: JSON.stringify({ status: 404 }),
                })
            },
        ) as unknown as TypedResponse<Analysis, 200, "json">
    })
    .get("/", validator("query", AnalysisFindManyQueryParams), async c => {
        const runEffect = c.get("runEffect")
        const query = c.req.valid("query")
        const program = Effect.gen(function* () {
            const analysisService = yield* AnalysisService
            return yield* analysisService.findMany(query)
        }).pipe(AnalysisService.provide)

        const result = await runEffect(program)
        return c.json(result)
    })
    .post("/:id/redo", async c => {
        const runEffect = c.get("runEffect")
        const id = c.req.param("id")
        const program = Effect.gen(function* () {
            const analysisService = yield* AnalysisService
            return yield* analysisService.redo(id!)
        }).pipe(AnalysisService.provide)
        const result = await runEffect(program)
        return c.json(result)
    })
    .patch(
        "/:id/visibility",
        validator("json", ChangeVisibilityInput),
        async c => {
            const runEffect = c.get("runEffect")
            const { id } = c.req.param()
            const { visibility } = c.req.valid("json")

            const program = AnalysisService.pipe(
                Effect.andThen(service =>
                    service.changeVisibility(id, visibility),
                ),
                AnalysisService.provide,
            )
            const res = await runEffect(program)
            return c.json(res)
        },
    )

export default analysis
