import type { Analysis, RawAnalysis } from "@repo/db/models"
import type { DeepPartial } from "ai"
import type { SimplifyDeep } from "type-fest"

export type AnalysisUpdate = SimplifyDeep<Analysis & DeepPartial<RawAnalysis>>
