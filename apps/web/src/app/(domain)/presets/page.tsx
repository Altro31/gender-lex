import PresetsListContainer from "@/sections/preset/list/preset-list-container"
import { findPresets } from "@/services/preset"

export default async function PresetsPage({
	searchParams,
}: PageProps<"/presets">) {
	const { page = 1, q } = await searchParams
	const { data, error } = await findPresets({ page: Number(page), q })
	if (error) throw new Error("Failed to retrieve presets")
	return <PresetsListContainer presetResponse={data} />
}
