import { setServerLocale } from '@/locales/request'
import AnalysesContainer from '@/sections/analysis/list/analyses-container'
import { Metadata } from 'next'
import { t } from '@lingui/core/macro'

export async function generateMetadata(): Promise<Metadata> {
	await setServerLocale()

	return {
		title: t`Analysis management | GenderLex`,
		description: t`Manage gender bias detection analysis`,
	}
}

interface Props extends PageProps<'/[locale]/analysis/[id]'> {
	searchParams: Promise<{ page?: string; status?: string; q?: string }>
}

export default async function AnalysesPage({ searchParams }: Props) {
	await setServerLocale()
	return <AnalysesContainer searchParams={searchParams} />
}
