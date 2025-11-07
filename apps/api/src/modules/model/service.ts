import {
    InactiveModelError,
    InvalidModelApiKeyError,
    InvalidModelIdentifierError,
} from "@/modules/model/exceptions/tagged-errors"
import { SseService } from "@/modules/sse/service"
import { ContextService } from "@/shared/context.service"
import { EnhancedPrismaService } from "@/shared/prisma.service"
import { FetchHttpClient, HttpClient } from "@effect/platform"
import type { ModelError, ModelStatus, Prisma } from "@repo/db/models"
import { Console, Effect, Layer, ManagedRuntime, Match } from "effect"

type ModelListResponse = { data: { id: string; active: boolean }[] }

export class ModelService extends Effect.Service<ModelService>()(
    "ModelService",
    {
        effect: Effect.gen(function* () {
            const sseService = yield* SseService
            const client = yield* HttpClient.HttpClient
            const prisma = yield* EnhancedPrismaService
            const repository = prisma.model

            const services = {
                repository,
                create(data: Prisma.ModelCreateInput) {
                    return Effect.gen(services, function* () {
                        const model = yield* repository.create({ data })
                        yield* this.testConnection(model.id)
                    })
                },
                testConnection: (id: string) =>
                    Effect.gen(services, function* () {
                        const model = yield* repository.findUnique({
                            where: { id },
                        })
                        if (!model) {
                            // status(404, `Model with id: ${id} not found`)
                            return
                        }
                        yield* this.updateModelStatus(id, "connecting")
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
                            return yield* Effect.fail(new InactiveModelError())
                        }

                        yield* this.updateModelStatus(id, "active")
                        return true
                    }).pipe(
                        Effect.catchTags({
                            RequestError: e => {
                                console.log(e)
                                return services.updateModelStatus(
                                    id,
                                    "error",
                                    "INVALID_CONNECTION_URL",
                                )
                            },
                            ResponseError: e => Console.log("ResponseError", e),
                            PrismaError: e => Console.log("PrismaError", e),
                        }),
                        Effect.catchAll((e: any) => {
                            return services.updateModelStatus(
                                id,
                                "error",
                                e.modelError,
                            )
                        }),
                    ),
                updateModelStatus: (
                    id: string,
                    status: ModelStatus,
                    error?: ModelError,
                ) =>
                    Effect.gen(function* () {
                        const model = yield* repository.findUnique({
                            where: { id },
                        })
                        if (!model) {
                            throw new Error(`Model with id: ${id} not found`)
                        }
                        yield* repository.update({
                            where: { id },
                            data: { ...model, status, error: error || null },
                        })

                        yield* sseService
                            .broadcast("model.status.change", {
                                id,
                                status,
                                message: error!,
                            } as any)
                            .pipe(Effect.fork)
                    }),
            }

            return services
        }),
        dependencies: [
            EnhancedPrismaService.Default,
            FetchHttpClient.layer,
            SseService.Default,
        ],
    },
) {
    static provide = Effect.provide(this.Default)
}

export function ModelRuntime(ctx: any) {
    return ManagedRuntime.make(
        Layer.mergeAll(ModelService.Default).pipe(
            Layer.provide(ContextService.Default(ctx)),
        ),
    )
}
