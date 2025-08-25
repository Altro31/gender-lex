import type { ApiResponse } from "@/lib/api/utils"

export type ModelsResponse = ApiResponse<"/zen/model">
export type ModelsResponseItem = ModelsResponse["data"][number]
