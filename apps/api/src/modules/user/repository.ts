import { AuthDBService } from '@/shared/db/auth-db.service'
import { Effect } from 'effect'

export class UserRepository extends Effect.Service<UserRepository>()(
	'UserRepository',
	{
		effect: Effect.gen(function* () {
			const prisma = yield* AuthDBService
			return prisma.user
		}),
		dependencies: [AuthDBService.Default],
	},
) {
	static provide = Effect.provide(this.Default)
}
