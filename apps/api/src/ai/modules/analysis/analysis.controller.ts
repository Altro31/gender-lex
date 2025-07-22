import {
	Controller,
	UseGuards
} from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { JWTAuthGuard } from 'src/security/modules/auth/guards/jwt_auth.guard'
import { AnalysisService } from './analysis.service'

@ApiBearerAuth()
@UseGuards(JWTAuthGuard())
@Controller('analysis')
export class AnalysisController {
	constructor(private readonly analysisService: AnalysisService) {}
}
