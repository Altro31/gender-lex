import { findPresets } from '@/services/preset'
import PresetsList from './presets-list'

interface Props {
	searchParams: Promise<{ q?: string; page?: string }>
}

export default async function PresetsListContainer({ searchParams }: Props) {
	const { page = 1, q } = await searchParams
	const presets = await findPresets({ page: Number(page), q: q as string })
	return <PresetsList presets={presets} />
}
