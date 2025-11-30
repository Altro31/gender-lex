import { EnhancedPrismaService } from '@/shared/prisma.service'
import { Effect } from 'effect'

export class ModelRepository extends Effect.Service<ModelRepository>()(
	'ModelRepository',
	{
		effect: Effect.gen(function* () {
			const prisma = yield* EnhancedPrismaService
			return prisma.model
		}),
		dependencies: [EnhancedPrismaService.Default],
	},
) {
	static provide = Effect.provide(this.Default)
}
