// @ts-ignore

import { Effect } from 'effect'
import { createEffectClient } from '@repo/db/effect'

import { authClient } from '@repo/db/client'
import { AuthService } from '../auth/auth.service'

export class AuthDBService extends Effect.Service<AuthDBService>()(
	'AuthDBService',
	{
		effect: Effect.gen(function* () {
			const { session } = yield* AuthService
			const client = authClient.$setAuth(session?.user)
			return createEffectClient(client) as any
		}),
		dependencies: [AuthService.Default],
	},
) {
	static provide = Effect.provide(this.Default)
}
