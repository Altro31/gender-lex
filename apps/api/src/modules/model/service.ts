import prisma, { rawPrisma } from "@/lib/prisma"
import {
    InactiveModelError,
    InvalidModelApiKeyError,
    InvalidModelIdentifierError,
} from "@/modules/model/exceptions/tagged-errors"
import { sseService } from "@/modules/sse/service"
import { FetchHttpClient, HttpClient } from "@effect/platform"
import type { $Enums, Prisma } from "@repo/db/models"
import { Console, Effect, Match } from "effect"
import Elysia, { env } from "elysia"

type ModelListResponse = { data: { id: string; active: boolean }[] }

export const modelService = new Elysia({ name: "model.service" })
    .use(prisma)
    .use(sseService)
    .derive({ as: "global" }, ({ prisma, status, sseService }) => {
        const repository = prisma!.model
        return {
            modelService: {
                async create(data: Prisma.ModelCreateInput) {
                    const model = await repository.create({ data })
                    this.testConnection(model.id).then(() => {})
                },

                async testConnection(id: string) {
                    const model = await repository.findUnique({ where: { id } })
                    if (!model) {
                        return status(404, `Model with id: ${id} not found`)
                    }
                    await this.updateModelStatus(id, "connecting")

                    const testConnectionProgram = Effect.gen(
                        this,
                        function* () {
                            const client = yield* HttpClient.HttpClient
                            const url = model.connection.url + "/models"

                            const res = yield* client
                                .get(url, {
                                    headers: {
                                        Authorization: `Bearer ${model.apiKey}`,
                                    },
                                })
                                .pipe(
                                    Effect.andThen(res => {
                                        const reqMatcher =
                                            Match.type<number>().pipe(
                                                Match.when(401, () =>
                                                    Effect.fail(
                                                        new InvalidModelApiKeyError(),
                                                    ),
                                                ),
                                                Match.orElse(
                                                    () =>
                                                        res.json as Effect.Effect<
                                                            ModelListResponse,
                                                            never,
                                                            never
                                                        >,
                                                ),
                                            )
                                        return reqMatcher(res.status)
                                    }),
                                )

                            const modelItem = res.data.find(
                                m => m.id === model.connection.identifier,
                            )

                            if (!modelItem) {
                                return yield* Effect.fail(
                                    new InvalidModelIdentifierError(),
                                )
                            }

                            if (!modelItem.active) {
                                return yield* Effect.fail(
                                    new InactiveModelError(),
                                )
                            }

                            yield* Effect.promise(() =>
                                this.updateModelStatus(id, "active"),
                            )
                            return true
                        },
                    )
                        .pipe(
                            Effect.catchTags({
                                RequestError: () =>
                                    Effect.promise(() =>
                                        this.updateModelStatus(
                                            id,
                                            "error",
                                            "INVALID_CONNECTION_URL",
                                        ),
                                    ),
                                ResponseError: e =>
                                    Console.log("ResponseError", e),
                            }),
                            Effect.catchAll(e => {
                                return Effect.promise(() =>
                                    this.updateModelStatus(
                                        id,
                                        "error",
                                        e.modelError,
                                    ),
                                )
                            }),
                        )
                        .pipe(Effect.provide(FetchHttpClient.layer))

                    const res = await Effect.runPromise(
                        testConnectionProgram as any,
                    )
                    return Boolean(res)
                },

                async updateModelStatus(
                    id: string,
                    status: $Enums.ModelStatus,
                    error?: $Enums.ModelError,
                ) {
                    await repository.update({
                        where: { id },
                        data: { status, error: error || null },
                    })
                    sseService!.broadcast("model.status.change", {
                        id,
                        status,
                        message: error!,
                    } as any)
                },
            },
        }
    })
    .onStart(async app => {
        const models = [
            {
                name: "Qwen3-32b",
                connection: {
                    identifier: "qwen/qwen3-32b",
                    url: "https://api.groq.com/openai/v1",
                },

                settings: { temperature: 0.2 },
                apiKey: env.GROQ_API_KEY,
                isDefault: true,
            },
            {
                name: "GPT-OSS-120b",
                connection: {
                    identifier: "openai/gpt-oss-120b",
                    url: "https://api.groq.com/openai/v1",
                },

                settings: { temperature: 0.2 },
                apiKey: env.GROQ_API_KEY,
                isDefault: true,
            },
            {
                name: "Deepseek-R1-32b",
                connection: {
                    identifier: "deepseek-r1-distill-qwen-32b",
                    url: "https://api.groq.com/openai/v1",
                },

                settings: { temperature: 0.2 },
                apiKey: env.GROQ_API_KEY,
                isDefault: true,
            },
        ] satisfies Prisma.ModelCreateInput[]

        await rawPrisma.$transaction(async tx => {
            const [model] = await Promise.all(
                models.map(async data => {
                    let model = await tx.model.findFirst({
                        where: { name: data.name, isDefault: true },
                    })
                    if (model)
                        model = await tx.model.update({
                            where: { id: model.id },
                            data,
                        })
                    else model = await tx.model.create({ data })
                    return model
                }),
            )

            const defaultPreset = await tx.preset.findFirst({
                where: { isDefault: true },
            })
            if (!defaultPreset) {
                await tx.preset.create({
                    data: {
                        name: "Default",
                        description: "Default preset",
                        isDefault: true,
                        Models: {
                            create: {
                                role: "primary",
                                isDefault: true,
                                Model: { connect: { id: model!.id } },
                            },
                        },
                    },
                })
            }
        })
    })
