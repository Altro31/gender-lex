import type { findModels } from "@/services/model"

export type ModelsResponse = Awaited<ReturnType<typeof findModels>>
export type ModelsResponseItem = ModelsResponse[number]
