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
import Elysia from "elysia"
import type { Prettify } from "elysia/types"

export const effectPlugin = new Elysia({ name: "plugin.effect" })
    .decorate(
        "runEffectWithContext",
        (ctx: any) =>
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
                        console.log(
                            "Effect result:",
                            JSON.stringify(res, null, "\t"),
                        )
                        if (Exit.isSuccess(res)) return res.value
                        const cause = res.cause
                        if (Cause.isFailType(cause)) {
                            throw cause.error
                        }
                        return {} as Prettify<S>
                    }),
    )
    .derive(ctx => ({
        runtime: ManagedRuntime.make(
            UserProviderService.Default.pipe(
                Layer.provide(ContextService.Default(ctx)),
            ),
        ),
        runEffect: ctx.runEffectWithContext(ctx),
    }))
    .as("scoped")
