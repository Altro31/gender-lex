import type { Analysis } from "@repo/db/models";

export function isAnalysis(analysis: any): analysis is Analysis {
  return analysis?.status === "done";
}
