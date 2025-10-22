import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AnalysisHeader from "@/sections/analysis/details/analysis-header"
import AnalysisSidebarTrigger from "@/sections/analysis/details/analysis-sidebar-trigger"
import AnalysisContent from "@/sections/analysis/details/content/analysis-content"
import { useTranslations } from "next-intl"
import { Suspense } from "react"

interface Props {
	params: PageProps<"/[locale]/analysis/[id]">["params"]
}
export default function AnalysisDetailsContainer({ params }: Props) {
	const t = useTranslations()

	return (
		<div className="min-h-screen bg-gray-50">
			<AnalysisSidebarTrigger />
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<AnalysisHeader params={params} />

				{/* Content */}
				<Tabs defaultValue="overview" className="space-y-6">
					<TabsList className="grid w-full grid-cols-5">
						<TabsTrigger value="overview">
							{t("Analysis.details.summary.title")}
						</TabsTrigger>
						<TabsTrigger value="terms">
							{t("Analysis.details.terms.title")}
						</TabsTrigger>
						<TabsTrigger value="context">
							{t("Analysis.details.context.title")}
						</TabsTrigger>
						<TabsTrigger value="alternatives">
							{t("Analysis.details.alternatives.title")}
						</TabsTrigger>
						<TabsTrigger value="impact">
							{t("Analysis.details.impact.title")}
						</TabsTrigger>
					</TabsList>

					<Suspense>
						<AnalysisContent params={params} />
					</Suspense>
				</Tabs>
			</div>
		</div>
	)
}
