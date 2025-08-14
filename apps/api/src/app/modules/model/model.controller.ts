import { Controller } from '@nestjs/common'
import { ModelService } from 'src/app/modules/model/model.service'

@Controller('model')
export class ModelController {
	constructor(private readonly modelService: ModelService) {}
}
