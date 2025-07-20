import { Injectable } from '@nestjs/common'
import type { Model } from '@repo/db/models'
import { CreateModelDTO } from 'src/ai/modules/model/dto/create-model.dto'
import { UpdateModelDTO } from 'src/ai/modules/model/dto/update-model.dto'
import { BaseRepository } from 'src/core/utils/repository'

@Injectable()
export class ModelRepository extends BaseRepository('model') {
	create(data: CreateModelDTO): Promise<Model> {
		return this.prisma.model.create({ data })
	}

	update(id: string, data: UpdateModelDTO): Promise<Model> {
		return this.prisma.model.update({ data, where: { id } })
	}
}
