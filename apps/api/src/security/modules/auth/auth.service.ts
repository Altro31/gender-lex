import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compareSync } from 'bcryptjs'
import type { RegisterDto } from 'src/security/modules/auth/dto/register.dto'
import { UserService } from '../user/user.service'
import axios from 'axios'
import { GoogleLoginEntity } from 'src/security/modules/auth/entities/google_login.entity'
import type { User } from '@repo/db/models'

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) {}

	async validateUser(email: string, pass: string) {
		const user = await this.userService.findOneByEmail(email)
		console.log(user);
		
		if (!user) {
			throw new UnauthorizedException()
		}
		const { password, ...rest } = user
		const validUser = compareSync(pass, password!)
		return validUser ? rest : null
	}
	async register(data: RegisterDto) {
		const user = await this.userService.create(data)
		return this.generateToken(user!)
	}

	change_password(id: string, prev_pw: string, new_pw: string) {
		return this.userService.updatePassword(id, prev_pw, new_pw)
	}

	generateToken(user: Pick<User, 'id' | 'email' | 'provider'>) {
		const payload = {
			email: user.email,
			sub: user.id.toString(),
			provider: user.provider,
		}
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
