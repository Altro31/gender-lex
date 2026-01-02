import { auth } from '@repo/auth/api'
import { Effect } from 'effect'
import { ContextService } from '../context.service'
import { UnauthorizedError } from './errors/unauthorized.error'

export class AuthService extends Effect.Service<AuthService>()('AuthService', {
	effect: Effect.gen(function* () {
		const { headers } = yield* ContextService
		const res = yield* Effect.promise(() =>
			auth.api.getSession({
				headers: new Headers(Object.entries(headers as any)),
			}),
		)
		if (!res) return yield* new UnauthorizedError()
		const { session, user } = res
		return { ...session, user }
	}),
}) {
	static provide = Effect.provide(this.Default)
}
