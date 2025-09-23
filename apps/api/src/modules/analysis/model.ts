import {
    AnalysisSchema,
    ModelSchema,
    PresetModelSchema,
    PresetSchema,
} from "@repo/db/zod"
import { t } from "elysia"

export const analysisModels = {
    prepareInput: t.Object({
        files: t.Files({ default: [] }),
        text: t.Optional(t.String()),
        preset: t.String(),
    }),
    prepareOutput: t.Object({ id: t.String() }),
    startOutput: AnalysisSchema.extend({
        Preset: PresetSchema.extend({
            Models: PresetModelSchema.extend({ Model: ModelSchema }).array(),
        }),
    }).omit({ User: true }),
    statusCountOutput: t.Object({
        all: t.Integer(),
        pending: t.Integer(),
        analyzing: t.Integer(),
        done: t.Integer(),
        error: t.Integer(),
    }),
    findOneOutput: AnalysisSchema.extend({ Preset: PresetSchema }).omit({
        User: true,
    }),
    redoOutput: AnalysisSchema.omit({ User: true }),
}
