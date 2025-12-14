import { paginationSchema } from '@/lib/pagination'
import { AnalysisStatus } from '@repo/db/models'
import z from 'zod'

export const analysisModels = {
	prepareInput: z.object({
		files: z.file().array().default([]),
		text: z.optional(z.string()),
		selectedPreset: z.string(),
	}),
	prepareOutput: z.object({ id: z.string() }),
	// startOutput: Schema.Struct({
	// 	...Analysis.fields,
	// 	Preset: Schema.Struct({
	// 		...Preset.fields,
	// 		Models: Schema.Struct({ ...PresetModel.fields, Model }).pipe(
	// 			Schema.Array,
	// 		),
	// 	}),
	// }).pipe(Schema.omit('userId')),
	statusCountOutput: z.object({
		all: z.int(),
		pending: z.int(),
		analyzing: z.int(),
		done: z.int(),
		error: z.int(),
	}),
	// findOneOutput: Schema.Struct({ ...Analysis.fields, Preset }).pipe(
	// 	Schema.omit('userId'),
	// ),
	// redoOutput: Analysis.pipe(Schema.omit('userId')),
	findManyQueryParams: paginationSchema.extend({
		q: z.string().optional(),
		status: z.enum(AnalysisStatus).optional(),
	}),
}

export type FindManyQueryParams = z.infer<
	typeof analysisModels.findManyQueryParams
>
