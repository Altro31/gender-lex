import type { UserSession } from '@mguay/nestjs-better-auth'
import { Injectable } from '@nestjs/common'
import { ClsService } from 'nestjs-cls'

@Injectable()
export class SessionService {
	constructor(private readonly clsService: ClsService) {}

	getSession(): UserSession['session'] {
		return this.clsService.get('session')
	}

	getUser(): UserSession['user'] {
		return this.clsService.get('user')
	}
}
