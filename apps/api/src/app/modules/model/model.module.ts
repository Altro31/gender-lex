import { Module } from '@nestjs/common'
import { AiModule } from 'src/app/modules/ai/ai.module'
import { ModelController } from 'src/app/modules/model/model.controller'
import { ModelRepository } from 'src/app/modules/model/model.repository'
import { ModelService } from 'src/app/modules/model/model.service'

@Module({
	controllers: [ModelController],
	providers: [ModelService, ModelRepository],
	exports: [ModelService],
	imports: [AiModule],
})
export class ModelModule {}
