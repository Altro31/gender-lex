import { Injectable } from '@nestjs/common'
import { CreateModelDTO } from 'src/ai/modules/model/dto/create-model.dto'
import { UpdateModelDTO } from 'src/ai/modules/model/dto/update-model.dto'
import { ModelRepository } from 'src/ai/modules/model/model.repository'
import { RequestParams } from 'src/core/utils/params'

@Injectable()
export class ModelService {
	constructor(private readonly modelRepository: ModelRepository) {}

	find(params: RequestParams) {
		return this.modelRepository.findAll(params)
	}

	findOne(id: string) {
		return this.modelRepository.findOneBy('id', id)
	}

	create(data: CreateModelDTO) {
		return this.modelRepository.create(data)
	}

	update(id: string, data: UpdateModelDTO) {
		return this.modelRepository.update(id, data)
	}

	delete(id: string) {
		return this.modelRepository.remove(id)
	}
}
