import { AnalysisRepository } from "@/modules/data/analysis/repository"
import { AnalysisService } from "@/modules/data/analysis/service"
import { UserProviderService } from "@/shared/user-provider.service"
import { describe, expect, it } from "bun:test"
import { Effect, Layer } from "effect"

const mockUser = {
    id: "user-123",
    email: "test@example.com",
    name: "Test User",
}

const mockAnalysis = {
    id: "analysis-123",
    name: "Test Analysis",
    status: "done" as const,
    visibility: "private" as const,
    userId: "user-123",
    presetId: "preset-123",
    createdAt: new Date(),
    updatedAt: new Date(),
    originalText: "Sample text for analysis",
    workflow: null,
    Preset: {
        id: "preset-123",
        name: "Test Preset",
        userId: "user-123",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
}

const mockAnalyses = [
    mockAnalysis,
    {
        ...mockAnalysis,
        id: "analysis-456",
        name: "Another Analysis",
        status: "pending" as const,
    },
]

const UserProviderServiceMock = (user: any = mockUser) =>
    Layer.succeed(
        UserProviderService,
        UserProviderService.of({
            user,
        } as any),
    )

const createMockRepository = (
    count: any = () => Promise.resolve(10),
    deleteAnalysis: any = () => Promise.resolve(mockAnalysis),
    findUniqueOrThrow: any = () => Promise.resolve(mockAnalysis),
    findMany: any = () => Promise.resolve(mockAnalyses),
    update: any = () => Promise.resolve(mockAnalysis),
) =>
    Layer.succeed(
        AnalysisRepository,
        AnalysisRepository.of({
            count,
            delete: deleteAnalysis,
            findUniqueOrThrow,
            findMany,
            update,
        } as any),
    )

describe("AnalysisService", () => {
    describe("countByStatus", () => {
        it("should count all analyses when no status is provided", async () => {
            let countParams: any = null
            const mockRepo = createMockRepository((params: any) => {
                countParams = params
                return Promise.resolve(10)
            })

            const result = await Effect.gen(function* () {
                const analysisService = yield* AnalysisService
                return yield* analysisService.countByStatus()
            }).pipe(
                Effect.provide(
                    AnalysisService.DefaultWithoutDependencies.pipe(
                        Layer.provide(
                            Layer.mergeAll(mockRepo, UserProviderServiceMock()),
                        ),
                    ),
                ),
                Effect.runPromise,
            )

            expect(result).toBe(10)
            expect(countParams.where.User.id).toBe("user-123")
        })

        it("should count analyses by specific status", async () => {
            let countParams: any = null
            const mockRepo = createMockRepository((params: any) => {
                countParams = params
                return Promise.resolve(5)
            })

            const result = await Effect.gen(function* () {
                const analysisService = yield* AnalysisService
                return yield* analysisService.countByStatus("pending")
            }).pipe(
                Effect.provide(
                    AnalysisService.DefaultWithoutDependencies.pipe(
                        Layer.provide(
                            Layer.mergeAll(mockRepo, UserProviderServiceMock()),
                        ),
                    ),
                ),
                Effect.runPromise,
            )

            expect(result).toBe(5)
            expect(countParams.where.status).toBe("pending")
        })

        it("should handle no user context", async () => {
            let countParams: any = null
            const mockRepo = createMockRepository((params: any) => {
                countParams = params
                return Promise.resolve(15)
            })

            const result = await Effect.gen(function* () {
                const analysisService = yield* AnalysisService
                return yield* analysisService.countByStatus()
            }).pipe(
                Effect.provide(
                    AnalysisService.DefaultWithoutDependencies.pipe(
                        Layer.provide(
                            Layer.mergeAll(
                                mockRepo,
                                UserProviderServiceMock(null),
                            ),
                        ),
                    ),
                ),
                Effect.runPromise,
            )

            expect(result).toBe(15)
            expect(countParams.where.User).toBeUndefined()
        })
    })

    describe("statusCount", () => {
        it("should return counts for all status types", async () => {
            const counts = {
                all: 10,
                pending: 3,
                analyzing: 2,
                done: 4,
                error: 1,
            }

            const mockRepo = createMockRepository((params: any) => {
                if (!params.where.status) return Promise.resolve(counts.all)
                return Promise.resolve(
                    counts[params.where.status as keyof typeof counts],
                )
            })

            const result = await Effect.gen(function* () {
                const analysisService = yield* AnalysisService
                return yield* analysisService.statusCount()
            }).pipe(
                Effect.provide(
                    AnalysisService.DefaultWithoutDependencies.pipe(
                        Layer.provide(
                            Layer.mergeAll(mockRepo, UserProviderServiceMock()),
                        ),
                    ),
                ),
                Effect.runPromise,
            )

            expect(result.all).toBe(10)
            expect(result.pending).toBe(3)
            expect(result.analyzing).toBe(2)
            expect(result.done).toBe(4)
            expect(result.error).toBe(1)
        })
    })

    describe("delete", () => {
        it("should delete an analysis by id", async () => {
            let deletedId: string | null = null
            const mockRepo = createMockRepository(undefined, (params: any) => {
                deletedId = params.where.id
                return Promise.resolve(mockAnalysis)
            })

            const result = await Effect.gen(function* () {
                const analysisService = yield* AnalysisService
                return yield* analysisService.delete("analysis-123")
            }).pipe(
                Effect.provide(
                    AnalysisService.DefaultWithoutDependencies.pipe(
                        Layer.provide(
                            Layer.mergeAll(mockRepo, UserProviderServiceMock()),
                        ),
                    ),
                ),
                Effect.runPromise,
            )

            expect<string | null>(deletedId).toBe("analysis-123")
            expect(result.id).toBe("analysis-123")
        })

        it("should handle deletion errors", async () => {
            const mockRepo = createMockRepository(undefined, () =>
                Promise.reject(new Error("Database error")),
            )

            try {
                await Effect.gen(function* () {
                    const analysisService = yield* AnalysisService
                    return yield* analysisService.delete("nonexistent-id")
                }).pipe(
                    Effect.provide(
                        AnalysisService.DefaultWithoutDependencies.pipe(
                            Layer.provide(
                                Layer.mergeAll(
                                    mockRepo,
                                    UserProviderServiceMock(),
                                ),
                            ),
                        ),
                    ),
                    Effect.runPromise,
                )

                expect(true).toBe(false) // Should not reach here
            } catch (error) {
                expect(error).toBeDefined()
            }
        })
    })

    describe("findOne", () => {
        it("should find an analysis by id", async () => {
            let queriedId: string | null = null
            const mockRepo = createMockRepository(
                undefined,
                undefined,
                (params: any) => {
                    queriedId = params.where.id
                    return Promise.resolve(mockAnalysis)
                },
            )

            const result = await Effect.gen(function* () {
                const analysisService = yield* AnalysisService
                return yield* analysisService.findOne("analysis-123")
            }).pipe(
                Effect.provide(
                    AnalysisService.DefaultWithoutDependencies.pipe(
                        Layer.provide(
                            Layer.mergeAll(mockRepo, UserProviderServiceMock()),
                        ),
                    ),
                ),
                Effect.runPromise,
            )

            expect<string | null>(queriedId).toBe("analysis-123")
            expect(result.id).toBe("analysis-123")
            expect(result.name).toBe("Test Analysis")
            expect(result.Preset).toBeDefined()
        })

        it("should include Preset relation", async () => {
            const mockRepo = createMockRepository(
                undefined,
                undefined,
                (params: any) => {
                    expect(params.include.Preset).toBe(true)
                    return Promise.resolve(mockAnalysis)
                },
            )

            const result = await Effect.gen(function* () {
                const analysisService = yield* AnalysisService
                return yield* analysisService.findOne("analysis-123")
            }).pipe(
                Effect.provide(
                    AnalysisService.DefaultWithoutDependencies.pipe(
                        Layer.provide(
                            Layer.mergeAll(mockRepo, UserProviderServiceMock()),
                        ),
                    ),
                ),
                Effect.runPromise,
            )

            expect(result.Preset.id).toBe("preset-123")
        })

        it("should throw error when analysis not found", async () => {
            const mockRepo = createMockRepository(undefined, undefined, () =>
                Promise.reject(new Error("Not found")),
            )

            try {
                await Effect.gen(function* () {
                    const analysisService = yield* AnalysisService
                    return yield* analysisService.findOne("nonexistent-id")
                }).pipe(
                    Effect.provide(
                        AnalysisService.DefaultWithoutDependencies.pipe(
                            Layer.provide(
                                Layer.mergeAll(
                                    mockRepo,
                                    UserProviderServiceMock(),
                                ),
                            ),
                        ),
                    ),
                    Effect.runPromise,
                )

                expect(true).toBe(false) // Should not reach here
            } catch (error) {
                expect(error).toBeDefined()
            }
        })
    })

    describe("findMany", () => {
        it("should find analyses with default pagination", async () => {
            let queryParams: any = null
            const mockRepo = createMockRepository(
                undefined,
                undefined,
                undefined,
                (params: any) => {
                    queryParams = params
                    return Promise.resolve(mockAnalyses)
                },
            )

            const result = await Effect.gen(function* () {
                const analysisService = yield* AnalysisService
                return yield* analysisService.findMany({})
            }).pipe(
                Effect.provide(
                    AnalysisService.DefaultWithoutDependencies.pipe(
                        Layer.provide(
                            Layer.mergeAll(mockRepo, UserProviderServiceMock()),
                        ),
                    ),
                ),
                Effect.runPromise,
            )

            expect(result.length).toBe(2)
            expect(queryParams.skip).toBe(0)
            expect(queryParams.take).toBe(10)
        })

        it("should apply pagination parameters", async () => {
            let queryParams: any = null
            const mockRepo = createMockRepository(
                undefined,
                undefined,
                undefined,
                (params: any) => {
                    queryParams = params
                    return Promise.resolve([mockAnalysis])
                },
            )

            await Effect.gen(function* () {
                const analysisService = yield* AnalysisService
                return yield* analysisService.findMany({
                    page: 2,
                    pageSize: 5,
                })
            }).pipe(
                Effect.provide(
                    AnalysisService.DefaultWithoutDependencies.pipe(
                        Layer.provide(
                            Layer.mergeAll(mockRepo, UserProviderServiceMock()),
                        ),
                    ),
                ),
                Effect.runPromise,
            )

            expect(queryParams.skip).toBe(5)
            expect(queryParams.take).toBe(5)
        })

        it("should filter by search query", async () => {
            let queryParams: any = null
            const mockRepo = createMockRepository(
                undefined,
                undefined,
                undefined,
                (params: any) => {
                    queryParams = params
                    return Promise.resolve([mockAnalysis])
                },
            )

            await Effect.gen(function* () {
                const analysisService = yield* AnalysisService
                return yield* analysisService.findMany({ q: "test" })
            }).pipe(
                Effect.provide(
                    AnalysisService.DefaultWithoutDependencies.pipe(
                        Layer.provide(
                            Layer.mergeAll(mockRepo, UserProviderServiceMock()),
                        ),
                    ),
                ),
                Effect.runPromise,
            )

            expect(queryParams.where.name.contains).toBe("test")
            expect(queryParams.where.name.mode).toBe("insensitive")
        })

        it("should filter by status", async () => {
            let queryParams: any = null
            const mockRepo = createMockRepository(
                undefined,
                undefined,
                undefined,
                (params: any) => {
                    queryParams = params
                    return Promise.resolve([mockAnalysis])
                },
            )

            await Effect.gen(function* () {
                const analysisService = yield* AnalysisService
                return yield* analysisService.findMany({ status: "done" })
            }).pipe(
                Effect.provide(
                    AnalysisService.DefaultWithoutDependencies.pipe(
                        Layer.provide(
                            Layer.mergeAll(mockRepo, UserProviderServiceMock()),
                        ),
                    ),
                ),
                Effect.runPromise,
            )

            expect(queryParams.where.status).toBe("done")
        })

        it("should order by createdAt and updatedAt desc", async () => {
            let queryParams: any = null
            const mockRepo = createMockRepository(
                undefined,
                undefined,
                undefined,
                (params: any) => {
                    queryParams = params
                    return Promise.resolve(mockAnalyses)
                },
            )

            await Effect.gen(function* () {
                const analysisService = yield* AnalysisService
                return yield* analysisService.findMany({})
            }).pipe(
                Effect.provide(
                    AnalysisService.DefaultWithoutDependencies.pipe(
                        Layer.provide(
                            Layer.mergeAll(mockRepo, UserProviderServiceMock()),
                        ),
                    ),
                ),
                Effect.runPromise,
            )

            expect(queryParams.orderBy[0].createdAt).toBe("desc")
            expect(queryParams.orderBy[1].updatedAt).toBe("desc")
        })

        it("should include Preset relation", async () => {
            let queryParams: any = null
            const mockRepo = createMockRepository(
                undefined,
                undefined,
                undefined,
                (params: any) => {
                    queryParams = params
                    return Promise.resolve(mockAnalyses)
                },
            )

            await Effect.gen(function* () {
                const analysisService = yield* AnalysisService
                return yield* analysisService.findMany({})
            }).pipe(
                Effect.provide(
                    AnalysisService.DefaultWithoutDependencies.pipe(
                        Layer.provide(
                            Layer.mergeAll(mockRepo, UserProviderServiceMock()),
                        ),
                    ),
                ),
                Effect.runPromise,
            )

            expect(queryParams.include.Preset).toBe(true)
        })

        it("should filter by user when user context exists", async () => {
            let queryParams: any = null
            const mockRepo = createMockRepository(
                undefined,
                undefined,
                undefined,
                (params: any) => {
                    queryParams = params
                    return Promise.resolve(mockAnalyses)
                },
            )

            await Effect.gen(function* () {
                const analysisService = yield* AnalysisService
                return yield* analysisService.findMany({})
            }).pipe(
                Effect.provide(
                    AnalysisService.DefaultWithoutDependencies.pipe(
                        Layer.provide(
                            Layer.mergeAll(mockRepo, UserProviderServiceMock()),
                        ),
                    ),
                ),
                Effect.runPromise,
            )

            expect(queryParams.where.User.id).toBe("user-123")
        })
    })

    describe("redo", () => {
        it("should reset analysis status to pending", async () => {
            let updateParams: any = null
            const mockRepo = createMockRepository(
                undefined,
                undefined,
                undefined,
                undefined,
                (params: any) => {
                    updateParams = params
                    return Promise.resolve({
                        ...mockAnalysis,
                        status: "pending" as const,
                    })
                },
            )

            const result = await Effect.gen(function* () {
                const analysisService = yield* AnalysisService
                return yield* analysisService.redo("analysis-123")
            }).pipe(
                Effect.provide(
                    AnalysisService.DefaultWithoutDependencies.pipe(
                        Layer.provide(
                            Layer.mergeAll(mockRepo, UserProviderServiceMock()),
                        ),
                    ),
                ),
                Effect.runPromise,
            )

            expect(updateParams.where.id).toBe("analysis-123")
            expect(updateParams.data.status).toBe("pending")
            expect(result.status).toBe("pending")
        })
    })

    describe("changeVisibility", () => {
        it("should change analysis visibility to public", async () => {
            let updateParams: any = null
            const mockRepo = createMockRepository(
                undefined,
                undefined,
                undefined,
                undefined,
                (params: any) => {
                    updateParams = params
                    return Promise.resolve({
                        ...mockAnalysis,
                        visibility: "public" as const,
                    })
                },
            )

            const result = await Effect.gen(function* () {
                const analysisService = yield* AnalysisService
                return yield* analysisService.changeVisibility(
                    "analysis-123",
                    "public",
                )
            }).pipe(
                Effect.provide(
                    AnalysisService.DefaultWithoutDependencies.pipe(
                        Layer.provide(
                            Layer.mergeAll(mockRepo, UserProviderServiceMock()),
                        ),
                    ),
                ),
                Effect.runPromise,
            )

            expect(updateParams.where.id).toBe("analysis-123")
            expect(updateParams.data.visibility).toBe("public")
            expect(updateParams.include).toBeNull()
            expect(result.visibility).toBe("public")
        })

        it("should change analysis visibility to private", async () => {
            let updateParams: any = null
            const mockRepo = createMockRepository(
                undefined,
                undefined,
                undefined,
                undefined,
                (params: any) => {
                    updateParams = params
                    return Promise.resolve(mockAnalysis)
                },
            )

            const result = await Effect.gen(function* () {
                const analysisService = yield* AnalysisService
                return yield* analysisService.changeVisibility(
                    "analysis-123",
                    "private",
                )
            }).pipe(
                Effect.provide(
                    AnalysisService.DefaultWithoutDependencies.pipe(
                        Layer.provide(
                            Layer.mergeAll(mockRepo, UserProviderServiceMock()),
                        ),
                    ),
                ),
                Effect.runPromise,
            )

            expect(updateParams.data.visibility).toBe("private")
            expect(result.visibility).toBe("private")
        })
    })
})
