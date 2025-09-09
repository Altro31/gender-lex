import type { ApiResponse } from "@/lib/api/utils"
import type { findPresets } from "@/services/preset"

export type PresetsResponse = Awaited<ReturnType<typeof findPresets>>
