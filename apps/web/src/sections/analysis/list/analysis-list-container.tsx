"use client"

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { AnalysesResponse, StatusCountResponse } from "@/types/analyses"
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
import { cn } from "@/lib/utils"
import { useState } from "react"

interface Props {
	analysesResponse: AnalysesResponse
	statusCount: StatusCountResponse
}

type ResponseAnalysis = AnalysesResponse["data"][number]

export default function AnalysisListContainer({
	analysesResponse,
	statusCount,
}: Props) {
	const { data: analyses } = analysesResponse
	const [searchTerm, setSearchTerm] = useState("")
	const [statusFilter, setStatusFilter] = useState<string>("all")
	const [selectedAnalysis, setSelectedAnalysis] =
		useState<ResponseAnalysis | null>(null)
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [analysisToDelete, setAnalysisToDelete] =
		useState<ResponseAnalysis | null>(null)

	const filteredAnalyses = analyses.filter(({ attributes }) => {
		const matchesSearch = attributes.originalText
			.toLowerCase()
			.includes(searchTerm.toLowerCase())

		const matchesStatus =
			statusFilter === "all" || attributes.status === statusFilter

		return matchesSearch && matchesStatus
	})

	const handleDeleteAnalysis = () => {
		if (!analysisToDelete) return
		setIsDeleteDialogOpen(false)
		setAnalysisToDelete(null)
	}

	const handleRedoAnalysis = (id: string) => {
		// TODO: re-analice
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Gestión de Análisis
					</h1>
					<p className="text-gray-600">
						Administra los análisis de detección de sesgos de género
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
					{Object.entries(statusMapper).map(
						([key, { label, color }]) => (
							<Card>
								<CardContent className="">
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
				<div className="flex flex-col lg:flex-row gap-4 mb-6">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
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
					onValueChange={setStatusFilter}
					className="w-full"
				>
					<TabsList className="grid w-full grid-cols-5 lg:w-auto mb-6">
						<TabsTrigger value="all">Todos</TabsTrigger>
						<TabsTrigger value="pending">Pendientes</TabsTrigger>
						<TabsTrigger value="running">En Progreso</TabsTrigger>
						<TabsTrigger value="completed">Completados</TabsTrigger>
						<TabsTrigger value="failed">Errores</TabsTrigger>
					</TabsList>

					<TabsContent value="all" className="mt-0">
						{statusFilter === "all" && (
							<>
								{filteredAnalyses.length === 0 ? (
									<div className="text-center py-12">
										<div className="text-gray-400 mb-4">
											<AlertTriangle className="h-16 w-16 mx-auto" />
										</div>
										<h3 className="text-lg font-medium text-gray-900 mb-2">
											{searchTerm
												? "No se encontraron análisis"
												: "No hay análisis disponibles"}
										</h3>
										<p className="text-gray-600 mb-4">
											{searchTerm
												? "Intenta con otros términos de búsqueda"
												: "Los análisis aparecerán aquí una vez que se ejecuten"}
										</p>
									</div>
								) : (
									<div className="space-y-4">
										{filteredAnalyses.map((analysis) => {
											const StatusIcon =
												statusConfig[
													analysis.attributes.status
												].icon
											return (
												<Card
													key={analysis.id}
													className="hover:shadow-md transition-shadow"
												>
													<CardHeader className="pb-3">
														<div className="flex items-start justify-between">
															<div className="flex-1">
																<div className="flex items-center gap-3 mb-2">
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
																		<StatusIcon className="h-3 w-3 mr-1" />
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
															<DropdownMenu>
																<DropdownMenuTrigger
																	asChild
																>
																	<Button
																		variant="ghost"
																		size="sm"
																		className="h-8 w-8 p-0"
																	>
																		<Filter className="h-4 w-4" />
																	</Button>
																</DropdownMenuTrigger>
																<DropdownMenuContent align="end">
																	<DropdownMenuLabel>
																		Acciones
																	</DropdownMenuLabel>
																	<DropdownMenuSeparator />
																	<DropdownMenuItem
																		onClick={() => {
																			// Navigate to details (placeholder)
																			console.log(
																				"Ver detalles:",
																				analysis.id,
																			)
																		}}
																	>
																		<Eye className="h-4 w-4 mr-2" />
																		Ver
																		Detalles
																	</DropdownMenuItem>
																	<DropdownMenuItem
																		onClick={() =>
																			handleRedoAnalysis(
																				analysis.id,
																			)
																		}
																	>
																		<RotateCcw className="h-4 w-4 mr-2" />
																		Rehacer
																		Análisis
																	</DropdownMenuItem>
																	<DropdownMenuSeparator />
																	<DropdownMenuItem
																		onClick={() => {
																			setAnalysisToDelete(
																				analysis,
																			)
																			setIsDeleteDialogOpen(
																				true,
																			)
																		}}
																		className="text-red-600"
																	>
																		<Trash2 className="h-4 w-4 mr-2" />
																		Eliminar
																	</DropdownMenuItem>
																</DropdownMenuContent>
															</DropdownMenu>
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
																<p className="text-sm text-gray-600 line-clamp-2 bg-gray-50 p-2 rounded">
																	{
																		analysis
																			.attributes
																			.originalText
																	}
																</p>
															</div>
														</div>
													</CardContent>

													<CardFooter className="pt-3 border-t">
														<div className="w-full flex justify-between items-center text-xs text-gray-500">
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
											)
										})}
									</div>
								)}
							</>
						)}
					</TabsContent>
				</Tabs>

				{/* Delete Confirmation Dialog */}
				<AlertDialog
					open={isDeleteDialogOpen}
					onOpenChange={setIsDeleteDialogOpen}
				>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
							<AlertDialogDescription>
								Esta acción no se puede deshacer. Se eliminará
								permanentemente el análisis
								<strong className="font-medium">
									{" "}
									{analysisToDelete?.attributes.name}
								</strong>{" "}
								y todos sus resultados.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancelar</AlertDialogCancel>
							<AlertDialogAction
								onClick={handleDeleteAnalysis}
								className="bg-red-600 hover:bg-red-700"
							>
								Eliminar
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
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
