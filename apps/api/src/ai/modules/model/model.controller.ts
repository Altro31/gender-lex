import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common'
import { CreateModelDTO } from 'src/ai/modules/model/dto/create-model.dto'
import { ModelService } from 'src/ai/modules/model/model.service'
import { RequestParams } from 'src/core/utils/params'

@Controller('model')
export class ModelController {
	constructor(private readonly modelService: ModelService) {}

	@Get()
	find(@RequestParams() params: RequestParams) {
		return this.modelService.find(params)
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.modelService.findOne(id)
	}

	@Post()
	create(@Body() data: CreateModelDTO) {
		return this.modelService.create(data)
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() data: CreateModelDTO) {
		return this.modelService.update(id, data)
	}

	@Delete(':id')
	delete(@Param('id') id: string) {
		return this.modelService.delete(id)
	}
}
