import { z } from "zod/mini";
import { PrepareAnalyisisInput } from "@repo/types/dtos/analysis";
export type HomeSchema = z.infer<typeof HomeSchema>;
export const HomeSchema = PrepareAnalyisisInput;
