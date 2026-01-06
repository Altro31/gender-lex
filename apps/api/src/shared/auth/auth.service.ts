import { auth } from "@repo/auth/api"
import { Effect } from "effect"
import { ContextService } from "../context.service"
import { UnauthorizedError } from "./errors/unauthorized.error"

export class AuthService extends Effect.Service<AuthService>()("AuthService", {
    effect: Effect.gen(function* () {
        const ctx = yield* ContextService
        // Hono context: headers are at ctx.req.raw.headers
        const headers = ctx.req?.raw?.headers || new Headers()
        const res = yield* Effect.promise(() =>
            auth.api.getSession({
                headers,
            }),
        )
        return {
            get safe() {
                return Effect.gen(function* () {
                    if (!res) return yield* new UnauthorizedError()
                    return { session: { ...res.session, user: res.user } }
                })
            },
            get unsafe() {
                return Effect.succeed(
                    res ? { ...res.session, user: res.user } : undefined,
                )
            },
        }
    }),
    accessors: true,
}) {
    static provide = Effect.provide(this.Default)
}
