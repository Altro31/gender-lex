import { FetchHttpClient, HttpClient } from '@effect/platform'
import {
	Injectable,
	NotFoundException,
	type OnModuleInit,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { $Enums, Prisma } from '@repo/db/models'
import { Console, Effect, Match } from 'effect'
import type { EnvTypes } from 'src/app.module'
import { AiService } from 'src/app/modules/ai/ai.service'
import {
	InactiveModelError,
	InvalidModelApiKeyError,
	InvalidModelIdentifierError,
} from 'src/app/modules/model/exceptions/tagged-errors'
import { ModelRepository } from 'src/app/modules/model/model.repository'
import { PrismaService } from 'src/core/modules/prisma/prisma.service'
import { SseService } from 'src/core/modules/sse/sse.service'
import { bindLogger } from 'src/core/utils/log'

type ModelListResponse = { data: { id: string; active: boolean }[] }

@Injectable()
export class ModelService implements OnModuleInit {
	private readonly logger = bindLogger(this)

	constructor(
		public readonly repository: ModelRepository,
		private readonly aiService: AiService,
		private readonly sseService: SseService,
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService<EnvTypes>,
	) {}

	async create(data: Prisma.ModelCreateInput) {
		const model = await this.repository.create({ data })
		void this.testConnection(model.id)
	}

	async testConnection(id: string) {
		const model = await this.repository.findUnique({ where: { id } })
		if (!model) {
			throw new NotFoundException(`Model with id: ${id} not found`)
		}
		await this.updateModelStatus(id, 'connecting')

		const testConnectionProgram = Effect.gen(this, function* () {
			const client = yield* HttpClient.HttpClient
			const url = model.connection.url + '/models'

			const res = yield* client
				.get(url, {
					headers: { Authorization: `Bearer ${model.apiKey}` },
				})
				.pipe(
					Effect.andThen(res => {
						const reqMatcher = Match.type<number>().pipe(
							Match.when(401, () =>
								Effect.fail(new InvalidModelApiKeyError()),
							),
							Match.orElse(
								() =>
									res.json as Effect.Effect<
										ModelListResponse,
										never,
										never
									>,
							),
						)
						return reqMatcher(res.status)
					}),
				)

			const modelItem = res.data.find(
				m => m.id === model.connection.identifier,
			)

			if (!modelItem) {
				return yield* Effect.fail(new InvalidModelIdentifierError())
			}

			if (!modelItem.active) {
				return yield* Effect.fail(new InactiveModelError())
			}

			yield* Effect.promise(() => this.updateModelStatus(id, 'active'))
			return true
		})
			.pipe(
				Effect.catchTags({
					RequestError: e => Console.log('RequestError', e),
					ResponseError: e => Console.log('ResponseError', e),
				}),
				Effect.catchAll(e => {
					return Effect.promise(() =>
						this.updateModelStatus(id, 'error', e.modelError),
					)
				}),
			)
			.pipe(Effect.provide(FetchHttpClient.layer))

		const res = await Effect.runPromise(testConnectionProgram as any)
		return Boolean(res)
	}

	async updateModelStatus(
		id: string,
		status: 'error',
		error: $Enums.ModelError,
	): Promise<void>
	async updateModelStatus(
		id: string,
		status: Exclude<$Enums.ModelStatus, 'error'>,
	): Promise<void>
	async updateModelStatus(
		id: string,
		status: $Enums.ModelStatus,
		error?: $Enums.ModelError,
	) {
		await this.repository.update({
			where: { id },
			data: { status, error: error || null },
		})
		this.sseService.broadcast('model.status.change', { id, status })
	}

	async onModuleInit() {
		const models = [
			{
				name: 'Qwen3-32b',
				connection: {
					identifier: 'qwen/qwen3-32b',
					url: 'https://api.groq.com/openai/v1',
				},

				settings: { temperature: 0.2 },
				apiKey: this.configService.getOrThrow('GROQ_API_KEY'),
				isDefault: true,
			},
			{
				name: 'GPT-OSS-120b',
				connection: {
					identifier: 'openai/gpt-oss-120b',
					url: 'https://api.groq.com/openai/v1',
				},

				settings: { temperature: 0.2 },
				apiKey: this.configService.getOrThrow('GROQ_API_KEY'),
				isDefault: true,
			},
			{
				name: 'Deepseek-R1-32b',
				connection: {
					identifier: 'deepseek-r1-distill-qwen-32b',
					url: 'https://api.groq.com/openai/v1',
				},

				settings: { temperature: 0.2 },
				apiKey: this.configService.getOrThrow('GROQ_API_KEY'),
				isDefault: true,
			},
		] satisfies Prisma.ModelCreateInput[]

		await this.prismaService.$transaction(async tx => {
			await Promise.all(
				models.map(async model => {
					const exist = await tx.model.findFirst({
						where: { name: model.name, isDefault: true },
					})
					if (exist) return
					return tx.model.create({ data: model })
				}),
			)
		})

		this.logger.log('Default models initialized!')
	}
}
