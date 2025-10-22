import { setServerLocale } from "@/locales/request"
import ModelListsContainer from "@/sections/model/list/model-list-container"
import { findModels } from "@/services/model"

interface Props extends PageProps<"/[locale]/models"> {
	searchParams: Promise<{
		q?: string
		page?: string
	}>
}

export default async function ModelsPage({ searchParams, params }: Props) {
	await setServerLocale(params)
	const data = await findModels(await searchParams)

	if (!data) {
		throw new Error("No se pudieron obtener los modelos")
	}

	return <ModelListsContainer modelsResponse={data} />
}
