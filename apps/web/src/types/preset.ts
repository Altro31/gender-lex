import type { ApiResponse } from "@/lib/api/utils"

export type PresetsResponse = ApiResponse<"/zen/preset">
export type PresetsResponseItem = PresetsResponse["data"][number]
