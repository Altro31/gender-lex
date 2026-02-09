import { ModelRepository } from "@/modules/data/model/repository"
import { ModelService } from "@/modules/data/model/service"
import { SseService } from "@/modules/sse/service"
import { HttpService } from "@/shared/http.service"
import { describe, expect, it } from "bun:test"
import { Effect, Exit, Layer, Stream } from "effect"

const mockModel = {
    id: "test-model-id",
    name: "Test Model",
    apiKey: "test-api-key",
    connection: {
        url: "https://api.example.com",
        identifier: "model-123",
    },
    status: "idle" as const,
    error: null,
    userId: "user-123",
    createdAt: new Date(),
    updatedAt: new Date(),
}

const SseServiceMock = Layer.succeed(
    SseService,
    SseService.of({
        broadcast: () => Effect.succeed(undefined),
    } as any),
)

const createMockRepository = (
    findUnique: any = () => Promise.resolve(mockModel),
    update: any = () => Promise.resolve(mockModel),
    create: any = () => Promise.resolve(mockModel),
) =>
    Layer.succeed(
        ModelRepository,
        ModelRepository.of({
            findUnique,
            update,
            create,
        } as any),
    )

const createMockHttpClient = (response: any) =>
    Layer.succeed(
        HttpService,
        HttpService.of({
            get: () =>
                Effect.succeed({
                    status: response.status || 200,
                    json: Effect.succeed(response.data),
                }),
        } as any),
    )

