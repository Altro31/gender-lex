import { Module } from '@nestjs/common'
import { AnalysisRepository } from 'src/ai/modules/analysis/analysis.repository'
import { AnalysisController } from './analysis.controller'
import { AnalysisService } from './analysis.service'

@Module({
	controllers: [AnalysisController],
	providers: [AnalysisService, AnalysisRepository],
	exports: [AnalysisService],
})
export class AnalysisModule {}
