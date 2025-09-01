import { Controller } from '@nestjs/common'
import { bindLogger } from 'src/core/utils/log'

@Controller('User')
export class UserController {
	private readonly logger = bindLogger(this)
}
