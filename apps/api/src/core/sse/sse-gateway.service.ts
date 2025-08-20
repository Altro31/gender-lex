import { Injectable, type MessageEvent } from '@nestjs/common'
import { Subject } from 'rxjs'
import type { MessageMapper } from '@repo/types/sse'

@Injectable()
export class SseGateway {
	private readonly stream$ = new Subject<MessageEvent>()

	get stream() {
		return this.stream$.asObservable()
	}

	broadcast<Type extends keyof MessageMapper>(
		type: Type,
		data: MessageMapper[Type],
	) {
		this.stream$.next({ type, data })
	}
}
