import { BiasDetectionService } from "@/modules/bias-detection/service"
import type {
    Analysis,
    Model,
    Preset,
    PresetModel,
    RawAnalysis,
} from "@repo/db/models"
import { Effect } from "effect"

interface Args {
    analysis: Analysis & {
        Preset: Preset & { Models: (PresetModel & { Model: Model })[] }
    }
}

export async function biasDetection({ analysis }: Args) {
    "use step"
    const program = Effect.gen(function* () {
        const biasDetectionService = yield* BiasDetectionService

        return yield* biasDetectionService.analice(analysis)
        // return { biasedTerms: [], biasedMetaphors: [] } satisfies RawAnalysis
    }).pipe(BiasDetectionService.provide)

    return Effect.runPromise(program)
}
