import { Injectable, NotFoundException } from '@nestjs/common'
import type { $Enums, Prisma } from '@repo/db/models'
import { generateText } from 'ai'
import { AiService } from 'src/app/modules/ai/ai.service'
import { ModelRepository } from 'src/app/modules/model/model.repository'
import { SseService } from 'src/core/modules/sse/sse.service'

@Injectable()
export class ModelService {
	constructor(
		public readonly repository: ModelRepository,
		private readonly aiService: AiService,
		private readonly sseService: SseService,
	) {}

	async create(data: Prisma.ModelCreateInput) {
		const model = await this.repository.create({ data })
		void this.testConnection(model.id)
	}

	private async getLanguageModel(id: string) {
		const model = await this.repository.findUnique({ where: { id } })
		if (!model) {
			throw new NotFoundException(`Model with id: ${id} not found`)
		}

		return this.aiService.buildLanguageModel(model.provider, {
			...model.connection,
			apiKey: model.apiKey ?? undefined,
		})
	}

	async testConnection(id: string) {
		const model = await this.getLanguageModel(id)
		try {
			await this.updateModelStatus(id, 'connecting')
			await generateText({
				model,
				messages: [{ content: 'This is just a ping!', role: 'system' }],
			})
			await this.updateModelStatus(id, 'active')
			return true
		} catch {
			await this.updateModelStatus(id, 'error')
			return false
		}
	}

	async updateModelStatus(id: string, status: $Enums.ModelStatus) {
		const model = await this.repository.findUnique({ where: { id } })
		if (!model) {
			throw new NotFoundException(`Model with id: ${id} not found`)
		}
		await this.repository.update({
			where: { id },
			data: {
				connection: {
					identifier: model.connection.identifier,
					url: model.connection.url,
				},
				status,
			},
		})
		this.sseService.broadcast('model.status.change', { id, status })
	}
}
