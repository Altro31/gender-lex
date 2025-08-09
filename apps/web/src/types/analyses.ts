import type { ApiResponse } from "@/lib/api/utils"

export type AnalysesResponse = ApiResponse<"/zen/analysis">
export type StatusCountResponse = ApiResponse<"/analysis/status-count">
