import { EnhancedPrismaService } from '@/shared/prisma.service'
import { Effect } from 'effect'

export class PresetRepository extends Effect.Service<PresetRepository>()(
	'PresetRepository',
	{
		effect: Effect.gen(function* () {
			const prisma = yield* EnhancedPrismaService
			return prisma.preset
		}),
		dependencies: [EnhancedPrismaService.Default],
	},
) {
	static provide = Effect.provide(this.Default)
}
