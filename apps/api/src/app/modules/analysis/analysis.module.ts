import { Module } from '@nestjs/common'
import { AiModule } from 'src/app/modules/ai/ai.module'
import { AnalysisRepository } from 'src/app/modules/analysis/analysis.repository'
import { ExtractorModule } from 'src/app/modules/extractor/extractor.module'
import { AnalysisController } from './analysis.controller'
import { AnalysisService } from './analysis.service'

@Module({
	controllers: [AnalysisController],
	providers: [AnalysisService, AnalysisRepository],
	exports: [AnalysisService],
	imports: [AiModule, ExtractorModule],
})
export class AnalysisModule {}
