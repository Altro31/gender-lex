import { findModels } from '@/services/model'
import { t } from '@lingui/core/macro'
import {
	CreateModelDialog,
	CreateModelDialogTrigger,
} from '../components/dialogs/create-model-dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import SearchInput, { SearchInputFallback } from '@/components/search-input'
import { Suspense } from 'react'
import ModelListsContainer from './model-list-container'
import { EditModelDialog } from '../components/dialogs/edit-model-dialog'
import { DeleteModelAlertDialog } from '../components/dialogs/delete-model-alert-dialog'
import { DetailsModelDialog } from '../components/dialogs/details-model-dialog'

interface Props {
	searchParams: Promise<{ q?: string; page?: string }>
}

export default function ModelsContainer({ searchParams }: Props) {
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
					<Suspense
						fallback={<SearchInputFallback className="flex-1" />}
					>
						<SearchInput name="q" className="flex-1" />
					</Suspense>
					<CreateModelDialogTrigger
						className="flex items-center gap-2"
						render={<Button />}
					>
						<Plus />
						{t`New model`}
					</CreateModelDialogTrigger>
				</div>

				{/* Models Grid */}
				<Suspense>
					<ModelListsContainer searchParams={searchParams} />
				</Suspense>
				<CreateModelDialog />
				<EditModelDialog />
				<DeleteModelAlertDialog />
				<DetailsModelDialog />
			</div>
		</div>
	)
}
