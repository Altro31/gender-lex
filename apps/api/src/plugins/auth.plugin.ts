import { AuthService } from '@/shared/auth/auth.service'
import { ContextService } from '@/shared/context.service'
import Elysia from 'elysia'
import { effectPlugin } from './effect.plugin'

export const authPlugin = new Elysia({ name: 'plugin.auth' })
	.use(effectPlugin)
	.macro({
		requireLogin(enabled: boolean) {
			if (!enabled) return
			return {
				async beforeHandle(ctx) {
					const program = AuthService.pipe(
						AuthService.provide,
						ContextService.provide(ctx),
					)
					await ctx.runEffectWithContext(ctx)(program)
				},
			}
		},
	})
	.as('scoped')
