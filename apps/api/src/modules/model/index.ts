import { effectPlugin } from '@/plugins/effect.plugin'
import { modelModels } from '@/modules/model/model'
import { ModelService } from '@/modules/model/service'
import { Effect } from 'effect'
import Elysia, { t } from 'elysia'

export default new Elysia({
	name: 'model.controller',
	tags: ['Model'],
	prefix: 'model',
})
	.use(effectPlugin)
	.model(modelModels)
	.post(
		'',
		({ body, runEffect }) => {
			const program = Effect.gen(function* () {
				const modelService = yield* ModelService
				yield* modelService.create(body as any)
				return { ok: true } as const
			}).pipe(ModelService.provide)
			return runEffect(program)
		},
		{ response: 'createModelOutput' },
	)
	.post(
		':id/test-connection',
		({ runEffect, params }) => {
			const program = Effect.gen(function* () {
				const modelService = yield* ModelService
				const res = yield* modelService.testConnection(params.id)
				return Boolean(res)
			}).pipe(ModelService.provide)
			return runEffect(program)
		},
		{ response: { 200: 'testConnectionOutput', 404: t.String() } },
	)
