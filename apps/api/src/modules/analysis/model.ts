import { paginationSchema } from '@/lib/pagination'
import { AnalysisStatus } from '@repo/db/models'
import { Analysis } from '@repo/db/schema/analysis.ts'
import { Model } from '@repo/db/schema/model.ts'
import { PresetModel } from '@repo/db/schema/preset-model.ts'
import { Preset } from '@repo/db/schema/preset.ts'
import { Schema } from 'effect'
import z from 'zod'

export const analysisModels = {
	prepareInput: z.object({
		files: z.file().array().default([]),
		text: z.optional(z.string()),
		selectedPreset: z.string(),
	}),
	prepareOutput: z.object({ id: z.string() }),
	startOutput: Analysis.pipe(
		Schema.extend(
			Schema.Struct({
				Preset: Preset.pipe(
					Schema.extend(
						Schema.Struct({
							Models: PresetModel.pipe(
								Schema.extend(Schema.Struct({ Model })),
								Schema.Array,
							),
						}),
					),
				),
			}),
		),
		Schema.omit('userId'),
	),
	statusCountOutput: z.object({
		all: z.int(),
		pending: z.int(),
		analyzing: z.int(),
		done: z.int(),
		error: z.int(),
	}),
	findOneOutput: Analysis.pipe(
		Schema.extend(Schema.Struct({ Preset })),
		Schema.omit('userId'),
	),
	redoOutput: Analysis.pipe(Schema.omit('userId')),
	findManyQueryParams: paginationSchema.extend({
		q: z.string().optional(),
		status: z.enum(AnalysisStatus).optional(),
	}),
}

export type FindManyQueryParams = z.infer<
	typeof analysisModels.findManyQueryParams
>
