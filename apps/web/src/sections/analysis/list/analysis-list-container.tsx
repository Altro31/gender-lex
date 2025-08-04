import { useState } from "react"
import {
	Search,
	Filter,
	RotateCcw,
	Trash2,
	Eye,
	Play,
	AlertTriangle,
	CheckCircle,
	Clock,
	XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Analysis } from "@repo/db/models"

interface Props {
	analyses: Analysis[]
}

export default function AnalysisListContainer({ analyses }: Props) {
	const [searchTerm, setSearchTerm] = useState("")
	const [statusFilter, setStatusFilter] = useState<string>("all")
	const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(
		null,
	)
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [analysisToDelete, setAnalysisToDelete] = useState<Analysis | null>(
		null,
	)

	const filteredAnalyses = analyses.filter((analysis) => {
		const matchesSearch = analysis.originalText
			.toLowerCase()
			.includes(searchTerm.toLowerCase())

		const matchesStatus =
			statusFilter === "all" || analysis.status === statusFilter

		return matchesSearch && matchesStatus
	})

	const handleDeleteAnalysis = () => {
		if (!analysisToDelete) return
		setIsDeleteDialogOpen(false)
		setAnalysisToDelete(null)
	}

	const handleRedoAnalysis = (analysis: Analysis) => {
		// TODO: re-analice
	}

	const getStatusCounts = () => {
		return {
			all: analyses.length,
			pending: analyses.filter((a) => a.status === "pending").length,
			analyzing: analyses.filter((a) => a.status === "analyzing").length,
			done: analyses.filter((a) => a.status === "done").length,
			error: analyses.filter((a) => a.status === "error").length,
		}
	}

	const statusCounts = getStatusCounts()

	const formatDuration = (seconds: number) => {
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = seconds % 60
		return `${minutes}m ${remainingSeconds}s`
	}

	const getOverallScoreColor = (score: number) => {
		if (score >= 8) return "text-green-600"
		if (score >= 6) return "text-yellow-600"
		return "text-red-600"
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
					<Card>
						<CardContent className="p-4">
							<div className="text-2xl font-bold text-gray-900">
								{statusCounts.all}
							</div>
							<div className="text-sm text-gray-600">Total</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4">
							<div className="text-2xl font-bold text-blue-600">
								{statusCounts.analyzing}
							</div>
							<div className="text-sm text-gray-600">
								En Progreso
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4">
							<div className="text-2xl font-bold text-green-600">
								{statusCounts.done}
							</div>
							<div className="text-sm text-gray-600">
								Completados
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4">
							<div className="text-2xl font-bold text-gray-600">
								{statusCounts.pending}
							</div>
							<div className="text-sm text-gray-600">
								Pendientes
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4">
							<div className="text-2xl font-bold text-red-600">
								{statusCounts.error}
							</div>
							<div className="text-sm text-gray-600">
								Con Error
							</div>
						</CardContent>
					</Card>
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
												statusConfig[analysis.status]
													.icon
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
																		<StatusIcon className="h-3 w-3 mr-1" />
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
																		{analysis.inputSource ===
																		"manual"
																			? "Manual"
																			: "Archivo"}
																	</span>
																	<span>
																		•
																	</span>
																	<span>
																		{new Date(
																			analysis.createdAt,
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
																				analysis,
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
															{analysis.status ===
																"analyzing" && (
																<div className="space-y-2">
																	<div className="flex justify-between text-sm">
																		<span>
																			Progreso
																			del
																			análisis
																		</span>
																		<span>
																			{
																				analysis.progress
																			}
																			%
																		</span>
																	</div>
																	<Progress
																		value={
																			analysis.progress
																		}
																		className="h-2"
																	/>
																</div>
															)}

															{/* Error Message */}
															{analysis.status ===
																"failed" &&
																analysis.error && (
																	<div className="bg-red-50 border border-red-200 rounded-lg p-3">
																		<div className="flex items-center gap-2 text-red-800 text-sm font-medium mb-1">
																			<XCircle className="h-4 w-4" />
																			Error
																			en
																			el
																			análisis
																		</div>
																		<p className="text-red-700 text-sm">
																			{
																				analysis.error
																			}
																		</p>
																	</div>
																)}

															{/* Results Summary */}
															{analysis.status ===
																"completed" &&
																analysis.results && (
																	<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
																		<div className="bg-gray-50 rounded-lg p-3">
																			<div className="text-sm text-gray-600 mb-1">
																				Puntuación
																				General
																			</div>
																			<div
																				className={`text-2xl font-bold ${getOverallScoreColor(analysis.results.overallScore)}`}
																			>
																				{
																					analysis
																						.results
																						.overallScore
																				}
																				/10
																			</div>
																		</div>
																		<div className="bg-gray-50 rounded-lg p-3">
																			<div className="text-sm text-gray-600 mb-1">
																				Sesgos
																				Detectados
																			</div>
																			<div className="text-2xl font-bold text-gray-900">
																				{
																					analysis
																						.results
																						.biasesDetected
																						.length
																				}
																			</div>
																		</div>
																		<div className="bg-gray-50 rounded-lg p-3">
																			<div className="text-sm text-gray-600 mb-1">
																				Palabras
																				Analizadas
																			</div>
																			<div className="text-2xl font-bold text-gray-900">
																				{analysis.results.totalWords.toLocaleString()}
																			</div>
																		</div>
																	</div>
																)}

															{/* Bias Categories */}
															{analysis.status ===
																"completed" &&
																analysis.results &&
																analysis.results
																	.biasesDetected
																	.length >
																	0 && (
																	<div className="space-y-2">
																		<div className="text-sm font-medium text-gray-700">
																			Categorías
																			de
																			Sesgo
																			Detectadas:
																		</div>
																		<div className="flex flex-wrap gap-2">
																			{analysis.results.biasesDetected.map(
																				(
																					bias,
																					index,
																				) => (
																					<Badge
																						key={
																							index
																						}
																						variant="outline"
																						className={
																							severityConfig[
																								bias
																									.severity
																							]
																								.color
																						}
																					>
																						{
																							bias.category
																						}{" "}
																						(
																						{
																							severityConfig[
																								bias
																									.severity
																							]
																								.label
																						}

																						)
																					</Badge>
																				),
																			)}
																		</div>
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
																		analysis.inputText
																	}
																</p>
															</div>
														</div>
													</CardContent>

													<CardFooter className="pt-3 border-t">
														<div className="w-full flex justify-between items-center text-xs text-gray-500">
															<div className="flex items-center gap-4">
																<span>
																	ID:{" "}
																	{
																		analysis.id
																	}
																</span>
																{analysis.duration && (
																	<span>
																		Duración:{" "}
																		{formatDuration(
																			analysis.duration,
																		)}
																	</span>
																)}
															</div>
															{analysis.completedAt && (
																<span>
																	Completado:{" "}
																	{new Date(
																		analysis.completedAt,
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

					<TabsContent value="pending" className="mt-0">
						{statusFilter === "pending" && (
							<>
								{filteredAnalyses.length === 0 ? (
									<div className="text-center py-12">
										<div className="text-gray-400 mb-4">
											<Clock className="h-16 w-16 mx-auto" />
										</div>
										<h3 className="text-lg font-medium text-gray-900 mb-2">
											No hay análisis pendientes
										</h3>
										<p className="text-gray-600">
											Los análisis pendientes aparecerán
											aquí
										</p>
									</div>
								) : (
									<div className="space-y-4">
										{filteredAnalyses.map((analysis) => {
											const StatusIcon =
												statusConfig[analysis.status]
													.icon
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
																		<StatusIcon className="h-3 w-3 mr-1" />
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
																		Preset:{" "}
																		{
																			analysis.presetName
																		}
																	</span>
																	<span>
																		•
																	</span>
																	<span>
																		Fuente:{" "}
																		{analysis.inputSource ===
																		"manual"
																			? "Manual"
																			: analysis.inputSource ===
																				  "file"
																				? "Archivo"
																				: "URL"}
																	</span>
																	<span>
																		•
																	</span>
																	<span>
																		{new Date(
																			analysis.createdAt,
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
																				analysis,
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
															<div className="space-y-2">
																<div className="text-sm font-medium text-gray-700">
																	Texto
																	Analizado:
																</div>
																<p className="text-sm text-gray-600 line-clamp-2 bg-gray-50 p-2 rounded">
																	{
																		analysis.inputText
																	}
																</p>
															</div>
														</div>
													</CardContent>

													<CardFooter className="pt-3 border-t">
														<div className="w-full flex justify-between items-center text-xs text-gray-500">
															<div className="flex items-center gap-4">
																<span>
																	ID:{" "}
																	{
																		analysis.id
																	}
																</span>
															</div>
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

					<TabsContent value="running" className="mt-0">
						{statusFilter === "running" && (
							<>
								{filteredAnalyses.length === 0 ? (
									<div className="text-center py-12">
										<div className="text-gray-400 mb-4">
											<Play className="h-16 w-16 mx-auto" />
										</div>
										<h3 className="text-lg font-medium text-gray-900 mb-2">
											No hay análisis en progreso
										</h3>
										<p className="text-gray-600">
											Los análisis en ejecución aparecerán
											aquí
										</p>
									</div>
								) : (
									<div className="space-y-4">
										{filteredAnalyses.map((analysis) => {
											const StatusIcon =
												statusConfig[analysis.status]
													.icon
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
																		<StatusIcon className="h-3 w-3 mr-1" />
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
																		Preset:{" "}
																		{
																			analysis.presetName
																		}
																	</span>
																	<span>
																		•
																	</span>
																	<span>
																		Fuente:{" "}
																		{analysis.inputSource ===
																		"manual"
																			? "Manual"
																			: analysis.inputSource ===
																				  "file"
																				? "Archivo"
																				: "URL"}
																	</span>
																	<span>
																		•
																	</span>
																	<span>
																		{new Date(
																			analysis.createdAt,
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
																				analysis,
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
															<div className="space-y-2">
																<div className="flex justify-between text-sm">
																	<span>
																		Progreso
																		del
																		análisis
																	</span>
																	<span>
																		{
																			analysis.progress
																		}
																		%
																	</span>
																</div>
																<Progress
																	value={
																		analysis.progress
																	}
																	className="h-2"
																/>
															</div>

															<div className="space-y-2">
																<div className="text-sm font-medium text-gray-700">
																	Texto
																	Analizado:
																</div>
																<p className="text-sm text-gray-600 line-clamp-2 bg-gray-50 p-2 rounded">
																	{
																		analysis.inputText
																	}
																</p>
															</div>
														</div>
													</CardContent>

													<CardFooter className="pt-3 border-t">
														<div className="w-full flex justify-between items-center text-xs text-gray-500">
															<div className="flex items-center gap-4">
																<span>
																	ID:{" "}
																	{
																		analysis.id
																	}
																</span>
															</div>
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

					<TabsContent value="completed" className="mt-0">
						{statusFilter === "completed" && (
							<>
								{filteredAnalyses.length === 0 ? (
									<div className="text-center py-12">
										<div className="text-gray-400 mb-4">
											<CheckCircle className="h-16 w-16 mx-auto" />
										</div>
										<h3 className="text-lg font-medium text-gray-900 mb-2">
											No hay análisis completados
										</h3>
										<p className="text-gray-600">
											Los análisis completados aparecerán
											aquí
										</p>
									</div>
								) : (
									<div className="space-y-4">
										{filteredAnalyses.map((analysis) => {
											const StatusIcon =
												statusConfig[analysis.status]
													.icon
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
																		<StatusIcon className="h-3 w-3 mr-1" />
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
																		Preset:{" "}
																		{
																			analysis.presetName
																		}
																	</span>
																	<span>
																		•
																	</span>
																	<span>
																		Fuente:{" "}
																		{analysis.inputSource ===
																		"manual"
																			? "Manual"
																			: analysis.inputSource ===
																				  "file"
																				? "Archivo"
																				: "URL"}
																	</span>
																	<span>
																		•
																	</span>
																	<span>
																		{new Date(
																			analysis.createdAt,
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
																				analysis,
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
															{/* Results Summary */}
															{analysis.results && (
																<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
																	<div className="bg-gray-50 rounded-lg p-3">
																		<div className="text-sm text-gray-600 mb-1">
																			Puntuación
																			General
																		</div>
																		<div
																			className={`text-2xl font-bold ${getOverallScoreColor(analysis.results.overallScore)}`}
																		>
																			{
																				analysis
																					.results
																					.overallScore
																			}
																			/10
																		</div>
																	</div>
																	<div className="bg-gray-50 rounded-lg p-3">
																		<div className="text-sm text-gray-600 mb-1">
																			Sesgos
																			Detectados
																		</div>
																		<div className="text-2xl font-bold text-gray-900">
																			{
																				analysis
																					.results
																					.biasesDetected
																					.length
																			}
																		</div>
																	</div>
																	<div className="bg-gray-50 rounded-lg p-3">
																		<div className="text-sm text-gray-600 mb-1">
																			Palabras
																			Analizadas
																		</div>
																		<div className="text-2xl font-bold text-gray-900">
																			{analysis.results.totalWords.toLocaleString()}
																		</div>
																	</div>
																</div>
															)}

															{/* Bias Categories */}
															{analysis.results &&
																analysis.results
																	.biasesDetected
																	.length >
																	0 && (
																	<div className="space-y-2">
																		<div className="text-sm font-medium text-gray-700">
																			Categorías
																			de
																			Sesgo
																			Detectadas:
																		</div>
																		<div className="flex flex-wrap gap-2">
																			{analysis.results.biasesDetected.map(
																				(
																					bias,
																					index,
																				) => (
																					<Badge
																						key={
																							index
																						}
																						variant="outline"
																						className={
																							severityConfig[
																								bias
																									.severity
																							]
																								.color
																						}
																					>
																						{
																							bias.category
																						}{" "}
																						(
																						{
																							severityConfig[
																								bias
																									.severity
																							]
																								.label
																						}

																						)
																					</Badge>
																				),
																			)}
																		</div>
																	</div>
																)}

															<div className="space-y-2">
																<div className="text-sm font-medium text-gray-700">
																	Texto
																	Analizado:
																</div>
																<p className="text-sm text-gray-600 line-clamp-2 bg-gray-50 p-2 rounded">
																	{
																		analysis.inputText
																	}
																</p>
															</div>
														</div>
													</CardContent>

													<CardFooter className="pt-3 border-t">
														<div className="w-full flex justify-between items-center text-xs text-gray-500">
															<div className="flex items-center gap-4">
																<span>
																	ID:{" "}
																	{
																		analysis.id
																	}
																</span>
																{analysis.duration && (
																	<span>
																		Duración:{" "}
																		{formatDuration(
																			analysis.duration,
																		)}
																	</span>
																)}
															</div>
															{analysis.completedAt && (
																<span>
																	Completado:{" "}
																	{new Date(
																		analysis.completedAt,
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

					<TabsContent value="failed" className="mt-0">
						{statusFilter === "failed" && (
							<>
								{filteredAnalyses.length === 0 ? (
									<div className="text-center py-12">
										<div className="text-gray-400 mb-4">
											<XCircle className="h-16 w-16 mx-auto" />
										</div>
										<h3 className="text-lg font-medium text-gray-900 mb-2">
											No hay análisis con errores
										</h3>
										<p className="text-gray-600">
											Los análisis con errores aparecerán
											aquí
										</p>
									</div>
								) : (
									<div className="space-y-4">
										{filteredAnalyses.map((analysis) => {
											const StatusIcon =
												statusConfig[analysis.status]
													.icon
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
																		<StatusIcon className="h-3 w-3 mr-1" />
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
																		Preset:{" "}
																		{
																			analysis.presetName
																		}
																	</span>
																	<span>
																		•
																	</span>
																	<span>
																		Fuente:{" "}
																		{analysis.inputSource ===
																		"manual"
																			? "Manual"
																			: analysis.inputSource ===
																				  "file"
																				? "Archivo"
																				: "URL"}
																	</span>
																	<span>
																		•
																	</span>
																	<span>
																		{new Date(
																			analysis.createdAt,
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
																				analysis,
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
															{/* Error Message */}
															{analysis.error && (
																<div className="bg-red-50 border border-red-200 rounded-lg p-3">
																	<div className="flex items-center gap-2 text-red-800 text-sm font-medium mb-1">
																		<XCircle className="h-4 w-4" />
																		Error en
																		el
																		análisis
																	</div>
																	<p className="text-red-700 text-sm">
																		{
																			analysis.error
																		}
																	</p>
																</div>
															)}

															<div className="space-y-2">
																<div className="text-sm font-medium text-gray-700">
																	Texto
																	Analizado:
																</div>
																<p className="text-sm text-gray-600 line-clamp-2 bg-gray-50 p-2 rounded">
																	{
																		analysis.inputText
																	}
																</p>
															</div>
														</div>
													</CardContent>

													<CardFooter className="pt-3 border-t">
														<div className="w-full flex justify-between items-center text-xs text-gray-500">
															<div className="flex items-center gap-4">
																<span>
																	ID:{" "}
																	{
																		analysis.id
																	}
																</span>
															</div>
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
									{analysisToDelete?.name}
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
	cancelled: {
		label: "Cancelado",
		color: "bg-orange-100 text-orange-800",
		icon: AlertTriangle,
	},
}
