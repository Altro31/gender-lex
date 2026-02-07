import { BiasDetectionService } from "@/modules/bias-detection/service"
import type { Analysis, Model, Preset, PresetModel } from "@repo/db/models"
import { Effect } from "effect"

interface Args<T> {
    analysis: T
}

export async function biasDetection<
    T extends Analysis & {
        Preset: Preset & { Models: (PresetModel & { Model: Model })[] }
    },
>({ analysis }: Args<T>) {
    "use step"
    const program = Effect.gen(function* () {
        const biasDetectionService = yield* BiasDetectionService

        return yield* biasDetectionService.analice(analysis)
    }).pipe(BiasDetectionService.provide)

    const { reasoningStream, stream } = await Effect.runPromise(program)

    return [stream, reasoningStream] as const
}
