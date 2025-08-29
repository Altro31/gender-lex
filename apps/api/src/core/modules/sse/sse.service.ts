import { Injectable, type MessageEvent } from '@nestjs/common'
import type { MessageMapper } from '@repo/types/sse'
import { Subject } from 'rxjs'
import { SessionService } from 'src/security/modules/auth/session.service'

type CustomMessageEvent = MessageEvent & { sessionId: string; userId: string }

@Injectable()
export class SseService {
	private readonly stream$ = new Subject<CustomMessageEvent>()

	constructor(private readonly sessionService: SessionService) {}

	get stream() {
		return this.stream$.asObservable()
	}

	broadcast<Type extends keyof MessageMapper>(
		type: Type,
		data: MessageMapper[Type],
	) {
		const session = this.sessionService.getSession()
		const user = this.sessionService.getUser()

		this.stream$.next({
			type,
			data,
			sessionId: session.id,
			userId: user.id,
			retry: 5000,
		})
	}
}
