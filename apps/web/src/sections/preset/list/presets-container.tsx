import SearchInput, { SearchInputFallback } from '@/components/search-input'
import { t } from '@lingui/core/macro'
import { Suspense } from 'react'
import CreatePresetDialog from '../components/dialogs/create-preset-dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import PresetsListContainer from './preset-list-container'

interface Props {
	searchParams: Promise<{ q?: string; page?: string }>
}

export default function PresetsContainer({ searchParams }: Props) {
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="mb-2 text-3xl font-bold text-gray-900">
						{t`Presets Management`}
					</h1>
					<p className="text-gray-600">
						{t`Manage model combinations with specific configurations`}
					</p>
				</div>

				{/* Actions Bar */}
				<div className="mb-6 flex flex-col gap-4 lg:flex-row">
					<Suspense
						fallback={<SearchInputFallback className="flex-1" />}
					>
						<SearchInput name="q" className="flex-1" />
					</Suspense>
					<CreatePresetDialog>
						<Button>
							<Plus />
							{t`New Preset`}
						</Button>
					</CreatePresetDialog>
				</div>

				{/* Presets Grid */}
				<Suspense>
					<PresetsListContainer searchParams={searchParams} />
				</Suspense>
			</div>
		</div>
	)
}
