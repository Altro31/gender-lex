import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from '../auth.service'
import { ClsService } from 'nestjs-cls'
import type { PrismaClient } from '@repo/db'
import { ENHANCED_PRISMA } from '@zenstackhq/server/nestjs'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(
		private authService: AuthService,
		private readonly cls: ClsService,
		@Inject(ENHANCED_PRISMA) private readonly prisma: PrismaClient,
	) {
		super({ usernameField: 'email', passwordField: 'password' })
	}

	async validate(email: string, password: string) {
		const user = await this.authService.validateUser(email, password)
		if (!user) {
			throw new UnauthorizedException()
		}
		this.cls.set('auth', user)
		return this.prisma.user.update({
			where: { email: user.email },
			data: { loggedAt: new Date() },
		})
	}
}
