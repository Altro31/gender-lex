import { AuthGuard } from '@mguay/nestjs-better-auth'
import { Controller, UseGuards } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { AiService } from 'src/app/modules/ai/ai.service'
import { bindLogger } from 'src/core/utils/log'

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('ai')
export class AiController {
	private readonly logger = bindLogger(this)
	constructor(private readonly aiService: AiService) {}
}
