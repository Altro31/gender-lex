import { Effect } from 'effect'

import { createEffectPrisma } from '@/lib/prisma-effect'
import { decrypt, encrypt } from '@repo/auth/encrypt'
import { enhance, type PrismaClient } from '@repo/db'
import { AuthService } from '../auth/auth.service'
import { RawPrismaService } from './raw-prisma.service'

export class EnhancedPrismaService extends Effect.Service<EnhancedPrismaService>()(
	'EnhancedPrismaService',
	{
		effect: Effect.gen(function* () {
			const prisma = yield* RawPrismaService
			const { session } = yield* AuthService

			const enhanced = enhance(
				prisma as any,
				{ user: session?.user },
				{
					logPrismaQuery: true,
					encryption: {
						encrypt: async (_, __, plain) =>
							encrypt(plain, process.env.ENCRYPTION_KEY || ''),
						decrypt: async (_, __, plain) =>
							decrypt(plain, process.env.ENCRYPTION_KEY || ''),
					},
				},
			) as PrismaClient
			return createEffectPrisma(enhanced)
		}),
		dependencies: [RawPrismaService.Default, AuthService.Default],
	},
) {
	static provide = Effect.provide(this.Default)
}
