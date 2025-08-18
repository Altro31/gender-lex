"use client"

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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import AnalysisActions from "@/sections/analysis/components/analysis-actions"
import DeleteAnalysisAlertDialogContent from "@/sections/analysis/components/delete-analysis-alert-dialog-content"
import { redoAnalysis } from "@/services/analysis"
import type {
	AnalysesResponse,
	AnalysesResponseItem,
	StatusCountResponse,
} from "@/types/analyses"
import { useRouter } from "@bprogress/next"
import { AnalysisStatus } from "@repo/db/models"
import {
	AlertTriangle,
	CheckCircle,
	Clock,
	Eye,
	Filter,
	Play,
	RotateCcw,
	Search,
	Trash2,
	XCircle,
} from "lucide-react"
import Link from "next/link"
import { Fragment, useState } from "react"

interface Props {
	analysesResponse: AnalysesResponse
	statusCount: StatusCountResponse
}

export default function AnalysisListContainer({
	analysesResponse,
	statusCount,
}: Props) {
	const router = useRouter()

	const { data: analyses } = analysesResponse
	const [searchTerm, setSearchTerm] = useState("")
	const [statusFilter, setStatusFilter] = useState<AnalysisStatus | "all">(
		"all",
	)

	const handleTab = (value: AnalysisStatus | "all") => {
		setStatusFilter(value)
		const redirect = value === "all" ? "?" : "?status=" + value
		router.replace(redirect, { showProgress: false })
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="mb-2 text-3xl font-bold text-gray-900">
						Gestión de Análisis
					</h1>
					<p className="text-gray-600">
						Administra los análisis de detección de sesgos de género
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
					<div className="relative flex-1">
						<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
						<Input
							placeholder="Buscar análisis..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
				</div>

				{/* Analysis List with Tabs */}
				<Tabs
					value={statusFilter}
					onValueChange={handleTab as any}
					className="w-full"
				>
					<TabsList className="mb-6 grid w-full grid-cols-5 lg:w-auto">
						<TabsTrigger value="all">Todos</TabsTrigger>
						<TabsTrigger value="pending">Pendientes</TabsTrigger>
						<TabsTrigger value="analyzing">En Progreso</TabsTrigger>
						<TabsTrigger value="done">Completados</TabsTrigger>
						<TabsTrigger value="error">Errores</TabsTrigger>
					</TabsList>

					<>
						{analyses.length === 0 ? (
							<div className="py-12 text-center">
								<div className="mb-4 text-gray-400">
									<AlertTriangle className="mx-auto h-16 w-16" />
								</div>
								<h3 className="mb-2 text-lg font-medium text-gray-900">
									{searchTerm
										? "No se encontraron análisis"
										: "No hay análisis disponibles"}
								</h3>
								<p className="mb-4 text-gray-600">
									{searchTerm
										? "Intenta con otros términos de búsqueda"
										: "Los análisis aparecerán aquí una vez que se ejecuten"}
								</p>
							</div>
						) : (
							<>
								<div className="space-y-4">
									{analyses.map((analysis) => {
										const StatusIcon =
											statusConfig[
												analysis.attributes.status
											].icon
										return (
											<Fragment key={analysis.id}>
												<Card className="transition-shadow hover:shadow-md">
													<CardHeader className="pb-3">
														<div className="flex items-start justify-between">
															<div className="flex-1">
																<div className="mb-2 flex items-center gap-3">
																	<CardTitle className="text-lg">
																		{
																			analysis
																				.attributes
																				.name
																		}
																	</CardTitle>
																	<Badge
																		className={
																			statusConfig[
																				analysis
																					.attributes
																					.status
																			]
																				.color
																		}
																	>
																		<StatusIcon className="mr-1 h-3 w-3" />
																		{
																			statusConfig[
																				analysis
																					.attributes
																					.status
																			]
																				.label
																		}
																	</Badge>
																</div>
																<CardDescription className="flex items-center gap-4 text-sm">
																	<span>
																		Preset:
																		{
																			" Preset de prueba"
																		}
																		{/* {
																			analysis.presetName
																		} */}
																	</span>
																	<span>
																		•
																	</span>
																	<span>
																		Fuente:{" "}
																		{analysis
																			.attributes
																			.inputSource ===
																		"manual"
																			? "Manual"
																			: "Archivo"}
																	</span>
																	<span>
																		•
																	</span>
																	<span>
																		{new Date(
																			analysis.attributes.createdAt,
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
															{/* Progress Bar for Running Analysis */}
															{analysis.attributes
																.status ===
																"analyzing" && (
																<div className="space-y-2">
																	<div className="flex justify-between text-sm">
																		<span>
																			Progreso
																			del
																			análisis
																		</span>
																		<span>
																			{/* {
																				analysis
																					.attributes
																					.progress
																			} */}
																			%
																		</span>
																	</div>
																	<Progress
																		value={
																			0
																			// analysis
																			// 	.attributes
																			// 	.progress
																		}
																		className="h-2"
																	/>
																</div>
															)}

															{/* Input Preview */}
															<div className="space-y-2">
																<div className="text-sm font-medium text-gray-700">
																	Texto
																	Analizado:
																</div>
																<p className="line-clamp-2 rounded bg-gray-50 p-2 text-sm text-gray-600">
																	{
																		analysis
																			.attributes
																			.originalText
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

															{analysis.attributes
																.updatedAt && (
																<span>
																	Completado:{" "}
																	{new Date(
																		analysis.attributes.updatedAt,
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

const statusConfig = {
	pending: {
		label: "Pendiente",
		color: "bg-gray-100 text-gray-800",
		icon: Clock,
	},
	analyzing: {
		label: "En Progreso",
		color: "bg-blue-100 text-blue-800",
		icon: Play,
	},
	done: {
		label: "Completado",
		color: "bg-green-100 text-green-800",
		icon: CheckCircle,
	},
	error: {
		label: "Error",
		color: "bg-red-100 text-red-800",
		icon: XCircle,
	},
}

const statusMapper = {
	all: { label: "Todos", color: "text-gray-900" },
	analyzing: { label: "Analizando", color: "text-blue-600" },
	done: { label: "Completado", color: "text-green-600" },
	error: { label: "Fallido", color: "text-red-600" },
	pending: { label: "Pendiente", color: "text-gray-600" },
} as const satisfies Record<
	keyof StatusCountResponse,
	{ label: string; color: `text-${string}-${number}00` }
>
