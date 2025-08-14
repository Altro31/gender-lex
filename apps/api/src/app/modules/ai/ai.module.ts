import { Module } from '@nestjs/common'
import { AiController } from './ai.controller'
import { AiService } from './ai.service'

@Module({
	exports: [AiService],
	controllers: [AiController],
	providers: [AiService],
})
export class AiModule {}
