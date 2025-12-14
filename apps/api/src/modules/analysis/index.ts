import { analysisModels } from '@/modules/analysis/model'
import { Effect } from 'effect'
import Elysia from 'elysia'
import { AnalysisService } from './service'
import { effectPlugin } from '@/plugins/effect.plugin'
import z from 'zod'

export default new Elysia({
	name: 'analysis.controller',
	tags: ['Analysis'],
	prefix: 'analysis',
})
	.use(effectPlugin)
	.model(analysisModels)
	.post(
		'prepare',
		({ body, runEffect }) => {
			const toAnalice = [] as { input: File | string; preset: string }[]
			if (body.files.length) {
				for (const file of body.files) {
					toAnalice.push({ input: file, preset: body.selectedPreset })
				}
			}
			if (body.text) {
				toAnalice.push({
					input: body.text,
					preset: body.selectedPreset,
				})
			}
			const program = Effect.gen(function* () {
				const analysisService = yield* AnalysisService
				return yield* Effect.raceAll(
					toAnalice.map(i =>
						analysisService.prepare(i.input, i.preset),
					),
				)
			}).pipe(AnalysisService.provide)
			return runEffect(program)
		},
		{ body: 'prepareInput', response: 'prepareOutput' },
	)

	.post(
		'start/:id',
		({ runEffect, params }) => {
			const program = Effect.gen(function* () {
				const analysisService = yield* AnalysisService
				return (yield* analysisService.start(params.id)) as any
			}).pipe(AnalysisService.provide)
			return runEffect(program)
		},
		{
			response: {
				// 200: 'startOutput',
				404: z.string(),
			},
		},
	)

	.get(
		'status-count',
		({ runEffect }) => {
			const program = Effect.gen(function* () {
				const analysisService = yield* AnalysisService
				return yield* analysisService.statusCount()
			}).pipe(AnalysisService.provide)
			return runEffect(program)
		},
		{ response: 'statusCountOutput' },
	)

	.delete(':id', async ({ params, runEffect }) => {
		const program = Effect.gen(function* () {
			const analysisService = yield* AnalysisService
			return yield* analysisService.delete(params.id!)
		}).pipe(AnalysisService.provide)

		return runEffect(program)
	})

	.get(
		':id',
		({ runEffect, params }) => {
			const program = Effect.gen(function* () {
				const analysisService = yield* AnalysisService
				return (yield* analysisService.findOne(params.id!)) as any
			}).pipe(AnalysisService.provide)

			return runEffect(program)
		},
		// { response: 'findOneOutput' },
	)

	.get(
		'',
		({ runEffect, query }) => {
			const program = Effect.gen(function* () {
				const analysisService = yield* AnalysisService
				return yield* analysisService.findMany(query)
			}).pipe(AnalysisService.provide)

			return runEffect(program)
		},
		{ query: 'findManyQueryParams' },
	)

	.post(
		':id/redo',
		({ runEffect, params }) => {
			const program = Effect.gen(function* () {
				const analysisService = yield* AnalysisService
				return yield* analysisService.redo(params.id!)
			}).pipe(AnalysisService.provide)

			return runEffect(program)
		},
		// { response: 'redoOutput' },
	)
