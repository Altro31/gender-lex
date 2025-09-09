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
	XCircle
} from "lucide-react"
import { useTranslations } from "next-intl"
import { debounce, parseAsStringEnum, useQueryState } from "nuqs"
import { Fragment } from "react"

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

	const statusConfig = {
		pending: {
			label: t("Analysis.status.pending"),
			color: "bg-gray-100 text-gray-800",
			icon: Clock,
		},
		analyzing: {
			label: t("Analysis.status.analyzing"),
			color: "bg-blue-100 text-blue-800",
			icon: Play,
		},
		done: {
			label: t("Analysis.status.done"),
			color: "bg-green-100 text-green-800",
			icon: CheckCircle,
		},
		error: {
			label: t("Analysis.status.error"),
			color: "bg-red-100 text-red-800",
			icon: XCircle,
		},
	}

	const statusMapper = {
		all: { label: t("Commons.all"), color: "text-gray-900" },
		analyzing: {
			label: t("Analysis.status.analyzing"),
			color: "text-blue-600",
		},
		done: { label: t("Analysis.status.done"), color: "text-green-600" },
		error: { label: t("Analysis.status.error"), color: "text-red-600" },
		pending: {
			label: t("Analysis.status.pending"),
			color: "text-gray-600",
		},
	} as const satisfies Record<
		keyof StatusCountResponse,
		{ label: string; color: `text-${string}-${number}00` }
	>

	const handleTab = (value: AnalysisStatus | "") => {
		setStatusFilter(value || null)
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="mb-2 text-3xl font-bold text-gray-900">
						{t("Analysis.list.title")}
					</h1>
					<p className="text-gray-600">
						{t("Analysis.list.description")}
					</p>
				</div>

				{/* Stats Cards */}
				<div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
					{Object.entries(statusMapper).map(
						([key, { label, color }]) => (
							<Card key={key}>
								<CardContent>
									<div className="text-sm text-gray-600">
										{label}
									</div>
									<div
										className={cn(
											"text-2xl font-bold",
											color,
										)}
									>
										{
											statusCount[
												key as keyof typeof statusCount
											]
										}
									</div>
								</CardContent>
							</Card>
						),
					)}
				</div>

				{/* Filters and Search */}
				<div className="mb-6 flex flex-col gap-4 lg:flex-row">
					<SearchInput name="q" />
				</div>

				{/* Analysis List with Tabs */}
				<Tabs
					value={statusFilter}
					onValueChange={handleTab as any}
					className="w-full"
				>
					<TabsList className="mb-6 grid w-full grid-cols-5 lg:w-auto">
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
										const StatusIcon =
											statusConfig[analysis.status].icon
										return (
											<Fragment key={analysis.id}>
												<Card className="transition-shadow hover:shadow-md">
													<CardHeader className="pb-3">
														<div className="flex items-start justify-between">
															<div className="flex-1">
																<div className="mb-2 flex items-center gap-3">
																	<CardTitle className="text-lg">
																		{
																			analysis.name
																		}
																	</CardTitle>
																	<Badge
																		className={
																			statusConfig[
																				analysis
																					.status
																			]
																				.color
																		}
																	>
																		<StatusIcon className="mr-1 h-3 w-3" />
																		{
																			statusConfig[
																				analysis
																					.status
																			]
																				.label
																		}
																	</Badge>
																</div>
																<CardDescription className="flex items-center gap-4 text-sm">
																	<span>
																		{t(
																			"Preset.item",
																		)}
																		:
																		{
																			analysis
																				.Preset
																				.name
																		}
																	</span>
																	<span>
																		•
																	</span>
																	{/* <span>
																		Fuente:{" "}
																		{analysis
																			
																			.inputSource ===
																		"manual"
																			? "Manual"
																			: "Archivo"}
																	</span>
																	<span>
																		•
																	</span> */}
																	<span>
																		{new Date(
																			analysis.createdAt,
																		).toLocaleDateString()}
																	</span>
																</CardDescription>
															</div>

															<AnalysisActions
																analysis={
																	analysis
																}
															>
																<Button
																	variant="ghost"
																	size="sm"
																	className="h-8 w-8 p-0"
																>
																	<Filter className="h-4 w-4" />
																</Button>
															</AnalysisActions>
														</div>
													</CardHeader>
													<CardContent className="pb-3">
														<div className="space-y-4">
															{/* Input Preview */}
															<div className="space-y-2">
																<div className="text-sm font-medium text-gray-700">
																	{t(
																		"Analysis.details.analiced-text",
																	)}
																	:
																</div>
																<p className="line-clamp-2 rounded bg-gray-50 p-2 text-sm text-gray-600">
																	{
																		analysis.originalText
																	}
																</p>
															</div>
														</div>
													</CardContent>

													<CardFooter className="border-t pt-3">
														<div className="flex w-full items-center justify-between text-xs text-gray-500">
															<span>
																ID:{" "}
																{analysis.id}
															</span>

															{analysis.updatedAt && (
																<span>
																	{t(
																		"Commons.completed",
																	)}
																	:{" "}
																	{new Date(
																		analysis.updatedAt,
																	).toLocaleString()}
																</span>
															)}
														</div>
													</CardFooter>
												</Card>
											</Fragment>
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
