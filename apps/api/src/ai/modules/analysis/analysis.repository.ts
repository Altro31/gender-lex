import type { CreateAnalysisDto } from 'src/ai/modules/analysis/dto/create-analysis.dto'
import type { UpdateAnalysisDto } from 'src/ai/modules/analysis/dto/update-analysis.dto'
import { BaseRepository } from 'src/core/utils/repository'

export class AnalysisRepository extends BaseRepository('analysis') {
	create(data: CreateAnalysisDto) {
		return this.prisma.analysis.create({
			data: {
				...data,
				biasedMetaphors: [],
				biasedTerms: [],
				modifiedTextAlternatives: [],
			},
		})
	}

	update(id: string, data: UpdateAnalysisDto) {
		return this.prisma.analysis.update({ where: { id }, data })
	}
}
