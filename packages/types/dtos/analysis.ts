import { z } from "zod";

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
