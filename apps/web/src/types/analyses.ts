import type { findAnalyses, getStatusCount } from "@/services/analysis"

export type AnalysesResponse = Awaited<ReturnType<typeof findAnalyses>>
export type AnalysesResponseItem = AnalysesResponse[number]

export type StatusCountResponse = Awaited<ReturnType<typeof getStatusCount>>
