import { AuthModule as BetterAuthModuleLibrary } from '@mguay/nestjs-better-auth'
import { Module } from '@nestjs/common'
import { ClsModule } from 'nestjs-cls'
import { UserModule } from 'src/security/modules/user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
	controllers: [AuthController],
	providers: [AuthService],
	imports: [
		BetterAuthModuleLibrary.forRootAsync({
			async useFactory() {
				const { auth } = await import('@repo/auth')
				return { auth }
			},
		}),
		ClsModule.forRoot({ global: true, middleware: { mount: true } }),
		UserModule,
	],
})
export class AuthModule {}
