import {
    InactiveModelError,
    InvalidModelApiKeyError,
    InvalidModelConnectionURLError,
    InvalidModelIdentifierError,
} from "@/modules/data/model/exceptions/tagged-errors"
import { SseService } from "@/modules/sse/service"
import { HttpService } from "@/shared/http.service"
import type { Model, ModelError, ModelStatus } from "@repo/db/models"
import type { ModelCreateArgs } from "@repo/db/input"
import { effectify } from "@repo/db/effect"

import { Chunk, Console, Effect, Match, Option, Stream } from "effect"
import { ModelRepository } from "./repository"
import { ModelNotFoundError } from "@/modules/data/model/error"

type ModelListResponse = { data: { id: string; active: boolean }[] }

export class ModelService extends Effect.Service<ModelService>()(
    "ModelService",
    {
        effect: Effect.gen(function* () {
            const sseService = yield* SseService
            const client = yield* HttpService
            const repository = yield* ModelRepository

            const services = {
                create(data: ModelCreateArgs["data"]) {
                    return Effect.gen(services, function* () {
                        const model = yield* effectify(
                            repository.create({ data }),
                        )
                        yield* this.testConnection(model.id)
                    })
                },
                testConnection: (id: string) =>
                    Effect.gen(services, function* () {
                        const model = yield* effectify(
                            repository.findUnique({ where: { id } }),
                        )
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
                            return yield* new InvalidModelIdentifierError()
                        }

                        if (!modelItem.active) {
                            return yield* new InactiveModelError()
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
                            ClientError: e => Console.log("ClientError", e),
                        }),
                        Effect.catchAll((e: any) => {
                            return services.updateModelStatus(
                                id,
                                "error",
                                e.modelError,
                            )
                        }),
                    ),

                testConnectionStream: (id: string) =>
                    Effect.gen(services, function* () {
                        const model = yield* effectify(
                            repository.findUnique({ where: { id } }),
                        ).pipe(Effect.catchAll(Console.error))
                        if (!model) {
                            return yield* new ModelNotFoundError()
                        }
                        const stream = Stream.asyncEffect<Model>(emit => {
                            const closeStream = () =>
                                emit(Effect.fail(Option.none()))
                            const updateModelStatus = (
                                status: ModelStatus,
                                error?: ModelError,
                            ) =>
                                Effect.gen(this, function* () {
                                    yield* this.updateModelStatus(
                                        id,
                                        status,
                                        error,
                                    ).pipe(
                                        Effect.andThen(() =>
                                            Effect.succeed(
                                                emit(
                                                    Effect.succeed(
                                                        Chunk.of({
                                                            ...model,
                                                            status,
                                                            error:
                                                                error ?? null,
                                                        }),
                                                    ),
                                                ),
                                            ),
                                        ),
                                        Effect.catchAll(Console.error),
                                    )
                                })

                            const program = Effect.gen(this, function* () {
                                yield* updateModelStatus("connecting")

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
                                        Effect.catchIf(
                                            e =>
                                                e._tag !==
                                                "InvalidModelApiKeyError",
                                            Console.error,
                                        ),
                                    )
                                if (!res)
                                    return yield* new InvalidModelConnectionURLError()

                                const modelItem = res.data.find(
                                    m => m.id === model.connection.identifier,
                                )

                                if (!modelItem) {
                                    return yield* new InvalidModelIdentifierError()
                                }

                                if (modelItem.active === false) {
                                    return yield* new InactiveModelError()
                                }

                                yield* updateModelStatus("active")
                            }).pipe(
                                Effect.catchIf(
                                    e => !!e.modelError,
                                    e =>
                                        Effect.gen(function* () {
                                            yield* updateModelStatus(
                                                "error",
                                                e.modelError,
                                            )
                                            closeStream()
                                        }),
                                ),
                                Effect.catchAll(Console.error),
                            )
                            return program.pipe(
                                Effect.tapBoth({
                                    onSuccess: () =>
                                        Effect.succeed(closeStream()),
                                    onFailure: () =>
                                        Effect.succeed(closeStream()),
                                }),
                            )
                        })
                        return stream
                    }).pipe(Effect.withSpan("testConnectionStream")),

                updateModelStatus: (
                    id: string,
                    status: ModelStatus,
                    error?: ModelError,
                ) =>
                    Effect.gen(function* () {
                        const model = yield* effectify(
                            repository.findUnique({ where: { id } }),
                        )
                        if (!model) {
                            throw new Error(`Model with id: ${id} not found`)
                        }
                        yield* effectify(
                            repository.update({
                                where: { id },
                                data: {
                                    ...model,
                                    status,
                                    error: error || null,
                                },
                            }),
                        )

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
            HttpService.Default,
            SseService.Default,
            ModelRepository.Default,
        ],
    },
) {
    static provide = Effect.provide(this.Default)
}
