"use client"

import SearchInput from "@/components/search-input"
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

export default function ModelListsContainer({ modelsResponse: models }: Props) {
	const [searchTerm] = useQueryState("q")
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="mb-2 text-3xl font-bold text-gray-900">
						{t`Model Management`}
					</h1>
					<p className="text-gray-600">
						{t`Manage your connections to large language models`}
					</p>
				</div>

				{/* Actions Bar */}
				<div className="mb-6 flex flex-col gap-4 sm:flex-row">
					<SearchInput name="q" className="flex-1" />
					<CreateModelDialog>
						<Button className="flex items-center gap-2">
							<Plus className="h-4 w-4" />
							{t`New model`}
						</Button>
					</CreateModelDialog>
				</div>

				{/* Models Grid */}
				{models.length === 0 ? (
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
					<div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
						{models.map((model) => (
							<ModelListItem model={model} key={model.id} />
						))}
					</div>
				)}
			</div>
		</div>
	)
}
