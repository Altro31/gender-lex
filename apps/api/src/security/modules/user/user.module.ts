import { Module } from '@nestjs/common'
import { UserRepository } from 'src/security/modules/user/user.repository'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { ApiHandlerService } from '@zenstackhq/server/nestjs'
import { PrismaModule } from 'src/core/prisma/prisma.module'

@Module({
	imports: [PrismaModule],
	exports: [UserService],
	controllers: [UserController],
	providers: [UserService, UserRepository, ApiHandlerService],
})
export class UserModule {}
