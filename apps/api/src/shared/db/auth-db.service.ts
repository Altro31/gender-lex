import { authDB } from "@repo/db/client"
import { Effect } from "effect"
import { UserProviderService } from "../user-provider.service"

export class AuthDBService extends Effect.Service<AuthDBService>()(
    "AuthDBService",
    {
        effect: Effect.gen(function* () {
            const { user } = yield* UserProviderService
            return authDB.$setAuth(user)
        }),
    },
) {
    static provide = Effect.provide(this.Default)
}
