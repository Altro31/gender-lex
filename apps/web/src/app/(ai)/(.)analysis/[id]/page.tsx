import { startAnalysis } from "@/services/analysis"

interface Props {
	params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
	const { id } = await params
	const data = await startAnalysis(id)
	return <>Analysis</>
}
