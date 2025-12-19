import { setServerLocale } from '@/locales/request'
import AnalysisDetailsContainer from '@/sections/analysis/details/analysis-details-container'
import { t } from '@lingui/core/macro'
import { Metadata } from 'next'
import { locale } from 'next/root-params'

export async function generateMetadata(): Promise<Metadata> {
	await setServerLocale()

	return {
		title: t`Analysis detail | GenderLex`,
		description: t`View details of the current analysis`,
	}
}

export default async function AnalysisDetailsPage(
	props: PageProps<'/[locale]/analysis/[id]'>,
) {
	locale
	await setServerLocale()
	return <AnalysisDetailsContainer {...props} />
}
