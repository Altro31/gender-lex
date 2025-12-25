'use client'

import { Button } from '@/components/ui/button'
import ModelListItem from '@/sections/model/list/model-list-item'
import type { ModelsResponse } from '@/types/model'
import { t } from '@lingui/core/macro'
import { Plus, Settings } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { CreateModelDialogTrigger } from '../components/dialogs/create-model-dialog'

interface Props {
	modelsResponse: ModelsResponse
}

export default function ModelList({ modelsResponse: models }: Props) {
	const [searchTerm] = useQueryState('q')
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
				<CreateModelDialogTrigger render={<Button />}>
					<Plus />
					{t`Create First Model`}
				</CreateModelDialogTrigger>
			)}
		</div>
	) : (
		<ul className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
			{models.map(model => (
				<ModelListItem model={model} key={model.id} />
			))}
		</ul>
	)
}
