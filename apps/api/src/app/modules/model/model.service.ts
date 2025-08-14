import { Injectable } from '@nestjs/common'
import { ModelRepository } from 'src/app/modules/model/model.repository'

@Injectable()
export class ModelService {
	constructor(public readonly repository: ModelRepository) {}
}
