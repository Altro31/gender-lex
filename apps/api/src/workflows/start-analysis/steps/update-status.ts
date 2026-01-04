import { AnalysisRepository } from "@/modules/analysis/repository"
import { UserProviderService } from "@/shared/user-provider.service"
import type { Context } from "@/workflows/common-types"
import { effectify } from "@repo/db/effect"
import type { AnalysisStatus } from "@repo/db/models"
import { Effect } from "effect"

interface Args {
    analysisId: string
    status: AnalysisStatus
}

export async function updateStatus(
    { analysisId, status }: Args,
    { user }: Context,
) {
    "use step"

    const program = Effect.gen(function* () {
        const repository = yield* AnalysisRepository

        return yield* effectify(
            repository.update({ where: { id: analysisId }, data: { status } }),
        )
    }).pipe(
        AnalysisRepository.provide,
        UserProviderService.provideFromUser(user),
    )

    return Effect.runPromise(program)
}
