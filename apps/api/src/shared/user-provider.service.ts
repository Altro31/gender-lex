import type { User } from "better-auth"
import { Effect, Layer } from "effect"
import { ContextService } from "./context.service.ts"
import { auth } from "@repo/auth/api"

export class UserProviderService extends Effect.Tag("UserProviderService")<
    UserProviderService,
    { user: User | undefined }
>() {
    static Default = Layer.effect(
        this,
        Effect.gen(function* () {
            const ctx = yield* ContextService
            // Hono context: headers are at ctx.req.raw.headers
            const headers = ctx.req?.raw?.headers || new Headers()
            const res = yield* Effect.promise(() =>
                auth.api.getSession({
                    headers,
                }),
            )
            return { user: res?.user }
        }),
    )

    static provide = Effect.provide(this.Default)

    static DefaultFromUser = (user: User | undefined) =>
        Layer.succeed(this, { user })

    static provideFromUser = (user: User | undefined) =>
        Effect.provide(this.DefaultFromUser(user))
}
