import { paginationSchema } from "@/lib/pagination"
import { AnalysisStatus } from "@repo/db/models"
import {
    AnalysisSchema,
    ModelSchema,
    PresetModelSchema,
    PresetSchema,
} from "@repo/db/zod"
import z from "zod"

export const analysisModels = {
    prepareInput: z.object({
        files: z.file().array().default([]),
        text: z.optional(z.string()),
        selectedPreset: z.string(),
    }),
    prepareOutput: z.object({ id: z.string() }),
    startOutput: AnalysisSchema.extend({
        Preset: PresetSchema.extend({
            Models: PresetModelSchema.extend({ Model: ModelSchema }).array(),
        }),
    }).omit({ User: true }),
    statusCountOutput: z.object({
        all: z.int(),
        pending: z.int(),
        analyzing: z.int(),
        done: z.int(),
        error: z.int(),
    }),
    findOneOutput: AnalysisSchema.extend({ Preset: PresetSchema }).omit({
        User: true,
    }),
    redoOutput: AnalysisSchema.omit({ User: true }),
    findManyQueryParams: paginationSchema.extend({
        q: z.string().optional(),
        status: z.enum(AnalysisStatus).optional(),
    }),
}

export type FindManyQueryParams = z.infer<
    typeof analysisModels.findManyQueryParams
>
