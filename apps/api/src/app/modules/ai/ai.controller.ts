import { AuthGuard } from '@mguay/nestjs-better-auth'
import { Controller, UseGuards } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { AiService } from 'src/app/modules/ai/ai.service'

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('ai')
export class AiController {
	constructor(private readonly aiService: AiService) {}
}
