import { setServerLocale } from '@/locales/request'
import ModelListsContainer from '@/sections/model/list/model-list-container'
import { findModels } from '@/services/model'
import { t } from '@lingui/core/macro'
import { Metadata } from 'next'

export async function generateMetadata({
	params,
}: PageProps<'/[locale]/analysis/[id]'>) {
	await setServerLocale(params)

	return {
		title: t`Models management` + ' | GenderLex',
		description: t`Manage your connections to large language models`,
	} as Metadata
}

interface Props extends PageProps<'/[locale]/models'> {
	searchParams: Promise<{ q?: string; page?: string }>
}

export default async function ModelsPage({ searchParams, params }: Props) {
	await setServerLocale(params)
	const data = await findModels(await searchParams)

	if (!data) {
		throw new Error('No se pudieron obtener los modelos')
	}

	return <ModelListsContainer modelsResponse={data} />
}
