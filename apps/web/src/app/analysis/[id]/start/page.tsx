import { startAnalysis } from "@/services/analysis"
import { connection } from "next/server"
interface Props {
	params: Promise<{ id: string }>
}

export default async function StartAnalysisPage({ params }: Props) {
	await connection()
	const { id } = await params
	await startAnalysis(id)
	return <>Analysis</>
}
