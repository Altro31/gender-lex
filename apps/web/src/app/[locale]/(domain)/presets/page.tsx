import { setServerLocale } from '@/locales/request'
import PresetsListContainer from '@/sections/preset/list/preset-list-container'
import { findPresets } from '@/services/preset'
import { t } from '@lingui/core/macro'
import { Metadata } from 'next'

export async function generateMetadata({
	params,
}: PageProps<'/[locale]/analysis/[id]'>) {
	await setServerLocale(params)

	return {
		title: t`Presets Management` + ' | GenderLex',
		description: t`Manage model combinations with specific configurations`,
	} as Metadata
}

export default async function PresetsPage({
	searchParams,
	params,
}: PageProps<'/[locale]/presets'>) {
	await setServerLocale(params)
	const { page = 1, q } = await searchParams
	const presets = await findPresets({ page: Number(page), q: q as string })
	return <PresetsListContainer presets={presets} q={q as string} />
}
