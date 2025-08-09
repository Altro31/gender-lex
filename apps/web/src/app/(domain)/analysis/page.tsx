import AnalysisListContainer from "@/sections/analysis/list/analysis-list-container"
import { findAnalyses, getStatusCount } from "@/services/analysis"

interface Props {
	searchParams: Promise<{
		page?: number
	}>
}

export default async function AnalysesPage({ searchParams }: Props) {
	const { page = 1 } = await searchParams

	const [analysesResponse, statusCountResponse] = await Promise.all([
		findAnalyses(page),
		getStatusCount(),
	])

	if (analysesResponse.error)
		throw new Error("No se pudieron obtener los análisis")
	if (statusCountResponse.error)
		throw new Error("No se pudieron contar los análisis")
	return (
		<AnalysisListContainer
			analysesResponse={analysesResponse.data}
			statusCount={statusCountResponse.data}
		/>
	)
}
