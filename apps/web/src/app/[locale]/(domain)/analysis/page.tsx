import { setServerLocale } from "@/locales/request"
import AnalysesContainer from "@/sections/analysis/list/analyses-container"

interface Props extends PageProps<"/[locale]/analysis/[id]"> {
	searchParams: Promise<{
		page?: string
		status?: string
		q?: string
	}>
}

export default async function AnalysesPage({ searchParams, params }: Props) {
	await setServerLocale(params)
	return <AnalysesContainer searchParams={searchParams} />
}
