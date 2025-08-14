import { Module } from '@nestjs/common'
import { AiModule } from 'src/app/modules/ai/ai.module'
import { ExtractorModule } from 'src/app/modules/extractor/extractor.module'
import { AnalysisController } from './analysis.controller'
import { AnalysisService } from './analysis.service'
import { AnalysisRepository } from 'src/app/modules/analysis/analysis.repository'
import * as Repository from 'src/core/utils/repository'

@Module({
	controllers: [AnalysisController],
	providers: [AnalysisService, Repository.register(AnalysisRepository)],
	exports: [AnalysisService],
	imports: [AiModule, ExtractorModule],
})
export class AnalysisModule {}
