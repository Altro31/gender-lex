import { Module } from '@nestjs/common'
import { ModelController } from 'src/ai/modules/model/model.controller'
import { ModelService } from 'src/ai/modules/model/model.service'

@Module({
	controllers: [ModelController],
	providers: [ModelService],
	exports: [ModelService],
})
export class ModelModule {}
