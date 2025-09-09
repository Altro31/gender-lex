import { TypedFormData, TypedRoute } from '@nestia/core'
import { Controller, Get, Param, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import * as Multer from 'multer'
import { AnaliceDTO } from 'src/app/modules/analysis/dto/analice.dto'
import { Item } from 'src/app/modules/analysis/dto/item.dto'
import { bindLogger } from 'src/core/utils/log'
import { Auth } from 'src/security/modules/auth/decorators/auth.decorator'
import { AnalysisService } from './analysis.service'

@ApiTags('Analysis')
@Auth()
@Controller('analysis')
export class AnalysisController {
	private readonly logger = bindLogger(this)
	private readonly items = [] as Item[]

	constructor(private readonly analysisService: AnalysisService) {}

	@TypedRoute.Post('prepare')
	prepare(
		@TypedFormData.Body(() => Multer())
		{ files = [], text, preset }: AnaliceDTO,
	) {
		const toAnalice = [] as { input: File | string; preset: string }[]
		if (files.length) {
			for (const file of files) {
				toAnalice.push({ input: file, preset })
			}
		}
		if (text) {
			toAnalice.push({ input: text, preset })
		}

		return Promise.race(
			toAnalice.map(i => this.analysisService.prepare(i.input, i.preset)),
		)
	}

	@Post('start/:id')
	start(@Param('id') id: string) {
		return this.analysisService.start(id)
	}

	@Get('status-count')
	statusCount() {
		return this.analysisService.statusCount()
	}
}
