import { setServerLocale } from '@/locales/request'
import PresetsContainer from '@/sections/preset/list/presets-container'
import { t } from '@lingui/core/macro'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
	await setServerLocale()

	return {
		title: t`Presets Management` + ' | GenderLex',
		description: t`Manage model combinations with specific configurations`,
	}
}

export default async function PresetsPage({
	searchParams,
}: PageProps<'/[locale]/presets'>) {
	await setServerLocale()

	return <PresetsContainer searchParams={searchParams} />
}
