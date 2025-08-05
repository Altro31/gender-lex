import AnalysisListContainer from "@/sections/analysis/list/analysis-list-container"
import { getAllAnalysis } from "@/services/analysis"

interface Props {
	searchParams: Promise<{
		page?: number
	}>
}

export default async function AnalysesPage({ searchParams }: Props) {
	const { page = 1 } = await searchParams
	const analysesResponse = await getAllAnalysis(page)
	if (!analysesResponse)
		throw new Error("No se pudieron obtener los análisis")
	return <AnalysisListContainer analysesResponse={analysesResponse} />
}
