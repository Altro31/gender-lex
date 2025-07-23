import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import type { PrismaClient, User } from '@repo/db/models'
import axios from 'axios'
import { compareSync } from 'bcryptjs'
import { PrismaService } from 'src/core/prisma/prisma.service'
import type { RegisterDto } from 'src/security/modules/auth/dto/register.dto'
import { GoogleLoginEntity } from 'src/security/modules/auth/entities/google_login.entity'
import { UserService } from '../user/user.service'
import { ENHANCED_PRISMA } from '@zenstackhq/server/nestjs'
import { ClsService } from 'nestjs-cls'

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private readonly rawPrisma: PrismaService,
		private readonly clsService: ClsService,
		@Inject(ENHANCED_PRISMA) private readonly prisma: PrismaClient,
	) {}

	async validateUser(email: string, pass: string) {
		const user = await this.rawPrisma.user.findUnique({ where: { email } })
		console.log(user)

		if (!user) {
			throw new UnauthorizedException()
		}
		const { password, ...rest } = user
		const validUser = compareSync(pass, password!)
		return validUser ? rest : null
	}
	async register(data: RegisterDto) {
		const user = await this.userService.create(data)
		this.clsService.set('auth', user)
		await this.prisma.user.update({
			where: { id: user?.id },
			data: { loggedAt: new Date() },
		})
		return this.generateToken(user!)
	}

	change_password(id: string, prev_pw: string, new_pw: string) {
		return this.userService.updatePassword(id, prev_pw, new_pw)
	}

	generateToken({ id, ...user }: Omit<User, 'password'>) {
		const payload = { sub: id, ...user }
		return this.jwtService.sign(payload)
	}

	async loginGoogle(token: string) {
		const res = await axios.get(
			'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' +
				token,
		)
		const data = GoogleLoginEntity.parse(res?.data)
		let user = (await this.userService.findOneByEmail(data.email))!
		if (!user)
			user = (await this.userService.create({
				email: data.email,
				provider: 'google',
			}))!
		return { jwt: this.generateToken(user), user }
	}
}
