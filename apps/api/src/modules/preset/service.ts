import { EnhancedPrismaService } from "@/shared/prisma.service"
import { Effect } from "effect"

export class PresetService extends Effect.Service<PresetService>()(
    "PresetService",
    {
        effect: Effect.gen(function* () {
            const repository = yield* EnhancedPrismaService
            return { repository }
        }),
        dependencies: [EnhancedPrismaService.Default],
    },
) {
    static provide = Effect.provide(this.Default)
}
