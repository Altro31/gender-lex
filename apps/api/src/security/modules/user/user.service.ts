import { Injectable } from '@nestjs/common'
import { UserRepository } from 'src/security/modules/user/user.repository'

@Injectable()
export class UserService {
	constructor(public readonly repository: UserRepository) {}
}
