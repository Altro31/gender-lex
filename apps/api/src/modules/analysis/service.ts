import { isFile } from '@/lib/file'
import type { FindManyQueryParams } from '@/modules/analysis/model'
import { BiasDetectionService } from '@/modules/bias-detection/service'
import type { Analysis, AnalysisStatus } from '@repo/db/models'
import { Console, Effect, pipe } from 'effect'
import { ExtractorService } from '../extractor/service'
import { AnalysisNotFoundError } from './error'
import { AnalysisRepository } from './repository'

export class AnalysisService extends Effect.Service<AnalysisService>()(
	'AnalysisService',
	{
		effect: Effect.gen(function* () {
			const extractorService = yield* ExtractorService
			const biasDetectionService = yield* BiasDetectionService
			const repository = yield* AnalysisRepository

			const service = {
				statusCount: () =>
					Effect.gen(service, function* () {
						const [all, pending, analyzing, done, error] =
							yield* Effect.all(
								[
									repository.count(),
									this.countByStatus('pending'),
									this.countByStatus('analyzing'),
									this.countByStatus('done'),
									this.countByStatus('error'),
								],
								{ concurrency: 'unbounded' },
							)
						return { all, pending, analyzing, done, error }
					}),

				countByStatus: (status: AnalysisStatus) =>
					repository.count({ where: { status } }),

				start: (id: string) =>
					Effect.gen(function* () {
						const analysis = yield* repository.findUnique({
							where: { id },
							include: {
								Preset: {
									include: {
										Models: { include: { Model: true } },
									},
								},
							},
						})
						if (!analysis) {
							return yield* new AnalysisNotFoundError()
						}

						const result = yield* pipe(
							analysis.status === 'pending'
								? biasDetectionService.analice(analysis as any)
								: Effect.succeed({} as Analysis),
							Effect.andThen(
								res => ({ ...res, status: 'done' }) as Analysis,
							),
							Effect.tap(res =>
								repository
									.update({ where: { id }, data: res })
									.pipe(Effect.fork),
							),
							Effect.catchAll(e =>
								pipe(
									Console.log(e),
									Effect.as({}),
									Effect.tap(() =>
										repository
											.update({
												where: { id },
												data: { status: 'error' },
											})
											.pipe(Effect.fork),
									),
								),
							),
						)
						return { ...analysis, ...result }
					}),

				prepare: (input: string | File, preset: string) =>
					Effect.gen(function* () {
						const text = isFile(input)
							? yield* extractorService.extractPDFText(input)
							: input

						const analysis = yield* repository.create({
							data: {
								originalText: text,
								modifiedTextAlternatives: [],
								biasedTerms: [],
								biasedMetaphors: [],
								Preset: { connect: { id: preset } },
							},
						})
						return { id: analysis.id }
					}),

				delete: (id: string) => repository.delete({ where: { id } }),

				findOne: (id: string) =>
					repository.findUniqueOrThrow({
						where: { id },
						include: { Preset: true },
					}),

				findMany: ({
					page,
					pageSize,
					q,
					status,
				}: FindManyQueryParams) =>
					repository.findMany({
						where: {
							name: { contains: q, mode: 'insensitive' },
							status: status as any,
						},
						include: { Preset: true },
						skip: (page! - 1) * pageSize!,
						take: pageSize!,
						orderBy: [{ createdAt: 'desc' }, { updatedAt: 'desc' }],
					}),

				redo: (id: string) =>
					repository.update({
						where: { id },
						data: { status: 'pending' },
					}),
			}
			return service
		}),
		dependencies: [
			ExtractorService.Default,
			BiasDetectionService.Default,
			AnalysisRepository.Default,
		],
	},
) {
	static provide = Effect.provide(this.Default)
}
