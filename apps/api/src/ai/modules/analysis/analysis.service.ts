import { Injectable } from '@nestjs/common'
import { AnalysisRepository } from 'src/ai/modules/analysis/analysis.repository'
import { CreateAnalysisDto } from './dto/create-analysis.dto'
import { UpdateAnalysisDto } from './dto/update-analysis.dto'

@Injectable()
export class AnalysisService {
	constructor(private readonly analysisRepository: AnalysisRepository) {}

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
}
