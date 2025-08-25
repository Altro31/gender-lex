import { Controller, Get } from '@nestjs/common'
import { BaseController } from 'src/core/utils/controller'

@Controller()
export class AppController extends BaseController {
	@Get()
	hello() {
		return { ok: true }
	}
}
