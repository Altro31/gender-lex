import { Controller, Get } from '@nestjs/common'
import { Auth } from 'src/security/modules/auth/decorators/auth.decorator'
import { AnalysisService } from './analysis.service'
import type { StatusCountDTO } from 'src/ai/modules/analysis/dto/status-count.dto'

@Auth()
@Controller('analysis')
export class AnalysisController {
	constructor(private readonly analysisService: AnalysisService) {}

	@Get('status-count')
	statusCount(): Promise<StatusCountDTO> {
		return this.analysisService.statusCount()
	}
}
