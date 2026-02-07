import type { AnalysisOutput } from "@/modules/bias-detection/service"
import type { Analysis } from "@repo/db/models"
import type { DeepPartial } from "ai"
import type { SimplifyDeep } from "type-fest"

export type AnalysisUpdate = SimplifyDeep<
    Omit<Analysis, keyof AnalysisOutput> & DeepPartial<AnalysisOutput>
>
