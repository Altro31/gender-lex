import { AuthDBService } from '@/shared/db/auth-db.service'
import { Effect } from 'effect'

export class ModelRepository extends Effect.Service<ModelRepository>()(
	'ModelRepository',
	{
		effect: Effect.gen(function* () {
			const prisma = yield* AuthDBService
			return prisma.model
		}),
		dependencies: [AuthDBService.Default],
	},
) {
	static provide = Effect.provide(this.Default)
}
