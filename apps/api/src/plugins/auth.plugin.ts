import { AuthService } from '@/shared/auth/auth.service'
import { UnauthorizedError } from '@/shared/auth/errors/unauthorized.error'
import { ContextService } from '@/shared/context.service'
import { Effect } from 'effect'
import Elysia from 'elysia'
import { effectPlugin } from './effect.plugin'

export const authPlugin = new Elysia({ name: 'plugin.auth' })
	.use(effectPlugin)
	.macro({
		requireLogin(enabled: boolean) {
			if (!enabled) return
			return {
				async beforeHandle(ctx) {
					const program = Effect.gen(function* () {
						const { isAuthenticated } = yield* AuthService
						if (!isAuthenticated)
							return yield* new UnauthorizedError()
					}).pipe(AuthService.provide, ContextService.provide(ctx))
					await ctx.runEffectWithContext(ctx)(program)
				},
			}
		},
	})
	.as('scoped')
