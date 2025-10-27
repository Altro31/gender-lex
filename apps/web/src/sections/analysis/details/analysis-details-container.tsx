import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AnalysisHeader from '@/sections/analysis/details/analysis-header'
import AnalysisSidebarTrigger from '@/sections/analysis/details/analysis-sidebar-trigger'
import AnalysisContent from '@/sections/analysis/details/content/analysis-content'
import { t } from '@lingui/core/macro'
import { Suspense } from 'react'

interface Props {
	params: PageProps<'/[locale]/analysis/[id]'>['params']
}
export default function AnalysisDetailsContainer({ params }: Props) {
	return (
		<div className="min-h-screen bg-gray-50">
			<AnalysisSidebarTrigger />
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<AnalysisHeader params={params} />

				{/* Content */}
				<Tabs defaultValue="overview" className="space-y-6">
					<TabsList className="grid w-full grid-cols-5">
						<TabsTrigger value="overview">{t`Summary`}</TabsTrigger>
						<TabsTrigger value="terms">
							{t`Identified Biased Terms`}
						</TabsTrigger>
						<TabsTrigger value="context">{t`Context`}</TabsTrigger>
						<TabsTrigger value="alternatives">
							{t`Alternatives`}
						</TabsTrigger>
						<TabsTrigger value="impact">{t`Impact`}</TabsTrigger>
					</TabsList>

					<Suspense>
						<AnalysisContent params={params} />
					</Suspense>
				</Tabs>
			</div>
		</div>
	)
}
