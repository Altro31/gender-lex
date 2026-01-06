import { paginationSchema } from "@/lib/pagination"
import { AnalysisStatus } from "@repo/db/models"
import z from "zod"

export const analysisModels = {
    // Note: File handling in Hono is different from Elysia
    // Files should be validated at the route level using FormData
    prepareInput: z.object({
        files: z.any().optional(), // Files will be handled via FormData
        text: z.string().optional(),
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
        all: z.number().int(),
        pending: z.number().int(),
        analyzing: z.number().int(),
        done: z.number().int(),
        error: z.number().int(),
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
