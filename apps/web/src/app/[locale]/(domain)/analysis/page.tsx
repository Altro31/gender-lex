import { setServerLocale } from "@/locales/request"
import AnalysesContainer from "@/sections/analysis/list/analyses-container"
import { Metadata } from "next"
import { t } from "@lingui/core/macro"

export async function generateMetadata({
	params,
}: PageProps<"/[locale]/analysis/[id]">) {
	await setServerLocale(params)

	return {
		title: t`Analysis management | GenderLex`,
		description: t`Manage gender bias detection analysis`,
	} as Metadata
}

interface Props extends PageProps<"/[locale]/analysis/[id]"> {
	searchParams: Promise<{ page?: string; status?: string; q?: string }>
}

export default async function AnalysesPage({ searchParams, params }: Props) {
	await setServerLocale(params)
	return <AnalysesContainer searchParams={searchParams} />
}
