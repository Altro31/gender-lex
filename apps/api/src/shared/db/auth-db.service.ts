import { authDB } from '@repo/db/client'
import { Effect } from 'effect'
import { AuthService } from '../auth/auth.service'

export class AuthDBService extends Effect.Service<AuthDBService>()(
	'AuthDBService',
	{
		effect: Effect.gen(function* () {
			const session = yield* AuthService
			return authDB.$setAuth(session?.user)
		}),
		dependencies: [AuthService.Default],
	},
) {
	static provide = Effect.provide(this.Default)
}
