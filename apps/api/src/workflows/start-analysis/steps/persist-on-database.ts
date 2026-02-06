import { AnalysisRepository } from "@/modules/data/analysis/repository"
import { PresetService } from "@/modules/data/preset/service"
import { UserProviderService } from "@/shared/user-provider.service"
import type { Context } from "@/workflows/common-types"
import { effectify } from "@repo/db/effect"
import { Effect } from "effect"
import { getWorkflowMetadata } from "workflow"

interface Args {
    presetId: string | undefined
}

export async function persistOnDatabase({ presetId }: Args, { user }: Context) {
    "use step"
    const { workflowRunId } = getWorkflowMetadata()

    const program = Effect.gen(function* () {
        const repository = yield* AnalysisRepository
        const presetService = yield* PresetService

        if (!presetId) {
            const defaultPreset = yield* presetService.getDefault()
            presetId = defaultPreset.id
        }

        return yield* effectify(
            repository.create({
                data: {
                    workflow: workflowRunId,
                    Preset: { connect: { id: presetId } },
                    visibility: !user ? "public" : undefined,
                },
                select: { id: true },
            }),
        )
    }).pipe(
        AnalysisRepository.provide,
        PresetService.provide,
        UserProviderService.provideFromUser(user),
    )

    return Effect.runPromise(program)
}
