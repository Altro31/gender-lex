import type { ContextService } from "@/shared/context.service"
import type { UserProviderService } from "@/shared/user-provider.service"
import type { ManagedRuntime, Effect } from "effect"
import type { Context } from "vm"

export type HonoVariables = {
    Variables: {
        runtime: ManagedRuntime.ManagedRuntime<
            UserProviderService | ContextService,
            never
        >
        runEffect: <S, E>(
            effect: Effect.Effect<S, E, UserProviderService | ContextService>,
        ) => Promise<S>
        runEffectWithContext: (
            ctx: Context,
        ) => <S, E>(
            effect: Effect.Effect<S, E, UserProviderService | ContextService>,
        ) => Promise<S>
    }
}
