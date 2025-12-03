import { Effect } from 'effect'

import { createEffectPrisma } from '@/lib/prisma-effect'
import { type PrismaClient } from '@repo/db'
import { RawPrismaService } from './raw-prisma.service'

export class PrismaService extends Effect.Service<PrismaService>()(
	'PrismaService',
	{
		effect: Effect.gen(function* () {
			const prisma = yield* RawPrismaService
			return createEffectPrisma(prisma as unknown as PrismaClient)
		}),
		dependencies: [RawPrismaService.Default],
	},
) {
	static provide = Effect.provide(this.Default)
}
