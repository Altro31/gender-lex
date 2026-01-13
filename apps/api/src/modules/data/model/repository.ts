import { AuthDBService } from '@/shared/db/auth-db.service'
import { Effect } from 'effect'

export class ModelRepository extends Effect.Service<ModelRepository>()(
	'ModelRepository',
	{
		effect: Effect.gen(function* () {
			const db = yield* AuthDBService
			return db.model
		}),
		dependencies: [AuthDBService.Default],
	},
) {
	static provide = Effect.provide(this.Default)
}
