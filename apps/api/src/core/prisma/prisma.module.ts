import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { enhance } from '@repo/db'
import { ZenStackModule } from '@zenstackhq/server/nestjs'
import { ClsService } from 'nestjs-cls'
import type { EnvTypes } from 'src/app.module'
import { PrismaService } from 'src/core/prisma/prisma.service'
import { getEncryptionKey } from 'src/core/utils/auth'

@Module({
	imports: [
		ZenStackModule.registerAsync({
			global: true,
			useFactory: (
				prisma: PrismaService,
				cls: ClsService,
				config: ConfigService<EnvTypes>,
			) => {
				const key = config.getOrThrow<string>('BETTER_AUTH_SECRET')
				return {
					getEnhancedPrisma: () => {
						return enhance(
							prisma,
							{ user: cls.get('auth') },
							{
								encryption: {
									encryptionKey: getEncryptionKey(key),
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
