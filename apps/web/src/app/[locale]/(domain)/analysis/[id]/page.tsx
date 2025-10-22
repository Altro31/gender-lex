import { setServerLocale } from "@/locales/request"
import AnalysisDetailsContainer from "@/sections/analysis/details/analysis-details-container"

export default async function AnalysisDetailsPage({
	params,
}: PageProps<"/[locale]/analysis/[id]">) {
	await setServerLocale(params)
	return <AnalysisDetailsContainer params={params} />
}
