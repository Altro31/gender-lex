import { Context as EffectContext, Effect, Layer } from "effect"
import type { Context } from "elysia"

export class ContextService extends EffectContext.Tag("ContextService")<
    ContextService,
    Context
>() {
    static Default(ctx: any) {
        return Layer.succeed(ContextService, ctx)
    }
    static provide(ctx: any) {
        return Effect.provide(ContextService.Default(ctx))
    }
    static layerProvide(ctx: any) {
        return Layer.provide(ContextService.Default(ctx))
    }
}
