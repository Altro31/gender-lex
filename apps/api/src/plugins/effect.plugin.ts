import { ContextService } from '@/shared/context.service'
import { Cause, Effect, Exit, Logger, LogLevel, ManagedRuntime } from 'effect'
import Elysia from 'elysia'

export const effectPlugin = new Elysia({ name: 'plugin.auth' })
	.decorate(
		'runEffectWithContext',
		(ctx: any) =>
			<S, E>(effect: Effect.Effect<S, E, ContextService>) =>
				ManagedRuntime.make(ContextService.Default(ctx))
					.runPromiseExit(
						effect.pipe(Logger.withMinimumLogLevel(LogLevel.Debug)),
					)
					.then((res): S => {
						if (Exit.isSuccess(res)) return res.value
						const cause = res.cause
						if (Cause.isFailType(cause)) throw cause.error
						return {} as S
					}),
	)
	.derive(ctx => ({
		runtime: ManagedRuntime.make(ContextService.Default(ctx)),
		runEffect: ctx.runEffectWithContext(ctx),
	}))
	.as('scoped')
