import { AnalysisRepository } from "@/modules/analysis/repository"
import { UserProviderService } from "@/shared/user-provider.service"
import type { Context } from "@/workflows/common-types"
import { effectify } from "@repo/db/effect"
import type { RawAnalysis } from "@repo/db/models"
import { Effect } from "effect"

interface Args {
    analysisId: string
    result: RawAnalysis
}

export async function updateWithResult(
    { result, analysisId }: Args,
    { user }: Context,
) {
    "use step"
    console.log("updateWithResult")
    const program = Effect.gen(function* () {
        const repository = yield* AnalysisRepository

        return yield* effectify(
            repository.update({ where: { id: analysisId }, data: result }),
        )
    }).pipe(
        AnalysisRepository.provide,
        UserProviderService.provideFromUser(user),
    )

    return Effect.runPromise(program)
}
