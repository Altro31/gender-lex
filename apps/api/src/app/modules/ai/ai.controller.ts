import { AuthGuard } from '@mguay/nestjs-better-auth'
import { Controller, UseGuards } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { AiService } from 'src/app/modules/ai/ai.service'
import { BaseController } from 'src/core/utils/controller'

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('ai')
export class AiController extends BaseController {
	constructor(private readonly aiService: AiService) {
		super()
	}
}
