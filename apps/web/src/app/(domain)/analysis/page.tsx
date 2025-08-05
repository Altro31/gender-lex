import AnalysisListContainer from "@/sections/analysis/list/analysis-list-container"
import { getAllAnalysis } from "@/services/analysis"

interface Props {
	searchParams: Promise<{
		page?: number
	}>
}

export default async function AnalysesPage({ searchParams }: Props) {
	const { page = 1 } = await searchParams
	const analyses = await getAllAnalysis(page)

	return <AnalysisListContainer analyses={analyses} />
}
