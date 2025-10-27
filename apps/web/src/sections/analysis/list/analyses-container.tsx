import SearchInput from "@/components/search-input"
import StatsCards from "@/sections/analysis/components/stats-cards"
import AnalysesListContainer from "@/sections/analysis/list/analyses-list-container"
import AnalysesTabs from "@/sections/analysis/list/analyses-tabs"
import { t } from "@lingui/core/macro"
import { Suspense } from "react"

interface Props {
	searchParams: Promise<{ page?: string; status?: string; q?: string }>
}

export default function AnalysesContainer({ searchParams }: Props) {
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

				<StatsCards />

				<Suspense>
					<SearchInput name="q" />
				</Suspense>

				<Suspense>
					<AnalysesTabs />
				</Suspense>
				<Suspense>
					<AnalysesListContainer searchParams={searchParams} />
				</Suspense>
			</div>
		</div>
	)
}
