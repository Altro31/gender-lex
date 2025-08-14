import { Module } from '@nestjs/common'
import { ModelController } from 'src/app/modules/model/model.controller'
import { ModelRepository } from 'src/app/modules/model/model.repository'
import { ModelService } from 'src/app/modules/model/model.service'

@Module({
	controllers: [ModelController],
	providers: [ModelService, ModelRepository],
	exports: [ModelService],
})
export class ModelModule {}
