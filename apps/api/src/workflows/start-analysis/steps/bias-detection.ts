import { BiasDetectionService } from "@/modules/bias-detection/service"
import type { Analysis, Model, Preset, PresetModel } from "@repo/db/models"
import type { DeepPartial } from "ai"
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

        return (yield* biasDetectionService.analice(
            analysis,
        )) as ReadableStream<DeepPartial<T>>
    }).pipe(BiasDetectionService.provide)

    return Effect.runPromise(program)
}
