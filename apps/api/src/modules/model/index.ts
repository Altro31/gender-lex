import { ModelService } from '@/modules/model/service'
import { Effect } from 'effect'
import { Hono } from 'hono'

const model = new Hono()

model.post('/', async (c) => {
	const runEffect = c.get('runEffect') as any
	const body = await c.req.json()
	const program = Effect.gen(function* () {
		const modelService = yield* ModelService
		yield* modelService.create(body as any)
		return { ok: true } as const
	}).pipe(ModelService.provide)
	const result = await runEffect(program)
	return c.json(result)
})

model.post('/:id/test-connection', async (c) => {
	const runEffect = c.get('runEffect') as any
	const id = c.req.param('id')
	const program = Effect.gen(function* () {
		const modelService = yield* ModelService
		const res = yield* modelService.testConnection(id)
		return Boolean(res)
	}).pipe(ModelService.provide)
	const result = await runEffect(program)
	return c.json(result)
})

export default model
