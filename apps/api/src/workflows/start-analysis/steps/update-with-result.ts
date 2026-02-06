import { AnalysisRepository } from "@/modules/data/analysis/repository"
import { UserProviderService } from "@/shared/user-provider.service"
import type { Context } from "@/workflows/common-types"
import { effectify } from "@repo/db/effect"
import type { Analysis, RawAnalysis } from "@repo/db/models"
import type { DeepPartial } from "ai"
import { Console, Effect } from "effect"

interface Args {
    analysisId: string
    result: DeepPartial<RawAnalysis>
}

export async function updateWithResult(
    { result, analysisId }: Args,
    { user }: Context,
) {
    "use step"
    const program = Effect.gen(function* () {
        const repository = yield* AnalysisRepository

        return yield* effectify(
            repository.update({
                where: { id: analysisId },
                data: result as Analysis,
            }),
        ).pipe(Effect.tapError(Console.error))
    }).pipe(
        AnalysisRepository.provide,
        UserProviderService.provideFromUser(user),
    )

    return Effect.runPromise(program)
}
