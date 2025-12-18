import { AuthDBService } from '@/shared/db/auth-db.service'
import { Effect } from 'effect'

export class PresetRepository extends Effect.Service<PresetRepository>()(
	'PresetRepository',
	{
		effect: Effect.gen(function* () {
			const db = yield* AuthDBService
			return db.preset
		}),
		dependencies: [AuthDBService.Default],
	},
) {
	static provide = Effect.provide(this.Default)
}
