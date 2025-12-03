import { EnhancedPrismaService } from '@/shared/prisma/enhanced-prisma.service'
import { Effect } from 'effect'

export class UserRepository extends Effect.Service<UserRepository>()(
	'UserRepository',
	{
		effect: Effect.gen(function* () {
			const prisma = yield* EnhancedPrismaService
			return prisma.user
		}),
		dependencies: [EnhancedPrismaService.Default],
	},
) {
	static provide = Effect.provide(this.Default)
}
