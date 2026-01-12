import SearchInput, { SearchInputFallback } from '@/components/search-input'
import { Skeleton } from '@/components/ui/skeleton'
import { t } from '@lingui/core/macro'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import PresetsListContainer from './preset-list-container'
import {
	CreatePresetDialog,
	CreatePresetDialogTrigger,
} from '../components/dialogs/create-preset-dialog'

interface Props {
	searchParams: Promise<{ q?: string; page?: string }>
}

export default function PresetsContainer({ searchParams }: Props) {
	return (
		<div className="min-h-screen">
			<div className="container mx-auto px-4 py-8 w-full">
				{/* Header */}
				<div className="mb-8">
					<h1 className="mb-2 text-3xl font-bold">
						{t`Presets Management`}
					</h1>
					<p className="text-muted-foreground">
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
					<CreatePresetDialogTrigger render={<Button />}>
						<Plus />
						{t`New Preset`}
					</CreatePresetDialogTrigger>
				</div>

				{/* Presets Grid */}
				<Suspense
					fallback={
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{[1, 2, 3, 4, 5, 6].map((i) => (
								<Skeleton key={i} className="h-48 w-full" />
							))}
						</div>
					}
				>
					<PresetsListContainer searchParams={searchParams} />
				</Suspense>
			</div>
			<CreatePresetDialog />
		</div>
	)
}
