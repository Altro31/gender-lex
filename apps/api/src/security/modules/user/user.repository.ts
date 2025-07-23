import { Inject, Injectable } from '@nestjs/common'
import type { PrismaClient, User } from '@repo/db/models'
import { ENHANCED_PRISMA } from '@zenstackhq/server/nestjs'
import { PrismaService } from 'src/core/prisma/prisma.service'
import { BaseRepository } from 'src/core/utils/repository'
import type { CreateUserDto } from 'src/security/modules/user/dto/create-user.dto'
import type { UpdateUserDto } from 'src/security/modules/user/dto/update-user.dto'

@Injectable()
export class UserRepository extends BaseRepository('user') {
	constructor(
		private readonly prismaService: PrismaService,
		@Inject(ENHANCED_PRISMA) prisma: PrismaClient,
	) {
		super(prisma)
	}

	findOne(email: string) {
		return this.prismaService.user.findUnique({ where: { email } })
	}

	create(data: CreateUserDto): Promise<User> {
		return this.prisma.user.create({ data })
	}

	update(id: string, data: UpdateUserDto): Promise<User> {
		return this.model.update({ where: { id }, data })
	}
}
