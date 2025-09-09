import PresetsListContainer from "@/sections/preset/list/preset-list-container"
import { findPresets } from "@/services/preset"

export default async function PresetsPage({
	searchParams,
}: PageProps<"/presets">) {
	const { page = 1, q } = await searchParams
	const presets = await findPresets({ page: Number(page), q: q as string })
	return <PresetsListContainer presets={presets} q={q as string} />
}
