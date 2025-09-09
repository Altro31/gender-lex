import type { ApiResponse } from "@/lib/api/utils"
import type { findAnalyses } from "@/services/analysis"

export type AnalysesResponse = Awaited<ReturnType<typeof findAnalyses>>
export type AnalysesResponseItem = AnalysesResponse[number]

export type StatusCountResponse = ApiResponse<"/analysis/status-count">
