import { setServerLocale } from "@/locales/request"
import AnalysisDetailsContainer from "@/sections/analysis/details/analysis-details-container"
import { t } from "@lingui/core/macro"
import { Metadata } from "next"

// export async function generateMetadata({
// 	params,
// }: PageProps<"/[locale]/analysis/[id]">) {
// 	await setServerLocale(params)

// 	return {
// 		title: t`Analysis detail | GenderLex`,
// 		description: t`View details of the current analysis`,
// 	} as Metadata
// }

export default async function AnalysisDetailsPage({
	params,
}: PageProps<"/[locale]/analysis/[id]">) {
	await setServerLocale(params)
	return <AnalysisDetailsContainer params={params} />
}
