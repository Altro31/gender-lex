import { Module } from '@nestjs/common'
import { AiModule } from 'src/app/modules/ai/ai.module'
import { BiasDetectionService } from 'src/app/modules/bias-detection/bias-detection.service'
import { TerminologyModule } from 'src/app/modules/terminology/terminology.module'
import { AuthModule } from 'src/security/modules/auth/auth.module'

@Module({
	imports: [AiModule, AuthModule, TerminologyModule],
	exports: [BiasDetectionService],
	providers: [BiasDetectionService],
})
export class BiasDetectionModule {}
