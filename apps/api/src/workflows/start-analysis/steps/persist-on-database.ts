import { AnalysisRepository } from "@/modules/data/analysis/repository"
import { UserProviderService } from "@/shared/user-provider.service"
import type { Context } from "@/workflows/common-types"
import { effectify } from "@repo/db/effect"
import { Effect } from "effect"

interface Args {
    presetId: string
    workflow: string
}

export async function persistOnDatabase(
    { presetId, workflow }: Args,
    { user }: Context,
) {
    "use step"

    const program = Effect.gen(function* () {
        const repository = yield* AnalysisRepository

        return yield* effectify(
            repository.create({
                data: {
                    workflow,
                    Preset: { connect: { id: presetId } },
                    visibility: !user ? "public" : undefined,
                },
                select: { id: true },
            }),
        )
    }).pipe(
        AnalysisRepository.provide,
        UserProviderService.provideFromUser(user),
    )

    return Effect.runPromise(program)
}
