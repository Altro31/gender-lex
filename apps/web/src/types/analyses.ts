import type { findAnalyses, getStatusCount } from "@/services/analysis";

export type AnalysesResponse = NonNullable<
  Awaited<ReturnType<typeof findAnalyses>>["data"]
>;
export type AnalysesResponseItem = AnalysesResponse[number];

export type StatusCountResponse = Awaited<ReturnType<typeof getStatusCount>>;
