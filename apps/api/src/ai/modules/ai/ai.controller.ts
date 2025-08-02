import {
	Body,
	Controller,
	NotFoundException,
	Param,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger'
import { Analysis } from '@repo/db/models'
import { AnaliceDTO } from 'src/ai/modules/ai/dto/analice.dto'
import { PrepareResponseDTO } from 'src/ai/modules/ai/dto/prepare-response.dto'
import { AnalysisService } from 'src/ai/modules/analysis/analysis.service'
import { ExtractorService } from 'src/ai/modules/extractor/extractor.service'
import { AiService } from './ai.service'

@ApiBearerAuth()
@Controller('ai/analysis')
export class AiController {
	constructor(
		private readonly aiService: AiService,
		private readonly extractorService: ExtractorService,
		private readonly analysisService: AnalysisService,
	) {}

	@Post('prepare')
	@UseInterceptors(FileInterceptor('file'))
	@ApiConsumes('multipart/form-data')
	async prepare(
		@UploadedFile() file: Express.Multer.File,
		@Body() { text: inputText }: AnaliceDTO,
	): Promise<PrepareResponseDTO> {
		const text = (
			file ? await this.extractorService.extractPDFText(file) : inputText
		)!
		const analysis = await this.analysisService.create({
			originalText: text,
		})
		return { data: { id: analysis.id } }
	}

	@Post('start/:id')
	async start(@Param('id') id: string) {
		const analysis = await this.analysisService.findOne(id)
		if (!analysis) {
			throw new NotFoundException('Analysis not found')
		}
		const result =
			analysis.status === 'analyzing'
				? await this.aiService.analice(analysis.originalText)
				: {}
		void this.analysisService.update(id, { ...result, status: 'done' })
		return { data: { ...analysis, ...result } as Analysis }
	}
}
