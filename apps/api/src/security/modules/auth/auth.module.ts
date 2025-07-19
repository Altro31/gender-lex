import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ClsModule } from 'nestjs-cls'
import type { EnvTypes } from 'src/app.module'
import { JWTStrategy } from 'src/security/modules/auth/strategies/jwt.strategy'
import { LocalStrategy } from 'src/security/modules/auth/strategies/local.strategy'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserModule } from 'src/security/modules/user/user.module'

@Module({
	controllers: [AuthController],
	providers: [LocalStrategy, AuthService, JWTStrategy],
	imports: [
		ClsModule.forRoot({ global: true, middleware: { mount: true } }),
		JwtModule.registerAsync({
			global: true,
			inject: [ConfigService],
			useFactory(config: ConfigService<EnvTypes>) {
				return {
					secret: config.get('AUTH_SECRET'),
					signOptions: { expiresIn: '1d' },
				}
			},
		}),
		PassportModule,
		UserModule,
	],
})
export class AuthModule {}