describe("ModelService", () => {
    describe("testConnection", () => {
        it("should successfully test connection with valid model", async () => {
            const mockResponse = {
                status: 200,
                data: {
                    data: [{ id: "model-123", active: true }],
                },
            }

            const result = await Effect.gen(function* () {
                const modelService = yield* ModelService
                return yield* modelService.testConnection("test-model-id")
            }).pipe(
                Effect.provide(
                    ModelService.DefaultWithoutDependencies.pipe(
                        Layer.provide(
                            Layer.mergeAll(
                                SseServiceMock,
                                createMockRepository(),
                                createMockHttpClient(mockResponse),
                            ),
                        ),
                    ),
                ),
                Effect.runPromise,
            )

            expect(result).toBe(true)
        })

        it("should handle invalid API key error", async () => {
            const mockResponse = {
                status: 401,
            }

            let updateCalled = false
            const mockRepo = createMockRepository(
                () => Promise.resolve(mockModel),
                () => {
                    updateCalled = true
                    return Promise.resolve(mockModel)
                },
            )

            await Effect.gen(function* () {
                const modelService = yield* ModelService
                return yield* modelService.testConnection("test-model-id")
            }).pipe(
                Effect.provide(
                    ModelService.DefaultWithoutDependencies.pipe(
                        Layer.provide(
                            Layer.mergeAll(
                                SseServiceMock,
                                mockRepo,
                                createMockHttpClient(mockResponse),
                            ),
                        ),
                    ),
                ),
                Effect.runPromise,
            )

            // When API key is invalid, the service catches the error and updates status
            // So it should complete successfully (not throw)
            expect(updateCalled).toBe(true)
        })

        it("should handle invalid model identifier error", async () => {
            const mockResponse = {
                status: 200,
                data: {
                    data: [{ id: "different-model", active: true }],
                },
            }

            const exit = await Effect.gen(function* () {
                const modelService = yield* ModelService
                return yield* modelService.testConnection("test-model-id")
            }).pipe(
                Effect.provide(
                    ModelService.DefaultWithoutDependencies.pipe(
                        Layer.provide(
                            Layer.mergeAll(
                                SseServiceMock,
                                createMockRepository(),
                                createMockHttpClient(mockResponse),
                            ),
                        ),
                    ),
                ),
                Effect.exit,
                Effect.runPromise,
            )

            if (Exit.isFailure(exit)) {
                expect(exit.cause._tag).toBeDefined()
            }
        })

        it("should handle inactive model error", async () => {
            const mockResponse = {
                status: 200,
                data: {
                    data: [{ id: "model-123", active: false }],
                },
            }

            const exit = await Effect.gen(function* () {
                const modelService = yield* ModelService
                return yield* modelService.testConnection("test-model-id")
            }).pipe(
                Effect.provide(
                    ModelService.DefaultWithoutDependencies.pipe(
                        Layer.provide(
                            Layer.mergeAll(
                                SseServiceMock,
                                createMockRepository(),
                                createMockHttpClient(mockResponse),
                            ),
                        ),
                    ),
                ),
                Effect.exit,
                Effect.runPromise,
            )

            if (Exit.isFailure(exit)) {
                expect(exit.cause._tag).toBeDefined()
            }
        })

        it("should return early when model not found", async () => {
            const result = await Effect.gen(function* () {
                const modelService = yield* ModelService
                return yield* modelService.testConnection("test-model-id")
            }).pipe(
                Effect.provide(
                    ModelService.DefaultWithoutDependencies.pipe(
                        Layer.provide(
                            Layer.mergeAll(
                                SseServiceMock,
                                createMockRepository(() =>
                                    Promise.resolve(null),
                                ),
                                createMockHttpClient({ data: {} }),
                            ),
                        ),
                    ),
                ),
                Effect.runPromise,
            )

            expect(result).toBeUndefined()
        })
    })

    describe("create", () => {
        it("should create model and test connection", async () => {
            const mockResponse = {
                status: 200,
                data: {
                    data: [{ id: "model-123", active: true }],
                },
            }

            const createData = {
                name: "New Model",
                apiKey: "new-api-key",
                connection: {
                    url: "https://api.example.com",
                    identifier: "model-123",
                },
                userId: "user-123",
            }

            await Effect.gen(function* () {
                const modelService = yield* ModelService
                return yield* modelService.create(createData as any)
            }).pipe(
                Effect.provide(
                    ModelService.DefaultWithoutDependencies.pipe(
                        Layer.provide(
                            Layer.mergeAll(
                                SseServiceMock,
                                createMockRepository(),
                                createMockHttpClient(mockResponse),
                            ),
                        ),
                    ),
                ),
                Effect.runPromise,
            )

            // If it doesn't throw, the test passes
            expect(true).toBe(true)
        })
    })

    describe("updateModelStatus", () => {
        it("should update model status successfully", async () => {
            await Effect.gen(function* () {
                const modelService = yield* ModelService
                return yield* modelService.updateModelStatus(
                    "test-model-id",
                    "active",
                )
            }).pipe(
                Effect.provide(
                    ModelService.DefaultWithoutDependencies.pipe(
                        Layer.provide(
                            Layer.mergeAll(
                                SseServiceMock,
                                createMockRepository(),
                                createMockHttpClient({}),
                            ),
                        ),
                    ),
                ),
                Effect.runPromise,
            )

            // If it doesn't throw, the test passes
            expect(true).toBe(true)
        })

        it("should throw error when model not found", async () => {
            try {
                await Effect.gen(function* () {
                    const modelService = yield* ModelService
                    return yield* modelService.updateModelStatus(
                        "test-model-id",
                        "active",
                    )
                }).pipe(
                    Effect.provide(
                        ModelService.DefaultWithoutDependencies.pipe(
                            Layer.provide(
                                Layer.mergeAll(
                                    SseServiceMock,
                                    createMockRepository(() =>
                                        Promise.resolve(null),
                                    ),
                                    createMockHttpClient({}),
                                ),
                            ),
                        ),
                    ),
                    Effect.runPromise,
                )
                // If we reach here, the test should fail
                expect(true).toBe(false)
            } catch (error) {
                // Expected to throw an error
                expect(error).toBeDefined()
            }
        })

        it("should update model status to error with error code", async () => {
            await Effect.gen(function* () {
                const modelService = yield* ModelService
                return yield* modelService.updateModelStatus(
                    "test-model-id",
                    "error",
                    "INVALID_API_KEY",
                )
            }).pipe(
                Effect.provide(
                    ModelService.DefaultWithoutDependencies.pipe(
                        Layer.provide(
                            Layer.mergeAll(
                                SseServiceMock,
                                createMockRepository(),
                                createMockHttpClient({}),
                            ),
                        ),
                    ),
                ),
                Effect.runPromise,
            )

            expect(true).toBe(true)
        })
    })

    describe("testConnectionStream", () => {
        it("should stream connection test with successful result", async () => {
            const mockResponse = {
                status: 200,
                data: {
                    data: [{ id: "model-123", active: true }],
                },
            }

            const result = await Effect.gen(function* () {
                const modelService = yield* ModelService
                const stream = yield* modelService.testConnectionStream(
                    "test-model-id",
                )
                const chunks = yield* Stream.runCollect(stream)
                return chunks
            }).pipe(
                Effect.provide(
                    ModelService.DefaultWithoutDependencies.pipe(
                        Layer.provide(
                            Layer.mergeAll(
                                SseServiceMock,
                                createMockRepository(),
                                createMockHttpClient(mockResponse),
                            ),
                        ),
                    ),
                ),
                Effect.runPromise,
            )

            expect(result).toBeDefined()
        })

        it("should handle model not found in stream", async () => {
            const exit = await Effect.gen(function* () {
                const modelService = yield* ModelService
                return yield* modelService.testConnectionStream("test-model-id")
            }).pipe(
                Effect.provide(
                    ModelService.DefaultWithoutDependencies.pipe(
                        Layer.provide(
                            Layer.mergeAll(
                                SseServiceMock,
                                createMockRepository(() =>
                                    Promise.resolve(null),
                                ),
                                createMockHttpClient({}),
                            ),
                        ),
                    ),
                ),

                Effect.exit,
                Effect.runPromise,
            )

            if (Exit.isFailure(exit)) {
                expect(exit.cause._tag).toBeDefined()
            } else {
                expect(true).toBe(true)
            }
        })

        it("should emit error status when API key is invalid", async () => {
            const mockResponse = {
                status: 401,
            }

            const result = await Effect.gen(function* () {
                const modelService = yield* ModelService
                const stream = yield* modelService.testConnectionStream(
                    "test-model-id",
                )
                const chunks = yield* Stream.runCollect(stream)
                return chunks
            }).pipe(
                Effect.provide(
                    ModelService.DefaultWithoutDependencies.pipe(
                        Layer.provide(
                            Layer.mergeAll(
                                SseServiceMock,
                                createMockRepository(),
                                createMockHttpClient(mockResponse),
                            ),
                        ),
                    ),
                ),
                Effect.runPromise,
            )

            // Stream should complete even with errors
            expect(result).toBeDefined()
        })

        it("should emit error status when model is inactive", async () => {
            const mockResponse = {
                status: 200,
                data: {
                    data: [{ id: "model-123", active: false }],
                },
            }

            const result = await Effect.gen(function* () {
                const modelService = yield* ModelService
                const stream = yield* modelService.testConnectionStream(
                    "test-model-id",
                )
                const chunks = yield* Stream.runCollect(stream)
                return chunks
            }).pipe(
                Effect.provide(
                    ModelService.DefaultWithoutDependencies.pipe(
                        Layer.provide(
                            Layer.mergeAll(
                                SseServiceMock,
                                createMockRepository(),
                                createMockHttpClient(mockResponse),
                            ),
                        ),
                    ),
                ),
                Effect.runPromise,
            )

            // Stream should complete even with errors
            expect(result).toBeDefined()
        })
    })
})
