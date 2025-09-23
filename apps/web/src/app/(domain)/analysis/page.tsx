import AnalysisListContainer from "@/sections/analysis/list/analysis-list-container"
import { findAnalyses, getStatusCount } from "@/services/analysis"

interface Props extends PageProps<"/analysis/[id]"> {
	searchParams: Promise<{
		page?: string
		status?: string
		q?: string
	}>
}

export default async function AnalysesPage({ searchParams }: Props) {
	const [analysesResponse, statusCountResponse] = await Promise.all([
		findAnalyses(await searchParams),
		getStatusCount(),
	])

	if (!analysesResponse)
		throw new Error("No se pudieron obtener los análisis")
	if (statusCountResponse.error)
		throw new Error("No se pudieron contar los análisis")
	return (
		<AnalysisListContainer
			analysesResponse={analysesResponse}
			statusCount={statusCountResponse!}
		/>
	)
}
