import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { UserRepository } from 'src/security/modules/user/user.repository'

@Module({
	exports: [UserService],
	controllers: [UserController],
	providers: [UserService, UserRepository],
})
export class UserModule {}
