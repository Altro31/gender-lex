import ModelListsContainer from "@/sections/model/list/model-list-container"
import { findModels } from "@/services/model"

interface Props {
	searchParams: Promise<{
		page?: number
		status?: string
	}>
}

export default async function ModelsPage({ searchParams }: Props) {
	const { page = 1, status } = await searchParams

	const { data, error } = await findModels({ page, status })

	if (error) {
		console.log(error)
		throw new Error("No se pudieron obtener los modelos")
	}

	return <ModelListsContainer modelsResponse={data} />
}
