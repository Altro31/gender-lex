import { PresetRepository } from "@/modules/data/preset/repository"
import { PresetService } from "@/modules/data/preset/service"
import { describe, expect, it } from "bun:test"
import { Effect, Layer } from "effect"

const mockPreset = {
    id: "preset-123",
    name: "Default Preset",
    isDefault: true,
    userId: "user-123",
    createdAt: new Date(),
    updatedAt: new Date(),
}

const createMockRepository = (
    findFirstOrThrow: any = () => Promise.resolve(mockPreset),
) =>
    Layer.succeed(
        PresetRepository,
        PresetRepository.of({
            findFirstOrThrow,
        } as any),
    )

describe("PresetService", () => {
    describe("getDefault", () => {
        it("should get the default preset", async () => {
            let queryParams: any = null
            const mockRepo = createMockRepository((params: any) => {
                queryParams = params
                return Promise.resolve(mockPreset)
            })

            const result = await Effect.gen(function* () {
                const presetService = yield* PresetService
                return yield* presetService.getDefault()
            }).pipe(
                Effect.provide(
                    PresetService.DefaultWithoutDependencies.pipe(
                        Layer.provide(mockRepo),
                    ),
                ),
                Effect.runPromise,
            )

            expect(result.id).toBe("preset-123")
            expect(result.name).toBe("Default Preset")
            expect(result.isDefault).toBe(true)
            expect(queryParams.where.isDefault).toBe(true)
        })

        it("should throw error when default preset not found", async () => {
            const mockRepo = createMockRepository(() =>
                Promise.reject(new Error("Not found")),
            )

            try {
                await Effect.gen(function* () {
                    const presetService = yield* PresetService
                    return yield* presetService.getDefault()
                }).pipe(
                    Effect.provide(
                        PresetService.DefaultWithoutDependencies.pipe(
                            Layer.provide(mockRepo),
                        ),
                    ),
                    Effect.runPromise,
                )

                expect(true).toBe(false) // Should not reach here
            } catch (error) {
                expect(error).toBeDefined()
            }
        })

        it("should use findFirstOrThrow to ensure a default exists", async () => {
            let methodCalled = false
            const mockRepo = createMockRepository((params: any) => {
                methodCalled = true
                return Promise.resolve(mockPreset)
            })

            await Effect.gen(function* () {
                const presetService = yield* PresetService
                return yield* presetService.getDefault()
            }).pipe(
                Effect.provide(
                    PresetService.DefaultWithoutDependencies.pipe(
                        Layer.provide(mockRepo),
                    ),
                ),
                Effect.runPromise,
            )

            expect(methodCalled).toBe(true)
        })
    })
})
