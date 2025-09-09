import { Injectable } from '@nestjs/common'
import type { Session, User } from '@repo/db/models'
import { ClsService } from 'nestjs-cls'

@Injectable()
export class SessionService {
	constructor(private readonly clsService: ClsService) {}

	getSession(): Session {
		return this.clsService.get('session')
	}

	getUser(): User {
		return this.clsService.get('user')
	}
}
