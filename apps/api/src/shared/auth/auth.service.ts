import { auth } from '@repo/auth/api'
import type { Session, User } from '@repo/db/models'
import { Effect } from 'effect'
import { DBService } from '../db/db.service'
import { ContextService } from '../context.service'
import { effectify } from '@repo/db/effect'

const emptyReturn = { session: undefined, isAuthenticated: false } as {
	session?: Session & { user: User }
	isAuthenticated: boolean
}

export class AuthService extends Effect.Service<AuthService>()('AuthService', {
	effect: Effect.gen(function* () {
		const { headers } = yield* ContextService
		const client = yield* DBService
		const res = yield* Effect.promise(() =>
			auth.api.getSession({
				headers: new Headers(Object.entries(headers as any)),
			}),
		)
		if (!res) return emptyReturn
		const session = yield* effectify(
			client.session.findUniqueOrThrow({
				where: { id: res.session.id },
				include: { user: true },
			}),
		)
		return { session, isAuthenticated: Boolean(session) } as {
			session?: Session & { user: User }
			isAuthenticated: boolean
		}
	}),
	dependencies: [DBService.Default],
}) {
	static provide = Effect.provide(this.Default)
}
