import type { findPresets } from "@/services/preset"

export type PresetsResponse = Awaited<ReturnType<typeof findPresets>>
