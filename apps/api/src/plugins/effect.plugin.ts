import { ContextService } from "@/shared/context.service"
import { UserProviderService } from "@/shared/user-provider.service"
import type { Prettify } from "better-auth"
import {
    Cause,
    Effect,
    Exit,
    Layer,
    Logger,
    LogLevel,
    ManagedRuntime,
} from "effect"
import type { Context, MiddlewareHandler } from "hono"

export const runEffectWithContext =
    (ctx: Context) =>
    <S, E>(effect: Effect.Effect<S, E, UserProviderService | ContextService>) =>
        ManagedRuntime.make(
            Layer.merge(
                UserProviderService.Default,
                ContextService.Default(ctx),
            ).pipe(ContextService.layerProvide(ctx)),
        )
            .runPromiseExit(
                effect.pipe(Logger.withMinimumLogLevel(LogLevel.Debug)),
            )
            .then((res): Prettify<S> => {
                if (Exit.isSuccess(res)) return res.value
                const cause = res.cause
                if (Cause.isFailType(cause)) {
                    throw cause.error
                }
                return {} as Prettify<S>
            })

export const effectMiddleware: MiddlewareHandler = async (c, next) => {
    const runtime = ManagedRuntime.make(
        Layer.merge(
            UserProviderService.Default,
            ContextService.Default(c),
        ).pipe(ContextService.layerProvide(c)),
    )
    c.set("runtime", runtime)
    c.set("runEffect", runEffectWithContext(c))
    c.set("runEffectWithContext", runEffectWithContext)

    await next()
}
