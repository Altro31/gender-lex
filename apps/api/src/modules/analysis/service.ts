import { isFile } from '@/lib/file'
import type { FindManyQueryParams } from '@/modules/analysis/model'
import { BiasDetectionService } from '@/modules/bias-detection/service'
import type { AnalysisStatus } from '@repo/db/models'
import { Console, Effect, pipe } from 'effect'
import { ExtractorService } from '../extractor/service'
import { AnalysisNotFoundError } from './error'
import { AnalysisRepository } from './repository'
import { effectify } from '@repo/db/effect'

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
									effectify(repository.count()),
									this.countByStatus('pending'),
									this.countByStatus('analyzing'),
									this.countByStatus('done'),
									this.countByStatus('error'),
								],
								{ concurrency: 'unbounded' },
							)
						console.log({ all, pending, analyzing, done, error })
						return { all, pending, analyzing, done, error }
					}),

				countByStatus: (status: AnalysisStatus) =>
					effectify(repository.count({ where: { status } })),

				start: (id: string) =>
					Effect.gen(function* () {
						const analysis = yield* effectify(
							repository.findUnique({
								where: { id },
								include: {
									Preset: {
										include: {
											Models: {
												include: { Model: true },
											},
										},
									},
								},
							}),
						)
						if (!analysis) {
							return yield* new AnalysisNotFoundError()
						}

						if (analysis.status === 'pending') {
							const raw = yield* biasDetectionService.analice(
								analysis as any,
							)
							Object.assign(analysis, raw)
						}
						analysis.status = 'done'
						yield* effectify(
							repository.update({
								where: { id },
								data: analysis as any,
							}),
						).pipe(Effect.forkDaemon)

						return analysis
					}).pipe(
						Effect.catchAll(e =>
							pipe(
								Console.log(e),
								Effect.tap(() =>
									effectify(
										repository.update({
											where: { id },
											data: { status: 'error' },
										}),
									).pipe(Effect.forkDaemon),
								),
							),
						),
					),

				prepare: (input: string | File, preset: string) =>
					Effect.gen(function* () {
						const text = isFile(input)
							? yield* extractorService.extractPDFText(input)
							: input

						const analysis = yield* effectify(
							repository.create({
								data: {
									originalText: text,
									modifiedTextAlternatives: [],
									biasedTerms: [],
									biasedMetaphors: [],
									Preset: { connect: { id: preset } },
								},
							}),
						)
						return { id: analysis.id }
					}),

				delete: (id: string) =>
					effectify(repository.delete({ where: { id } })),

				findOne: (id: string) =>
					effectify(
						repository.findUniqueOrThrow({
							where: { id },
							include: { Preset: true },
						}),
					),

				findMany: ({
					page,
					pageSize,
					q,
					status,
				}: FindManyQueryParams) =>
					effectify(
						repository.findMany({
							where: {
								name: { contains: q, mode: 'insensitive' },
								status: status as any,
							},
							include: { Preset: true },
							skip: (page! - 1) * pageSize!,
							take: pageSize!,
							orderBy: [
								{ createdAt: 'desc' },
								{ updatedAt: 'desc' },
							],
						}),
					),

				redo: (id: string) =>
					effectify(
						repository.update({
							where: { id },
							data: { status: 'pending' },
						}),
					),
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
