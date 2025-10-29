import { Button } from "@/components/ui/button"
import CreateModelDialog from "@/sections/model/components/dialogs/create-model-dialog"
import ModelListItem from "@/sections/model/list/model-list-item"
import type { ModelsResponse } from "@/types/model"
import { t } from "@lingui/core/macro"
import { Plus, Settings } from "lucide-react"
import { useQueryState } from "nuqs"
import ModelList from "./model-list"
import { findModels } from "@/services/model"

interface Props {
	searchParams: Promise<{ q?: string; page?: string }>
}

export default async function ModelListsContainer({ searchParams }: Props) {
	const data = await findModels(await searchParams)

	if (!data) {
		throw new Error("No se pudieron obtener los modelos")
	}
	return <ModelList modelsResponse={data} />
}
