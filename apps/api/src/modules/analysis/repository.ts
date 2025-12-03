import { EnhancedPrismaService } from '@/shared/prisma/enhanced-prisma.service'
import { Effect } from 'effect'

export class AnalysisRepository extends Effect.Service<AnalysisRepository>()(
	'AnalysisRepository',
	{
		effect: Effect.gen(function* () {
			const prisma = yield* EnhancedPrismaService
			return prisma.analysis
		}),
		dependencies: [EnhancedPrismaService.Default],
	},
) {
	static provide = Effect.provide(this.Default)
}
