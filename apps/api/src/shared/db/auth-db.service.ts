/// <reference types="kysely" />

import { authClient } from '@repo/db/client'
import { Effect } from 'effect'
import { AuthService } from '../auth/auth.service'

export class AuthDBService extends Effect.Service<AuthDBService>()(
	'AuthDBService',
	{
		effect: Effect.gen(function* () {
			const { session } = yield* AuthService
			const client = authClient.$setAuth(session?.user)
			return client
		}),
		dependencies: [AuthService.Default],
	},
) {
	static provide = Effect.provide(this.Default)
}
