import { TypedBody, TypedParam, TypedRoute } from '@nestia/core'
import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { Prisma } from '@repo/db/models'
import { ModelService } from 'src/app/modules/model/model.service'
import { bindLogger } from 'src/core/utils/log'
import { Auth } from 'src/security/modules/auth/decorators/auth.decorator'

@Auth()
@ApiTags('Model')
@Controller('model')
export class ModelController {
	private readonly logger = bindLogger(this)
	constructor(private readonly modelService: ModelService) {}

	@TypedRoute.Post()
	async create(
		@TypedBody()
		input: Pick<
			Prisma.ModelCreateInput,
			'apiKey' | 'connection' | 'name' | 'settings'
		>,
	) {
		await this.modelService.create(input)
		return { ok: true }
	}

	@TypedRoute.Post(':id/test-connection')
	async testConnection(@TypedParam('id') id: string) {
		return { ok: await this.modelService.testConnection(id) }
	}
}
