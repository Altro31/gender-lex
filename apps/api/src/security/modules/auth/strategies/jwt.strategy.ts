import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import type { EnvTypes } from 'src/app.module'
import type { JWTUserPayload } from 'src/security/modules/auth/entities/jwt_user_payload.entity'
import { UserService } from '../../user/user.service'
import { ClsService } from 'nestjs-cls'

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly userService: UserService,
		private readonly config: ConfigService<EnvTypes>,
		private readonly cls: ClsService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.get<string>('AUTH_SECRET', ''),
		})
	}

	async validate(payload: JWTUserPayload) {
		this.cls.set('auth', payload ? { id: payload.sub } : undefined)
		return this.userService.findOne(payload.sub)
	}
}
