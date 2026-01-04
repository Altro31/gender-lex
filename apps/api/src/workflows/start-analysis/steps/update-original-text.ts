import { AnalysisRepository } from "@/modules/analysis/repository"
import { UserProviderService } from "@/shared/user-provider.service"
import type { Context } from "@/workflows/common-types"
import { effectify } from "@repo/db/effect"
import { Effect } from "effect"

interface Args {
    content: string
    analysisId: string
}

export async function updateOriginalText(
    { content, analysisId }: Args,
    { user }: Context,
) {
    "use step"
    console.log("updateOriginalText")
    const program = Effect.gen(function* () {
        const repository = yield* AnalysisRepository

        return yield* effectify(
            repository.update({
                where: { id: analysisId },
                data: { originalText: content },
                include: {
                    Preset: {
                        include: { Models: { include: { Model: true } } },
                    },
                },
            }),
        )
    }).pipe(
        AnalysisRepository.provide,
        UserProviderService.provideFromUser(user),
    )

    return Effect.runPromise(program)
}
