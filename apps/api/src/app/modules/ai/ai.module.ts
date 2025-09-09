import { Module } from '@nestjs/common'
import { AiController } from './ai.controller'
import { AiService } from './ai.service'
import { AuthModule } from 'src/security/modules/auth/auth.module'

@Module({
	exports: [AiService],
	controllers: [AiController],
	providers: [AiService],
	imports: []
})
export class AiModule {}
