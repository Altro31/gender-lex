import { Injectable, NotFoundException } from '@nestjs/common'
import type { Analysis, AnalysisStatus } from '@repo/db/models'
import { AnalysisRepository } from 'src/app/modules/analysis/analysis.repository'
import { BiasDetectionService } from 'src/app/modules/bias-detection/bias-detection.service'
import { ExtractorService } from 'src/app/modules/extractor/extractor.service'
import { isFile } from 'src/core/utils/file'

@Injectable()
export class AnalysisService {
	constructor(
		public readonly repository: AnalysisRepository,
		private readonly extractorService: ExtractorService,
		private readonly biasDetectionService: BiasDetectionService,
	) {}

	async statusCount() {
		const [all, pending, analyzing, done, error] = await Promise.all([
			this.repository.count(),
			this.countByStatus('pending'),
			this.countByStatus('analyzing'),
			this.countByStatus('done'),
			this.countByStatus('error'),
		])
		return { all, pending, analyzing, done, error }
	}

	countByStatus(status: AnalysisStatus) {
		return this.repository.count({ where: { status } })
	}

	async start(id: string) {
		const analysis = await this.repository.findUnique({
			where: { id },
			include: {
				Preset: { include: { Models: { include: { Model: true } } } },
			},
		})
		if (!analysis) {
			throw new NotFoundException('Analysis not found')
		}
		let result = {} as Analysis
		try {
			result = (
				analysis.status === 'pending'
					? await this.biasDetectionService.analice(analysis)
					: {}
			) as Analysis
			result.status = 'done'
			void this.repository.update({ where: { id }, data: result })
		} catch (error) {
			console.error(error)
			void this.repository.update({
				where: { id },
				data: { ...result, status: 'error' },
			})
		}
		return { ...analysis, ...result }
	}

	async prepare(input: string | File, preset: string) {
		const text = isFile(input)
			? await this.extractorService.extractPDFText(input)
			: input
		const analysis = await this.repository.create({
			data: {
				originalText: text,
				modifiedTextAlternatives: [],
				biasedTerms: [],
				biasedMetaphors: [],
				Preset: { connect: { id: preset } },
			},
		})
		return { id: analysis.id }
	}
}
