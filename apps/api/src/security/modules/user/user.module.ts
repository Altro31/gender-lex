import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/core/prisma/prisma.module'
import { UserRepository } from 'src/security/modules/user/user.repository'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
	imports: [PrismaModule],
	exports: [UserService],
	controllers: [UserController],
	providers: [UserService, UserRepository],
})
export class UserModule {}
