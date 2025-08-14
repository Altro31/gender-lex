import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiConsumes } from '@nestjs/swagger'
import { AnaliceDTO } from 'src/app/modules/analysis/dto/analice.dto'
import { PrepareResponseDTO } from 'src/app/modules/analysis/dto/prepare-response.dto'
import { StatusCountDTO } from 'src/app/modules/analysis/dto/status-count.dto'
import { isFile } from 'src/core/utils/file'
import { Auth } from 'src/security/modules/auth/decorators/auth.decorator'
import { AnalysisService } from './analysis.service'

@Auth()
@Controller('analysis')
export class AnalysisController {
	constructor(private readonly analysisService: AnalysisService) {}

	@Post('prepare')
	@UseInterceptors(FileInterceptor('file'))
	@ApiConsumes('multipart/form-data')
	prepare(
		@UploadedFile() file: Express.Multer.File,
		@Body() body: AnaliceDTO,
	): Promise<PrepareResponseDTO> {
		return this.analysisService.prepare(isFile(file) ? file : body.text!)
	}

	@Post('start/:id')
	start(@Param('id') id: string) {
		return this.analysisService.start(id)
	}

	@Get('status-count')
	statusCount(): Promise<StatusCountDTO> {
		return this.analysisService.statusCount()
	}
}
