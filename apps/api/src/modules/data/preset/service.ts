import { PresetRepository } from "@/modules/data/preset/repository"
import { effectify } from "@repo/db/effect"
import { Effect } from "effect"

export class PresetService extends Effect.Service<PresetService>()(
    "PresetService",
    {
        effect: Effect.gen(function* () {
            const repository = yield* PresetRepository
            return {
                getDefault: Effect.fn("getDefault")(function* () {
                    return yield* effectify(
                        repository.findFirstOrThrow({
                            where: { isDefault: true },
                        }),
                    )
                }),
            }
        }),
        dependencies: [PresetRepository.Default],
    },
) {
    static provide = Effect.provide(this.Default)
}
