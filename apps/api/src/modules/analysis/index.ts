import { UserProviderService } from "@/shared/user-provider.service"
import { startAnalysisWorkflow } from "@/workflows/start-analysis/workflow"
import { AnalysisStatus, type Analysis } from "@repo/db/models"
import { Effect, Schedule, Stream } from "effect"
import { Hono } from "hono"
import { streamSSE } from "hono/streaming"
import { getRun, start } from "workflow/api"
import { AnalysisService } from "./service"
import { validator } from "hono-openapi"
import z from "zod"
import type { HonoVariables } from "@/lib/types/hono-variables"

const analysis = new Hono<HonoVariables>()
    .post(
        "/prepare",
        validator(
            "form",
            z.object({
                text: z.string().optional(),
                files: z.file().array().optional(),
                selectedPreset: z.string(),
            }),
        ),

        async c => {
            const runEffect = c.get("runEffect")
            const body = c.req.valid("form")

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
            const result = await runEffect(program)
            return c.json(result)
        },
    )
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

        return streamSSE(c, async stream => {
            const program = Effect.gen(function* () {
                const analysisService = yield* AnalysisService
                const analysis = yield* analysisService.findOne(id!)
                const run = getRun(analysis.workflow)

                const effectStream = Stream.fromAsyncIterable(
                    run.getReadable<Analysis>({ namespace: "update" }),
                    e => console.log(e),
                ).pipe(Stream.tap(() => Effect.sleep(100)))

                return Stream.toAsyncIterable(effectStream)
            }).pipe(AnalysisService.provide)

            const asyncIterable = await runEffect(program)
            for await (const update of asyncIterable) {
                await stream.writeSSE({ data: JSON.stringify(update) })
            }
        })
    })

    .get(
        "/",
        validator(
            "query",
            z.object({
                q: z.string().optional(),
                page: z.coerce.number().int().optional(),
                status: z.enum(AnalysisStatus).optional(),
            }),
        ),
        async c => {
            const runEffect = c.get("runEffect")
            const query = c.req.query()
            const program = Effect.gen(function* () {
                const analysisService = yield* AnalysisService
                return yield* analysisService.findMany(query)
            }).pipe(AnalysisService.provide)

            const result = await runEffect(program)
            return c.json(result)
        },
    )

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

export default analysis
export type AnalysisAppType = typeof analysis
