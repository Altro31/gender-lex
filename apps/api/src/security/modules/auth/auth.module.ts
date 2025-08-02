import { AuthModule as BetterAuthModuleLibrary } from '@mguay/nestjs-better-auth'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createAuth } from '@repo/auth'
import { ClsModule } from 'nestjs-cls'
import type { EnvTypes } from 'src/app.module'
import { UserModule } from 'src/security/modules/user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
@Module({
	controllers: [AuthController],
	providers: [AuthService],
	imports: [
		BetterAuthModuleLibrary.forRootAsync({
			useFactory(config: ConfigService<EnvTypes>) {
				const auth = createAuth(key => config.get(key as any))
				return { auth }
			},
			inject: [ConfigService],
		}),
		ClsModule.forRoot({ global: true, middleware: { mount: true } }),
		UserModule,
	],
})
export class AuthModule {}
