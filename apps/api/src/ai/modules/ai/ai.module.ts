import { Module } from '@nestjs/common'
import { ExtractorModule } from 'src/ai/modules/extractor/extractor.module'
import { AnalysisModule } from 'src/ai/modules/analysis/analysis.module'
import { AiController } from './ai.controller'
import { AiService } from './ai.service'

@Module({
	exports: [AiService],
	controllers: [AiController],
	imports: [ExtractorModule, AnalysisModule],
	providers: [AiService],
})
export class AiModule {}
