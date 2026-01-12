import type { FindManyQueryParams } from "@/modules/analysis/model"
import { effectify } from "@repo/db/effect"
import type { AnalysisStatus } from "@repo/db/models"
import { Effect } from "effect"
import { AnalysisRepository } from "./repository"

export class AnalysisService extends Effect.Service<AnalysisService>()(
    "AnalysisService",
    {
        effect: Effect.gen(function* () {
            const repository = yield* AnalysisRepository

            const service = {
                statusCount: () =>
                    Effect.gen(service, function* () {
                        const [all, pending, analyzing, done, error] =
                            yield* Effect.all(
                                [
                                    effectify(repository.count()),
                                    this.countByStatus("pending"),
                                    this.countByStatus("analyzing"),
                                    this.countByStatus("done"),
                                    this.countByStatus("error"),
                                ],
                                { concurrency: "unbounded" },
                            )
                        return { all, pending, analyzing, done, error }
                    }),

                countByStatus: (status: AnalysisStatus) =>
                    effectify(repository.count({ where: { status } })),

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
                findMany: ({
                    page = 1,
                    pageSize = 10,
                    q,
                    status,
                }: FindManyQueryParams) =>
                    effectify(
                        repository.findMany({
                            where: {
                                name: { contains: q, mode: "insensitive" },
                                status: status as any,
                            },
                            include: { Preset: true },
                            skip: (page! - 1) * pageSize!,
                            take: pageSize!,
                            orderBy: [
                                { createdAt: "desc" },
                                { updatedAt: "desc" },
                            ],
                        }),
                    ),

                redo: (id: string) =>
                    effectify(
                        repository.update({
                            where: { id },
                            data: { status: "pending" },
                        }),
                    ),
            }
            return service
        }),
        dependencies: [AnalysisRepository.Default],
    },
) {
    static provide = Effect.provide(this.Default)
}
