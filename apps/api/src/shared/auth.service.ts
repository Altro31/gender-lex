import { Effect } from 'effect'
import { ContextService } from './context.service'
import { auth } from '@repo/auth/api'
import type { Session, User } from '@repo/db/models'

export class AuthService extends Effect.Service<AuthService>()('AuthService', {
	effect: Effect.gen(function* () {
		const { headers } = yield* ContextService
		const res = yield* Effect.promise(() =>
			auth.api.getSession({
				headers: new Headers(Object.entries(headers as any)),
			}),
		)
		return { session: res?.session, user: res?.user } as {
			session?: Session
			user?: User
		}
	}),
}) {
	static provide = Effect.provide(this.Default)
}
