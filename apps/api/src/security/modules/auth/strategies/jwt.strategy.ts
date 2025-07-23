import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import type { PrismaClient } from '@repo/db/models'
import { ENHANCED_PRISMA } from '@zenstackhq/server/nestjs'
import { ClsService } from 'nestjs-cls'
import { ExtractJwt, Strategy } from 'passport-jwt'
import type { EnvTypes } from 'src/app.module'
import type { JWTUserPayload } from 'src/security/modules/auth/entities/jwt_user_payload.entity'

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
	constructor(
		readonly config: ConfigService<EnvTypes>,
		private readonly cls: ClsService,
		@Inject(ENHANCED_PRISMA) private readonly prisma: PrismaClient,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.get<string>('AUTH_SECRET', ''),
		})
	}

	async validate(payload: JWTUserPayload) {
		this.cls.set(
			'auth',
			payload ? { id: payload.sub, ...payload } : undefined,
		)
		return this.prisma.user.update({
			where: { id: payload.sub },
			data: { loggedAt: new Date() },
		})
	}
}

export class PortableJWTStrategy extends PassportStrategy(Strategy) {
	payload: any
	constructor(
		readonly config: ConfigService<EnvTypes>,
		private readonly cls: ClsService,
		@Inject(ENHANCED_PRISMA) private readonly prisma: PrismaClient,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.get<string>('AUTH_SECRET', ''),
		})
	}

	validate(payload: JWTUserPayload) {
		this.payload = payload
		return payload
	}
}
