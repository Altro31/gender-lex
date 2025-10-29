import { getStatusCount } from "@/services/analysis"
import AnalysesTabs from "./analyses-tabs"

export default async function AnalysesTabsContainer() {
	const statusCountResponse = await getStatusCount()
	return <AnalysesTabs statusCount={statusCountResponse} />
}
