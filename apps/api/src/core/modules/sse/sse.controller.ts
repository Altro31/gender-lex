import { Session, type UserSession } from '@mguay/nestjs-better-auth'
import { Controller, Sse } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { filter } from 'rxjs'
import { SseService } from 'src/core/modules/sse/sse.service'
import { BaseController } from 'src/core/utils/controller'
import { Auth } from 'src/security/modules/auth/decorators/auth.decorator'

@ApiTags('Server-sent events')
@Controller('sse')
export class SseController extends BaseController {
	constructor(private readonly sseService: SseService) {
		super()
	}

	@Auth()
	@Sse()
	events(@Session() session: UserSession): any {
		return this.sseService.stream.pipe(
			filter(message => message.sessionId === session.session.id),
		)
	}
}
