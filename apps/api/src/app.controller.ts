import { Session, type UserSession } from '@mguay/nestjs-better-auth'
import { Controller, Get, Sse } from '@nestjs/common'
import { SseGateway } from 'src/core/sse/sse-gateway.service'
import { Auth } from 'src/security/modules/auth/decorators/auth.decorator'

@Controller()
export class AppController {
	constructor(private readonly sse: SseGateway) {}

	@Get()
	hello() {
		return { ok: true }
	}

	@Auth()
	@Sse('sse')
	events(@Session() session: UserSession) {
		console.log(session)
		return this.sse.stream
	}
}
