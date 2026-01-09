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
                text: z.string().optional().describe("Text content to analyze for gender bias"),
                files: z.file().array().optional().describe("Files to analyze (PDF or text documents)"),
                selectedPreset: z.string().describe("ID of the preset to use for analysis"),
            }),
            {
                tags: ["Analysis"],
                summary: "Prepare and start a new analysis",
                description: "Upload text or files for gender bias analysis. Initiates an analysis workflow using the specified preset.",
                responses: {
                    200: {
                        description: "Analysis successfully initiated",
                        content: {
                            "application/json": {
                                schema: z.object({
                                    id: z.string().describe("ID of the created analysis")
                                })
                            }
                        }
                    }
                }
            }
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
    .get(
        "/status-count", 
        validator(
            "query",
            z.object({}),
            {
                tags: ["Analysis"],
                summary: "Get analysis status counts",
                description: "Returns the count of analyses grouped by status (pending, processing, completed, failed)",
                responses: {
                    200: {
                        description: "Status counts retrieved successfully",
                        content: {
                            "application/json": {
                                schema: z.record(z.string(), z.number())
                            }
                        }
                    }
                }
            }
        ),
        async c => {
        const runEffect = c.get("runEffect")
        const program = Effect.gen(function* () {
            const analysisService = yield* AnalysisService
            return yield* analysisService.statusCount()
        }).pipe(AnalysisService.provide)
        const result = await runEffect(program)
        return c.json(result)
    })
    .delete(
        "/:id", 
        validator(
            "param",
            z.object({
                id: z.string().describe("ID of the analysis to delete")
            }),
            {
                tags: ["Analysis"],
                summary: "Delete an analysis",
                description: "Permanently delete an analysis by its ID",
                responses: {
                    200: {
                        description: "Analysis deleted successfully"
                    }
                }
            }
        ),
        async c => {
        const runEffect = c.get("runEffect")
        const id = c.req.param("id")
        const program = Effect.gen(function* () {
            const analysisService = yield* AnalysisService
            return yield* analysisService.delete(id!)
        }).pipe(AnalysisService.provide)

        const result = await runEffect(program)
        return c.json(result)
    })

    .get(
        "/:id",
        validator(
            "param",
            z.object({
                id: z.string().describe("ID of the analysis to retrieve")
            }),
            {
                tags: ["Analysis"],
                summary: "Stream analysis updates (SSE)",
                description: "Server-Sent Events endpoint that streams real-time analysis updates",
                responses: {
                    200: {
                        description: "SSE stream of analysis updates",
                        content: {
                            "text/event-stream": {
                                schema: z.any()
                            }
                        }
                    }
                }
            }
        ),
        async c => {
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
                q: z.string().optional().describe("Search query to filter analyses"),
                page: z.coerce.number().int().optional().describe("Page number for pagination"),
                status: z.enum(AnalysisStatus).optional().describe("Filter by analysis status"),
            }),
            {
                tags: ["Analysis"],
                summary: "List analyses",
                description: "Retrieve a paginated list of analyses with optional filters",
                responses: {
                    200: {
                        description: "List of analyses retrieved successfully",
                        content: {
                            "application/json": {
                                schema: z.object({
                                    data: z.array(z.any()),
                                    pagination: z.object({
                                        page: z.number(),
                                        totalPages: z.number(),
                                        totalItems: z.number()
                                    })
                                })
                            }
                        }
                    }
                }
            }
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

    .post(
        "/:id/redo",
        validator(
            "param",
            z.object({
                id: z.string().describe("ID of the analysis to redo")
            }),
            {
                tags: ["Analysis"],
                summary: "Redo an analysis",
                description: "Restart a completed or failed analysis with the same parameters",
                responses: {
                    200: {
                        description: "Analysis successfully restarted",
                        content: {
                            "application/json": {
                                schema: z.object({
                                    id: z.string()
                                })
                            }
                        }
                    }
                }
            }
        ),
        async c => {
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
