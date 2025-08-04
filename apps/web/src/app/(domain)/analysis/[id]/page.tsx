import AnalysisDetailsContainer from "@/sections/analysis/details/analysis-details-container"
import { startAnalysis } from "@/services/analysis"
interface Props {
	params: Promise<{ id: string }>
}

export default async function AnalysisDetailsPage({ params }: Props) {
	const { id } = await params
	const analysis = await startAnalysis(id)
	return <AnalysisDetailsContainer analysis={analysis} />
}