import { AnalysisRepository } from "@/modules/data/analysis/repository"
import { UserProviderService } from "@/shared/user-provider.service"
import type { Context } from "@/workflows/common-types"
import { effectify } from "@repo/db/effect"
import type { Analysis, AnalysisStatus } from "@repo/db/models"
import { Effect } from "effect"

interface Args<T> {
    analysis: T
    status: AnalysisStatus
}

export async function updateStatus<T extends Analysis>(
    { analysis, status }: Args<T>,
    { user }: Context,
) {
    "use step"

    const program = Effect.gen(function* () {
        const repository = yield* AnalysisRepository

        return yield* effectify(
            repository.update({ where: { id: analysis.id }, data: { status } }),
        )
    }).pipe(
        AnalysisRepository.provide,
        UserProviderService.provideFromUser(user),
    )

    const result = await Effect.runPromise(program)

    return {
        ...analysis,
        ...result,
    }
}
