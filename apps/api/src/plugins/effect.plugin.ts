import { ContextService } from "@/shared/context.service"
import { UserProviderService } from "@/shared/user-provider.service"
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
import type { Prettify } from "hono/utils/types"

export const runEffectWithContext = (ctx: Context) => 
    <S, E>(effect: Effect.Effect<S, E, UserProviderService>) =>
        ManagedRuntime.make(
            UserProviderService.Default.pipe(
                Layer.provide(ContextService.Default(ctx)),
            ),
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
        UserProviderService.Default.pipe(
            Layer.provide(ContextService.Default(c)),
        ),
    )
    
    c.set("runtime", runtime)
    c.set("runEffect", runEffectWithContext(c))
    c.set("runEffectWithContext", runEffectWithContext)
    
    await next()
}
