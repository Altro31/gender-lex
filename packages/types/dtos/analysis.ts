import { z } from "zod";
import { Pagination } from "./shared/pagination";
import { Schema } from "effect";
import { AnalysisStatus } from "@repo/db/models";

export type PrepareAnalyisisInput = z.infer<typeof PrepareAnalyisisInput>;
export const PrepareAnalyisisInput = z
  .object({
    text: z.string().optional(),
    files: z.file().array().optional(),
    selectedPreset: z.string(),
  })
  .superRefine(({ text, files }, ctx) => {
    if (!(text || files?.length)) {
      ctx.addIssue({
        code: "custom",
        message: "Almost a text o files must be provided",
        path: ["files"],
      });
    }
  });

export type AnalysisFindManyQueryParams =
  typeof AnalysisFindManyQueryParams.Type;
export const AnalysisFindManyQueryParams = Pagination.pipe(
  Schema.extend(
    Schema.Struct({
      q: Schema.String.pipe(Schema.optional),
      status: Schema.Enums(AnalysisStatus).pipe(Schema.optional),
    })
  ),
  Schema.standardSchemaV1
);
