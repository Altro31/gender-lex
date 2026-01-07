import { AuthService } from "@/shared/auth/auth.service"
import { ContextService } from "@/shared/context.service"
import type { MiddlewareHandler } from "hono"
import { runEffectWithContext } from "./effect.plugin"

export const authMiddleware: MiddlewareHandler = async (c, next) => {
    // Auth check will happen in routes that need it
    await next()
}

export const requireAuth: MiddlewareHandler = async (c, next) => {
    const program = AuthService.safe.pipe(
        AuthService.provide,
        ContextService.provide(c),
    )
    await runEffectWithContext(c)(program)
    await next()
}
