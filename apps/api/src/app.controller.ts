import { Controller, Get } from '@nestjs/common'
import { bindLogger } from 'src/core/utils/log'

@Controller()
export class AppController {
	private readonly logger = bindLogger(this)

	@Get()
	hello() {
		return { ok: true }
	}
}
