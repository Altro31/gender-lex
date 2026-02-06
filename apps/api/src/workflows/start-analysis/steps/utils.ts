import type { AnalysisUpdate } from "@/lib/types/raw-analysis"
import { getWritable } from "workflow"

export const getUpdateStream = () =>
    getWritable<AnalysisUpdate>({ namespace: "update" })
