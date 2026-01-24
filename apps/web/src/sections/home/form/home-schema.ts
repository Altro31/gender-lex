import { z } from "zod/mini";
import { PrepareAnalyisisInput } from "@repo/types/dtos/analysis";
export type HomeSchema = z.infer<typeof HomeSchema>;
export const HomeSchema = PrepareAnalyisisInput.safeExtend({
  filesObj: z.array(z.object({ file: z.file() })),
  preset: z.nullish(z.object({ id: z.string() })),
});
