import { setServerLocale } from '@/locales/request'
import ModelsContainer from '@/sections/model/list/models-container'
import { t } from '@lingui/core/macro'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
	await setServerLocale()

	return {
		title: t`Models management` + ' | GenderLex',
		description: t`Manage your connections to large language models`,
	}
}

export default async function ModelsPage({
	searchParams,
}: PageProps<'/[locale]/models'>) {
	await setServerLocale()

	return <ModelsContainer searchParams={searchParams} />
}
