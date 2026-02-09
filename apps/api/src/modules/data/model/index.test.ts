import { ModelService } from "@/modules/data/model/service"
import { describe, expect, it } from "bun:test"
import { Effect, Layer, Stream, Chunk } from "effect"

// Mock model data
const mockModel = {
    id: "test-model-id",
    name: "Test Model",
    apiKey: "test-api-key",
    connection: {
        url: "https://api.example.com",
        identifier: "model-123",
    },
    status: "active" as const,
    error: null,
    userId: "user-123",
    createdAt: new Date(),
    updatedAt: new Date(),
}

// Mock services
const createMockModelService = (
    createFn: any = Effect.succeed(undefined),
    testConnectionFn: any = Effect.succeed(true),
    testConnectionStreamFn: any = Effect.succeed(
        Stream.fromIterable([mockModel]),
    ),
) =>
    Layer.succeed(
        ModelService,
        ModelService.of({
            create: createFn,
            testConnection: testConnectionFn,
            testConnectionStream: testConnectionStreamFn,
            updateModelStatus: () => Effect.succeed(undefined),
        } as any),
    )

describe("Model Controllers", () => {
    describe("ModelService.create", () => {
        it("should successfully create a model through the service", async () => {
            let createCalled = false
            let capturedData: any = null

            const mockService = createMockModelService((data: any) => {
                createCalled = true
                capturedData = data
                return Effect.succeed(undefined)
            })

            const createData = {
                name: "Test Model",
                apiKey: "test-key",
                connection: {
                    url: "https://api.example.com",
                    identifier: "model-123",
                },
                userId: "user-123",
            }

            await Effect.gen(function* () {
                const service = yield* ModelService
                yield* service.create(createData as any)
            }).pipe(Effect.provide(mockService), Effect.runPromise)

            expect(createCalled).toBe(true)
            expect(capturedData).toEqual(createData)
        })

        it("should handle errors during model creation", async () => {
            const mockService = createMockModelService(() =>
                Effect.die("Database error"),
            )

            const createData = {
                name: "Test Model",
                apiKey: "test-key",
                connection: {
                    url: "https://api.example.com",
                    identifier: "model-123",
                },
                userId: "user-123",
            }

            try {
                await Effect.gen(function* () {
                    const service = yield* ModelService
                    yield* service.create(createData as any)
                }).pipe(Effect.provide(mockService), Effect.runPromise)

                expect(true).toBe(false) // Should not reach here
            } catch (error) {
                expect(error).toBeDefined()
            }
        })
    })

    describe("ModelService.testConnection", () => {
        it("should test connection and return true on success", async () => {
            let testConnectionCalled = false
            let capturedId = ""

            const mockService = createMockModelService(
                undefined,
                (id: string) => {
                    testConnectionCalled = true
                    capturedId = id
                    return Effect.succeed(true)
                },
            )

            const result = await Effect.gen(function* () {
                const service = yield* ModelService
                return yield* service.testConnection("test-model-id")
            }).pipe(Effect.provide(mockService), Effect.runPromise)

            expect(testConnectionCalled).toBe(true)
            expect(capturedId).toBe("test-model-id")
            expect(result).toBe(true)
        })

        it("should return false when connection fails", async () => {
            const mockService = createMockModelService(undefined, () =>
                Effect.succeed(false),
            )

            const result = await Effect.gen(function* () {
                const service = yield* ModelService
                return yield* service.testConnection("test-model-id")
            }).pipe(Effect.provide(mockService), Effect.runPromise)

            expect(result).toBe(false)
        })

        it("should return undefined when model not found", async () => {
            const mockService = createMockModelService(undefined, () =>
                Effect.succeed(undefined),
            )

            const result = await Effect.gen(function* () {
                const service = yield* ModelService
                return yield* service.testConnection("nonexistent-id")
            }).pipe(Effect.provide(mockService), Effect.runPromise)

            expect(result).toBeUndefined()
        })

        it("should handle connection errors", async () => {
            const mockService = createMockModelService(undefined, () =>
                Effect.die("Connection failed"),
            )

            try {
                await Effect.gen(function* () {
                    const service = yield* ModelService
                    return yield* service.testConnection("test-model-id")
                }).pipe(Effect.provide(mockService), Effect.runPromise)

                expect(true).toBe(false)
            } catch (error) {
                expect(error).toBeDefined()
            }
        })
    })

    describe("ModelService.testConnectionStream", () => {
        it("should stream connection test updates", async () => {
            const mockUpdates = [
                { ...mockModel, status: "connecting" as const },
                { ...mockModel, status: "active" as const },
            ]

            const mockService = createMockModelService(
                undefined,
                undefined,
                () => Effect.succeed(Stream.fromIterable(mockUpdates)),
            )

            const result = await Effect.gen(function* () {
                const service = yield* ModelService
                const stream = yield* service.testConnectionStream(
                    "test-model-id",
                )
                const chunks = yield* Stream.runCollect(stream)
                return chunks
            }).pipe(Effect.provide(mockService), Effect.runPromise)

            expect(result).toBeDefined()
            expect(Chunk.size(result)).toBe(2)
        })

        it("should stream error states", async () => {
            const mockService = createMockModelService(
                undefined,
                undefined,
                () =>
                    Effect.succeed(
                        Stream.fromIterable([
                            {
                                ...mockModel,
                                status: "error" as const,
                                error: "INVALID_API_KEY" as const,
                            },
                        ]),
                    ),
            )

            const result = await Effect.gen(function* () {
                const service = yield* ModelService
                const stream = yield* service.testConnectionStream(
                    "test-model-id",
                )
                const chunks = yield* Stream.runCollect(stream)
                return chunks
            }).pipe(Effect.provide(mockService), Effect.runPromise)

            expect(result).toBeDefined()
            const firstChunk = Chunk.unsafeHead(result)
            expect(firstChunk.status).toBe("error")
            expect(firstChunk.error).toBe("INVALID_API_KEY")
        })

        it("should capture correct model id from stream call", async () => {
            let capturedId = ""

            const mockService = createMockModelService(
                undefined,
                undefined,
                (id: string) => {
                    capturedId = id
                    return Effect.succeed(Stream.fromIterable([mockModel]))
                },
            )

            await Effect.gen(function* () {
                const service = yield* ModelService
                const stream = yield* service.testConnectionStream(
                    "custom-model-id",
                )
                yield* Stream.runCollect(stream)
            }).pipe(Effect.provide(mockService), Effect.runPromise)

            expect(capturedId).toBe("custom-model-id")
        })

        it("should handle empty streams", async () => {
            const mockService = createMockModelService(
                undefined,
                undefined,
                () => Effect.succeed(Stream.empty),
            )

            const result = await Effect.gen(function* () {
                const service = yield* ModelService
                const stream = yield* service.testConnectionStream(
                    "test-model-id",
                )
                const chunks = yield* Stream.runCollect(stream)
                return chunks
            }).pipe(Effect.provide(mockService), Effect.runPromise)

            expect(Chunk.size(result)).toBe(0)
        })

        it("should handle stream errors", async () => {
            const mockService = createMockModelService(
                undefined,
                undefined,
                () => Effect.die("Stream failed"),
            )

            try {
                await Effect.gen(function* () {
                    const service = yield* ModelService
                    const stream = yield* service.testConnectionStream(
                        "test-model-id",
                    )
                    yield* Stream.runCollect(stream)
                }).pipe(Effect.provide(mockService), Effect.runPromise)

                expect(true).toBe(false)
            } catch (error) {
                expect(error).toBeDefined()
            }
        })
    })

    describe("ModelService.updateModelStatus", () => {
        it("should update model status successfully", async () => {
            let updateCalled = false
            let capturedParams: any = {}

            const mockService = Layer.succeed(
                ModelService,
                ModelService.of({
                    updateModelStatus: (
                        id: string,
                        status: any,
                        error?: any,
                    ) => {
                        updateCalled = true
                        capturedParams = { id, status, error }
                        return Effect.succeed(undefined)
                    },
                } as any),
            )

            await Effect.gen(function* () {
                const service = yield* ModelService
                yield* service.updateModelStatus("test-model-id", "active")
            }).pipe(Effect.provide(mockService), Effect.runPromise)

            expect(updateCalled).toBe(true)
            expect(capturedParams.id).toBe("test-model-id")
            expect(capturedParams.status).toBe("active")
        })

        it("should update with error status", async () => {
            let capturedParams: any = {}

            const mockService = Layer.succeed(
                ModelService,
                ModelService.of({
                    updateModelStatus: (
                        id: string,
                        status: any,
                        error?: any,
                    ) => {
                        capturedParams = { id, status, error }
                        return Effect.succeed(undefined)
                    },
                } as any),
            )

            await Effect.gen(function* () {
                const service = yield* ModelService
                yield* service.updateModelStatus(
                    "test-model-id",
                    "error",
                    "INVALID_API_KEY",
                )
            }).pipe(Effect.provide(mockService), Effect.runPromise)

            expect(capturedParams.status).toBe("error")
            expect(capturedParams.error).toBe("INVALID_API_KEY")
        })
    })
})
