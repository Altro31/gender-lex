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
            const { headers } = yield* ContextService
            const res = yield* Effect.promise(() =>
                auth.api.getSession({
                    headers: new Headers(Object.entries(headers as any)),
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
