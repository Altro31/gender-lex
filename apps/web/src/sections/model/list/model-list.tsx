"use client"

import { Button } from "@/components/ui/button"
import CreateModelDialog from "@/sections/model/components/dialogs/create-model-dialog"
import ModelListItem from "@/sections/model/list/model-list-item"
import type { ModelsResponse } from "@/types/model"
import { t } from "@lingui/core/macro"
import { Plus, Settings } from "lucide-react"
import { useQueryState } from "nuqs"

interface Props {
	modelsResponse: ModelsResponse
}

export default function ModelList({ modelsResponse: models }: Props) {
	const [searchTerm] = useQueryState("q")
	return models.length === 0 ? (
		<div className="py-6 text-center">
			<div className="mb-4 text-gray-400">
				<Settings className="mx-auto h-16 w-16" />
			</div>
			<h3 className="mb-2 text-lg font-medium text-gray-900">
				{searchTerm
					? t`No results found`
					: t`There are no models configured`}
			</h3>
			<p className="mb-4 text-gray-600">
				{searchTerm
					? t`Try other search terms`
					: t`Start by creating your first model`}
			</p>
			{!searchTerm && (
				<CreateModelDialog>
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						{t`Create First Model`}
					</Button>
				</CreateModelDialog>
			)}
		</div>
	) : (
		<ul className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
			{models.map((model) => (
				<ModelListItem model={model} key={model.id} />
			))}
		</ul>
	)
}
