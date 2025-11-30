import { effectPlugin } from '@/lib/effect'
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
		({ body, runtime }) => {
			const program = Effect.gen(function* () {
				const modelService = yield* ModelService
				yield* modelService.create(body)
				return { ok: true } as const
			}).pipe(ModelService.provide)
			return runtime.runPromise(program)
		},
		{ body: 'createModelInput', response: 'createModelOutput' },
	)
	.post(
		':id/test-connection',
		({ runtime, params }) => {
			const program = Effect.gen(function* () {
				const modelService = yield* ModelService
				const res = yield* modelService.testConnection(params.id)
				return Boolean(res)
			}).pipe(ModelService.provide)
			return runtime.runPromise(program)
		},
		{ response: { 200: 'testConnectionOutput', 404: t.String() } },
	)
