import AnalysesList from "@/sections/analysis/list/analyses-list"
import { findAnalyses } from "@/services/analysis"
import { cacheTag } from "next/cache"

interface Props {
	searchParams: Promise<{ page?: string; status?: string; q?: string }>
}

export default async function AnalysesListContainer({ searchParams }: Props) {
	const analysesResponse = await findAnalyses(await searchParams)
	if (!analysesResponse)
		throw new Error("No se pudieron obtener los análisis")
	return <AnalysesList analyses={analysesResponse} />
}
