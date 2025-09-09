import { Module } from '@nestjs/common'
import { AnalysisRepository } from 'src/app/modules/analysis/analysis.repository'
import { BiasDetectionModule } from 'src/app/modules/bias-detection/bias-detection.module'
import { ExtractorModule } from 'src/app/modules/extractor/extractor.module'
import { AnalysisController } from './analysis.controller'
import { AnalysisService } from './analysis.service'

@Module({
	controllers: [AnalysisController],
	providers: [AnalysisService, AnalysisRepository],
	exports: [AnalysisService],
	imports: [ExtractorModule, BiasDetectionModule],
})
export class AnalysisModule {}
