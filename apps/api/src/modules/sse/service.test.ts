import { SseService } from "@/modules/sse/service"
import { AuthService } from "@/shared/auth/auth.service"
import { describe, expect, it } from "bun:test"
import { Effect, Layer } from "effect"

const mockSession = {
    id: "session-123",
    user: {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
    },
}

const AuthServiceMock = Layer.succeed(AuthService, {
    safe: Effect.succeed({
        session: mockSession,
    }),
} as any)

describe("SseService", () => {
    it("should be defined as an Effect Service", () => {
        expect(SseService).toBeDefined()
        expect(SseService.Default).toBeDefined()
    })

    it("should have static provide method", () => {
        expect(SseService.provide).toBeDefined()
        expect(typeof SseService.provide).toBe("function")
    })

    it("should provide stream$ property", async () => {
        const result = await Effect.gen(function* () {
            const sseService = yield* SseService
            return sseService
        }).pipe(
            Effect.provide(
                SseService.DefaultWithoutDependencies.pipe(
                    Layer.provide(AuthServiceMock),
                ),
            ),
            Effect.runPromise,
        )

        expect(result.stream$).toBeDefined()
    })

    it("should provide broadcast method", async () => {
        const result = await Effect.gen(function* () {
            const sseService = yield* SseService
            return sseService
        }).pipe(
            Effect.provide(
                SseService.DefaultWithoutDependencies.pipe(
                    Layer.provide(AuthServiceMock),
                ),
            ),
            Effect.runPromise,
        )

        expect(result.broadcast).toBeDefined()
        expect(typeof result.broadcast).toBe("function")
    })

    it("should successfully broadcast messages", async () => {
        const service = await Effect.gen(function* () {
            const sseService = yield* SseService
            return sseService
        }).pipe(
            Effect.provide(
                SseService.DefaultWithoutDependencies.pipe(
                    Layer.provide(AuthServiceMock),
                ),
            ),
            Effect.runPromise,
        )

        // Broadcast should succeed
        const result = await Effect.runPromise(
            service.broadcast("model:test-started", {
                modelId: "model-123",
            } as any),
        )

        // Result should be true (successful publish to PubSub)
        expect(result).toBe(true)
    })

    it("should create service with session context", async () => {
        const service = await Effect.gen(function* () {
            const sseService = yield* SseService
            return sseService
        }).pipe(
            Effect.provide(
                SseService.DefaultWithoutDependencies.pipe(
                    Layer.provide(AuthServiceMock),
                ),
            ),
            Effect.runPromise,
        )

        // Service should be properly initialized
        expect(service).toBeDefined()
        expect(service.stream$).toBeDefined()
        expect(service.broadcast).toBeDefined()
    })
})
