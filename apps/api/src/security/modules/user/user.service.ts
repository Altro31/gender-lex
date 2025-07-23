import { Injectable, UnauthorizedException } from '@nestjs/common'
import { compare } from 'bcryptjs'
import type { UpdateUserDto } from 'src/security/modules/user/dto/update-user.dto'
import { UserRepository } from 'src/security/modules/user/user.repository'
import type { CreateUserDto } from './dto/create-user.dto'
import { ExistingUserException } from 'src/security/lib/exceptions'
import type { User } from '@repo/db/models'

@Injectable()
export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	async create(createUserDto: CreateUserDto) {
		try {
			return await this.userRepository.create(createUserDto)
		} catch (e) {
			console.log(e);
			if (e.code === 'P2002') throw new ExistingUserException()
		}
	}

	findAll(params: any) {
		return this.userRepository.findAll(params)
	}

	findOne(id: string) {
		return this.userRepository.findOneBy('id', id)
	}

	findOneByEmail(email: string) {
		return this.userRepository.findOne(email)
	}

	remove(id: string) {
		return this.userRepository.remove(id)
	}

	update(id: string, data: UpdateUserDto): Promise<User> {
		return this.userRepository.update(id, data)
	}

	async updatePassword(id: string, prev_pw: string, new_pw: string) {
		const user = await this.userRepository.findOneBy('id', id)
		if (!user) {
			throw new UnauthorizedException()
		}
		const isOldPasswordValid = await compare(prev_pw, user.password!)
		if (!isOldPasswordValid) {
			throw new UnauthorizedException()
		}
		return this.userRepository.update(id, { password: new_pw })
	}
}
