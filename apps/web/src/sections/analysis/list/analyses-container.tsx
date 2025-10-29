import SearchInput, { SearchInputFallback } from '@/components/search-input'
import AnalysesListContainer from '@/sections/analysis/list/analyses-list-container'
import { t } from '@lingui/core/macro'
import { Suspense } from 'react'
import AnalysesTabsContainer from './analyses-tabs-container'
import { cacheTag } from 'next/cache'

interface Props {
	searchParams: Promise<{ page?: string; status?: string; q?: string }>
}

export default async function AnalysesContainer({ searchParams }: Props) {
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto space-y-4 px-4 py-8">
				{/* Header */}
				<div className="">
					<h1 className="mb-2 text-3xl font-bold text-gray-900">
						{t`Analysis management`}
					</h1>
					<p className="text-gray-600">
						{t`Manage gender bias detection analysis`}
					</p>
				</div>
				<Suspense fallback={<SearchInputFallback />}>
					<SearchInput name="q" />
				</Suspense>
				<Suspense>
					<AnalysesTabsContainer />
				</Suspense>
				<Suspense>
					<AnalysesListContainer searchParams={searchParams} />
				</Suspense>
			</div>
		</div>
	)
}
