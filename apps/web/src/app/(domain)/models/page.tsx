import ModelListsContainer from "@/sections/model/list/model-list-container"
import { findModels } from "@/services/model"

interface Props extends PageProps<"/models"> {
	searchParams: Promise<{
		q?: string
		page?: string
	}>
}

export default async function ModelsPage({ searchParams }: Props) {
	const data = await findModels(await searchParams)

	if (!data) {
		throw new Error("No se pudieron obtener los modelos")
	}

	return <ModelListsContainer modelsResponse={data} />
}
