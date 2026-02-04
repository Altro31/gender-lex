import { UserProviderService } from "@/shared/user-provider.service"
import { effectify } from "@repo/db/effect"
import type { AnalysisStatus, Visibility } from "@repo/db/models"
import type { AnalysisFindManyQueryParams } from "@repo/types/dtos/analysis"
import { Effect } from "effect"
import { AnalysisRepository } from "./repository"

export class AnalysisService extends Effect.Service<AnalysisService>()(
    "AnalysisService",
    {
        effect: Effect.gen(function* () {
            const repository = yield* AnalysisRepository
            const { user } = yield* UserProviderService

            const service = {
                statusCount: () =>
                    Effect.gen(service, function* () {
                        const [all, pending, analyzing, done, error] =
                            yield* Effect.all(
                                [
                                    this.countByStatus(),
                                    this.countByStatus("pending"),
                                    this.countByStatus("analyzing"),
                                    this.countByStatus("done"),
                                    this.countByStatus("error"),
                                ],
                                { concurrency: "unbounded" },
                            )
                        return { all, pending, analyzing, done, error }
                    }),

                countByStatus: (status?: AnalysisStatus) =>
                    effectify(
                        repository.count({
                            where: {
                                status,
                                User: user ? { id: user.id } : undefined,
                            },
                        }),
                    ),

                delete: (id: string) =>
                    effectify(repository.delete({ where: { id } })),

                findOne: Effect.fn("findOne")(function* (id: string) {
                    const analysis = yield* effectify(
                        repository.findUniqueOrThrow({
                            where: { id },
                            include: { Preset: true },
                        }),
                    )
                    return analysis
                }),
                findMany: Effect.fn("findMany")(function* ({
                    page = 1,
                    pageSize = 10,
                    q,
                    status,
                }: AnalysisFindManyQueryParams) {
                    return yield* effectify(
                        repository.findMany({
                            where: {
                                name: { contains: q, mode: "insensitive" },
                                status,
                                User: user ? { id: user.id } : undefined,
                            },
                            include: { Preset: true },
                            skip: (page! - 1) * pageSize!,
                            take: pageSize!,
                            orderBy: [
                                { createdAt: "desc" },
                                { updatedAt: "desc" },
                            ],
                        }),
                    )
                }),
                redo: (id: string) =>
                    effectify(
                        repository.update({
                            where: { id },
                            data: { status: "pending" },
                        }),
                    ),
                changeVisibility: Effect.fn("changeVisibility")(function* (
                    id: string,
                    visibility: Visibility,
                ) {
                    return yield* effectify(
                        repository.update({
                            where: { id },
                            data: { visibility },
                            include: null,
                        }),
                    )
                }),
            }
            return service
        }),
        dependencies: [AnalysisRepository.Default],
    },
) {
    static provide = Effect.provide(this.Default)
}
