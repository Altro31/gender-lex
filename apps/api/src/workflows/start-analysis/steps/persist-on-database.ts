import { AnalysisRepository } from "@/modules/analysis/repository"
import { UserProviderService } from "@/shared/user-provider.service"
import type { Context } from "@/workflows/common-types"
import { effectify } from "@repo/db/effect"
import { Effect } from "effect"
import { getWorkflowMetadata } from "workflow"

interface Args {
    presetId: string
}

export async function persistOnDatabase({ presetId }: Args, { user }: Context) {
    "use step"

    const metadata = getWorkflowMetadata()

    const program = Effect.gen(function* () {
        const repository = yield* AnalysisRepository

        return yield* effectify(
            repository.create({
                data: {
                    workflow: metadata.workflowRunId,
                    Preset: { connect: { id: presetId } },
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
