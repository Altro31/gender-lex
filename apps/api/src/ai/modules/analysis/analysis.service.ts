import { Inject, Injectable } from '@nestjs/common'
import type { PrismaClient } from '@repo/db'
import type { AnalysisStatus } from '@repo/db/models'
import { AnalysisRepository } from 'src/ai/modules/analysis/analysis.repository'
import { CreateAnalysisDto } from './dto/create-analysis.dto'
import { UpdateAnalysisDto } from './dto/update-analysis.dto'
import { ENHANCED_PRISMA } from '@zenstackhq/server/nestjs'

@Injectable()
export class AnalysisService {
	constructor(
		private readonly analysisRepository: AnalysisRepository,
		@Inject(ENHANCED_PRISMA) private readonly prisma: PrismaClient,
	) {}

	create(createAnalysisDto: CreateAnalysisDto) {
		return this.analysisRepository.create(createAnalysisDto)
	}

	findOne(id: string) {
		return this.analysisRepository.findOneBy('id', id)
	}

	update(id: string, updateAnalysisDto: UpdateAnalysisDto) {
		return this.analysisRepository.update(id, updateAnalysisDto)
	}

	remove(id: string) {
		return this.analysisRepository.remove(id)
	}

	async statusCount() {
		const [all, pending, analyzing, done, error] = await Promise.all([
			this.prisma.analysis.count(),
			this.countByStatus('pending'),
			this.countByStatus('analyzing'),
			this.countByStatus('done'),
			this.countByStatus('error'),
		])
		return { all, pending, analyzing, done, error }
	}

	countByStatus(status: AnalysisStatus) {
		return this.prisma.analysis.count({ where: { status } })
	}
}
