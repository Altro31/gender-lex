import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { enhance } from '@repo/db'
import { type User } from '@repo/db/models'
import { ZenStackModule } from '@zenstackhq/server/nestjs'
import { ClsService } from 'nestjs-cls'
import type { EnvTypes } from 'src/app.module'
import { PrismaService } from 'src/core/modules/prisma/prisma.service'
import { encrypt, decrypt } from '@repo/auth/encrypt'

@Module({
	imports: [
		ZenStackModule.registerAsync({
			global: true,
			useFactory: (
				prisma: PrismaService,
				cls: ClsService,
				config: ConfigService<EnvTypes>,
			) => {
				const key = config.getOrThrow<string>('ENCRYPTION_KEY')
				return {
					getEnhancedPrisma: () => {
						const user = cls.get<User>('user')
						return enhance(
							prisma.prisma,
							{ user: user ?? null },
							{
								encryption: {
									encrypt: (_, __, plain) =>
										encrypt(plain, key),
									decrypt: (_, __, plain) =>
										decrypt(plain, key),
								},
							},
						)
					},
				}
			},
			inject: [PrismaService, ClsService, ConfigService],
			extraProviders: [PrismaService],
		}),
	],
	providers: [PrismaService],
	exports: [PrismaService],
})
export class PrismaModule {}
