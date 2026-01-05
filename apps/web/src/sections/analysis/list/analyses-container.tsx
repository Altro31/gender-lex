import SearchInput, { SearchInputFallback } from '@/components/search-input'
import { Skeleton } from '@/components/ui/skeleton'
import AnalysesListContainer from '@/sections/analysis/list/analyses-list-container'
import { t } from '@lingui/core/macro'
import { Suspense } from 'react'
import AnalysesTabsContainer from './analyses-tabs-container'

interface Props {
	searchParams: Promise<{ page?: string; status?: string; q?: string }>
}

export default async function AnalysesContainer({ searchParams }: Props) {
	return (
		<div className="min-h-screen ">
			<div className="container mx-auto space-y-4 px-4 py-8">
				{/* Header */}
				<div className="">
					<h1 className="mb-2 text-3xl font-bold">
						{t`Analysis management`}
					</h1>
					<p className="text-muted-foreground">
						{t`Manage gender bias detection analysis`}
					</p>
				</div>
				<Suspense fallback={<SearchInputFallback />}>
					<SearchInput name="q" />
				</Suspense>
				<Suspense fallback={<Skeleton className="h-10 w-full" />}>
					<AnalysesTabsContainer />
				</Suspense>
				<Suspense
					fallback={
						<div className="space-y-4">
							{[1, 2, 3, 4, 5].map((i) => (
								<Skeleton key={i} className="h-32 w-full" />
							))}
						</div>
					}
				>
					<AnalysesListContainer searchParams={searchParams} />
				</Suspense>
			</div>
		</div>
	)
}
