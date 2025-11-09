import { ContextService } from "@/shared/context.service"
import { ManagedRuntime } from "effect"
import Elysia from "elysia"

export const effectPlugin = new Elysia({ name: "effect" }).derive(
    { as: "scoped" },
    ctx => ({ runtime: ManagedRuntime.make(ContextService.Default(ctx)) }),
)
