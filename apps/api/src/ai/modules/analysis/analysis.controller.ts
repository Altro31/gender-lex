import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
} from '@nestjs/common'
import { AnalysisService } from './analysis.service'
import { CreateAnalysisDto } from './dto/create-analysis.dto'
import { UpdateAnalysisDto } from './dto/update-analysis.dto'
import { ApiRequestParams, RequestParams } from 'src/core/utils/params'
import { ApiBearerAuth } from '@nestjs/swagger'
import { JWTAuthGuard } from 'src/security/modules/auth/guards/jwt_auth.guard'

@ApiBearerAuth()
@UseGuards(JWTAuthGuard())
@Controller('analysis')
export class AnalysisController {
	constructor(private readonly analysisService: AnalysisService) {}

	@Post()
	create(@Body() createAnalysisDto: CreateAnalysisDto) {
		return this.analysisService.create(createAnalysisDto)
	}

	@ApiRequestParams()
	@Get()
	findAll(@RequestParams() params: any) {
		return this.analysisService.findAll(params)
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.analysisService.findOne(id)
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateAnalysisDto: UpdateAnalysisDto,
	) {
		return this.analysisService.update(id, updateAnalysisDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.analysisService.remove(id)
	}
}
