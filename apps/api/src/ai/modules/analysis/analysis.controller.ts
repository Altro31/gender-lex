import { Controller } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { AnalysisService } from './analysis.service'

@ApiBearerAuth()
@Controller('analysis')
export class AnalysisController {
	constructor(private readonly analysisService: AnalysisService) {}
}
