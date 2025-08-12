import { AuthGuard, Session, type UserSession } from '@mguay/nestjs-better-auth'
import {
	Body,
	Controller,
	NotFoundException,
	Param,
	Post,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger'
import type { Analysis } from '@repo/db/models'
import { AnaliceDTO } from 'src/ai/modules/ai/dto/analice.dto'
import { PrepareResponseDTO } from 'src/ai/modules/ai/dto/prepare-response.dto'
import { AnalysisService } from 'src/ai/modules/analysis/analysis.service'
import { ExtractorService } from 'src/ai/modules/extractor/extractor.service'
import { AiService } from './ai.service'

@ApiBearerAuth()
@UseGuards(AuthGuard)
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
		@Body() body: AnaliceDTO,
		@Session() session: UserSession,
	): Promise<PrepareResponseDTO> {
		const text = (
			file?.size
				? await this.extractorService.extractPDFText(file)
				: body.text
		)!
		const analysis = await this.analysisService.create({
			originalText: text,
			visibility: session ? 'private' : 'public',
			userId: session ? session.user.id : undefined,
		})
		return { data: { id: analysis.id } }
	}

	@Post('start/:id')
	async start(@Param('id') id: string) {
		const analysis = await this.analysisService.findOne(id)
		if (!analysis) {
			throw new NotFoundException('Analysis not found')
		}
		let result = {} as Analysis
		try {
			result = (
				analysis.status === 'pending'
					? await this.aiService.analice(analysis.originalText)
					: {}
			) as Analysis
			result.status = 'done'
			void this.analysisService.update(id, result)
		} catch (error) {
			console.error(error)
			void this.analysisService.update(id, { ...result, status: 'error' })
		}
		return { ...analysis, ...result }
	}
}
