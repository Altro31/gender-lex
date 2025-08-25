import { AuthModule as BetterAuthModuleLibrary } from '@mguay/nestjs-better-auth'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { getBetterAuth } from '@repo/auth/nest'
import { PrismaModule } from 'src/core/modules/prisma/prisma.module'
import { PrismaService } from 'src/core/modules/prisma/prisma.service'
import { AuthHooks } from 'src/security/modules/auth/auth.hook'
import { SessionService } from 'src/security/modules/auth/session.service'

@Module({
	imports: [
		BetterAuthModuleLibrary.forRootAsync({
			useFactory(prisma: PrismaService, config: ConfigService) {
				const auth = getBetterAuth(prisma, (key: string) =>
					config.get(key),
				)
				return { auth }
			},
			imports: [PrismaModule],
			inject: [PrismaService, ConfigService],
		}),
	],
	providers: [SessionService, AuthHooks],
	exports: [SessionService],
})
export class AuthModule {}
