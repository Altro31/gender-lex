"use client"

import SearchInput from "@/components/search-input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import AnalysisActions from "@/sections/analysis/components/analysis-actions"
import type { AnalysesResponse, StatusCountResponse } from "@/types/analyses"
import { $Enums, AnalysisStatus } from "@repo/db/models"
import {
	AlertTriangle,
	CheckCircle,
	Clock,
	Filter,
	Play,
	XCircle,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { debounce, parseAsStringEnum, useQueryState } from "nuqs"
import { Fragment } from "react"
import StatsCards from "@/sections/analysis/list/stats-cards"
import AnalysisListItem from "@/sections/analysis/list/analysis-list-item"

interface Props {
	analysesResponse: AnalysesResponse
	statusCount: StatusCountResponse
}

export default function AnalysisListContainer({
	analysesResponse: analyses,
	statusCount,
}: Props) {
	const t = useTranslations()

	const [searchTerm] = useQueryState("q")
	const [statusFilter, setStatusFilter] = useQueryState(
		"status",
		parseAsStringEnum([...Object.values($Enums.AnalysisStatus), ""])
			.withDefault("")
			.withOptions({
				shallow: false,
				limitUrlUpdates: debounce(500),
			}),
	)

	const handleTab = (value: AnalysisStatus | "") => {
		setStatusFilter(value || null)
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto space-y-4 px-4 py-8">
				{/* Header */}
				<div className="">
					<h1 className="mb-2 text-3xl font-bold text-gray-900">
						{t("Analysis.list.title")}
					</h1>
					<p className="text-gray-600">
						{t("Analysis.list.description")}
					</p>
				</div>

				{/* Stats Cards */}
				<StatsCards statusCount={statusCount} />

				{/* Filters and Search */}
				<SearchInput name="q" />

				{/* Analysis List with Tabs */}
				<Tabs
					value={statusFilter}
					onValueChange={handleTab as any}
					className="w-full"
				>
					<TabsList className="grid w-full grid-cols-5 lg:w-auto">
						<TabsTrigger value="">{t("Commons.all")}</TabsTrigger>
						<TabsTrigger value="pending">
							{t("Analysis.list.status-tabs.pending")}
						</TabsTrigger>
						<TabsTrigger value="analyzing">
							{t("Analysis.list.status-tabs.analyzing")}
						</TabsTrigger>
						<TabsTrigger value="done">
							{t("Analysis.list.status-tabs.done")}
						</TabsTrigger>
						<TabsTrigger value="error">
							{t("Analysis.list.status-tabs.error")}
						</TabsTrigger>
					</TabsList>

					<>
						{analyses.length === 0 ? (
							<div className="py-12 text-center">
								<div className="mb-4 text-gray-400">
									<AlertTriangle className="mx-auto h-16 w-16" />
								</div>
								<h3 className="mb-2 text-lg font-medium text-gray-900">
									{searchTerm
										? t("Commons.no-search-result")
										: t("Analysis.list.empty-title")}
								</h3>
								<p className="mb-4 text-gray-600">
									{searchTerm
										? t("Commons.retry-search-result")
										: t("Analysis.list.empty-description")}
								</p>
							</div>
						) : (
							<>
								<div className="space-y-4">
									{analyses.map((analysis) => {
										return (
											<AnalysisListItem
												key={analysis.id}
												analysis={analysis}
											/>
										)
									})}
								</div>
							</>
						)}
					</>
				</Tabs>
			</div>
		</div>
	)
}
