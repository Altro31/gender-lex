import { EnhancedPrismaService } from "@/shared/prisma.service"
import { Effect } from "effect"

export class UserService extends Effect.Service<UserService>()("UserService", {
    effect: Effect.gen(function* () {
        const repository = yield* EnhancedPrismaService
        return { repository }
    }),
    dependencies: [EnhancedPrismaService.Default],
}) {
    static provide = Effect.provide(this.Default)
}
