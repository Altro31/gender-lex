import { AuthDBService } from '@/shared/db/auth-db.service'
import { Effect } from 'effect'

export class AnalysisRepository extends Effect.Service<AnalysisRepository>()(
	'AnalysisRepository',
	{
		effect: Effect.gen(function* () {
			const db = yield* AuthDBService
			return db.analysis
		}),
		dependencies: [AuthDBService.Default],
	},
) {
	static provide = Effect.provide(this.Default)
}
