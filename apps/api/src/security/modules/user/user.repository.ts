import { Inject, Injectable } from '@nestjs/common'
import { ENHANCED_PRISMA } from '@zenstackhq/server/nestjs'
import type { CreateUserDto } from 'src/security/modules/user/dto/create-user.dto'
import type { UpdateUserDto } from 'src/security/modules/user/dto/update-user.dto'
import { BaseRepository } from 'src/core/utils/repository'
import type { PrismaClient, User } from '@repo/db/models'

@Injectable()
export class UserRepository extends BaseRepository('user') {
	constructor(@Inject(ENHANCED_PRISMA) readonly prisma: PrismaClient) {
		super()
	}

	create(data: CreateUserDto): Promise<User> {
		return this.prisma.user.create({ data })
	}

	update(id: string, data: UpdateUserDto): Promise<User> {
		return this.prisma.user.update({ where: { id }, data })
	}
}
