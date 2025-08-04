"use client"

import { useState } from "react"
import {
	Plus,
	Search,
	Settings,
	Trash2,
	Eye,
	Edit,
	Zap,
	Copy,
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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
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
import PresetForm from "@/components/preset-form"
import PresetDetails from "@/components/preset-details"

interface ModelConfig {
	modelId: string
	modelName: string
	role: "primary" | "secondary" | "tertiary"
	parameters: {
		temperature: number
		maxTokens: number
		topP: number
		frequencyPenalty: number
		presencePenalty: number
		systemPrompt?: string
	}
}

interface Preset {
	id: string
	name: string
	description?: string
	category: string
	models: ModelConfig[]
	isActive: boolean
	createdAt: string
	lastUsed?: string
	usageCount: number
}

const initialPresets: Preset[] = [
	{
		id: "1",
		name: "Análisis Creativo",
		description:
			"Combinación ideal para análisis profundo y generación creativa",
		category: "Escritura",
		models: [
			{
				modelId: "1",
				modelName: "GPT-4 Principal",
				role: "primary",
				parameters: {
					temperature: 0.7,
					maxTokens: 2000,
					topP: 0.9,
					frequencyPenalty: 0.1,
					presencePenalty: 0.1,
					systemPrompt:
						"Eres un asistente especializado en análisis creativo y escritura.",
				},
			},
			{
				modelId: "2",
				modelName: "Claude Sonnet",
				role: "secondary",
				parameters: {
					temperature: 0.8,
					maxTokens: 1500,
					topP: 0.95,
					frequencyPenalty: 0.2,
					presencePenalty: 0.15,
					systemPrompt:
						"Proporciona perspectivas alternativas y refinamiento creativo.",
				},
			},
		],
		isActive: true,
		createdAt: "2024-01-15",
		lastUsed: "2024-01-30",
		usageCount: 45,
	},
	{
		id: "2",
		name: "Desarrollo de Código",
		description: "Optimizado para programación y revisión de código",
		category: "Desarrollo",
		models: [
			{
				modelId: "1",
				modelName: "GPT-4 Principal",
				role: "primary",
				parameters: {
					temperature: 0.2,
					maxTokens: 3000,
					topP: 0.8,
					frequencyPenalty: 0.0,
					presencePenalty: 0.0,
					systemPrompt:
						"Eres un experto desarrollador de software especializado en múltiples lenguajes.",
				},
			},
		],
		isActive: true,
		createdAt: "2024-01-10",
		lastUsed: "2024-01-29",
		usageCount: 78,
	},
	{
		id: "3",
		name: "Investigación Académica",
		description:
			"Para análisis riguroso y síntesis de información académica",
		category: "Investigación",
		models: [
			{
				modelId: "2",
				modelName: "Claude Sonnet",
				role: "primary",
				parameters: {
					temperature: 0.3,
					maxTokens: 4000,
					topP: 0.85,
					frequencyPenalty: 0.1,
					presencePenalty: 0.05,
					systemPrompt:
						"Eres un investigador académico especializado en análisis riguroso.",
				},
			},
			{
				modelId: "3",
				modelName: "Llama Local",
				role: "secondary",
				parameters: {
					temperature: 0.4,
					maxTokens: 2000,
					topP: 0.9,
					frequencyPenalty: 0.0,
					presencePenalty: 0.0,
					systemPrompt:
						"Proporciona verificación y análisis complementario.",
				},
			},
		],
		isActive: false,
		createdAt: "2024-01-05",
		usageCount: 23,
	},
]

const categories = [
	"Todos",
	"Escritura",
	"Desarrollo",
	"Investigación",
	"Análisis",
	"Creatividad",
]

export default function PresetsPage() {
	const [presets, setPresets] = useState<Preset[]>(initialPresets)
	const [searchTerm, setSearchTerm] = useState("")
	const [selectedCategory, setSelectedCategory] = useState("Todos")
	const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null)
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
	const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [presetToDelete, setPresetToDelete] = useState<Preset | null>(null)

	const filteredPresets = presets.filter((preset) => {
		const matchesSearch =
			preset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			preset.description
				?.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			preset.category.toLowerCase().includes(searchTerm.toLowerCase())

		const matchesCategory =
			selectedCategory === "Todos" || preset.category === selectedCategory

		return matchesSearch && matchesCategory
	})

	const handleCreatePreset = (
		presetData: Omit<Preset, "id" | "createdAt" | "usageCount">,
	) => {
		const newPreset: Preset = {
			...presetData,
			id: Date.now().toString(),
			createdAt: new Date().toISOString().split("T")[0] ?? "",
			usageCount: 0,
		}
		setPresets([...presets, newPreset])
		setIsCreateDialogOpen(false)
	}

	const handleEditPreset = (
		presetData: Omit<Preset, "id" | "createdAt" | "usageCount">,
	) => {
		if (!selectedPreset) return

		const updatedPreset: Preset = {
			...presetData,
			id: selectedPreset.id,
			createdAt: selectedPreset.createdAt,
			usageCount: selectedPreset.usageCount,
		}

		setPresets(
			presets.map((preset) =>
				preset.id === selectedPreset.id ? updatedPreset : preset,
			),
		)
		setIsEditDialogOpen(false)
		setSelectedPreset(null)
	}

	const handleDeletePreset = () => {
		if (!presetToDelete) return

		setPresets(presets.filter((preset) => preset.id !== presetToDelete.id))
		setIsDeleteDialogOpen(false)
		setPresetToDelete(null)
	}

	const handleDuplicatePreset = (preset: Preset) => {
		const duplicatedPreset: Preset = {
			...preset,
			id: Date.now().toString(),
			name: `${preset.name} (Copia)`,
			createdAt: new Date().toISOString().split("T")[0] ?? "",
			usageCount: 0,
			lastUsed: undefined,
		}
		setPresets([...presets, duplicatedPreset])
	}

	const getRoleColor = (role: string) => {
		switch (role) {
			case "primary":
				return "bg-blue-100 text-blue-800"
			case "secondary":
				return "bg-green-100 text-green-800"
			case "tertiary":
				return "bg-purple-100 text-purple-800"
			default:
				return "bg-gray-100 text-gray-800"
		}
	}

	const getRoleText = (role: string) => {
		switch (role) {
			case "primary":
				return "Principal"
			case "secondary":
				return "Secundario"
			case "tertiary":
				return "Terciario"
			default:
				return role
		}
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Gestión de Presets
					</h1>
					<p className="text-gray-600">
						Administra combinaciones de modelos con configuraciones
						específicas
					</p>
				</div>

				{/* Actions Bar */}
				<div className="flex flex-col lg:flex-row gap-4 mb-6">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
						<Input
							placeholder="Buscar presets..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>

					<div className="flex flex-wrap gap-2">
						{categories.map((category) => (
							<Button
								key={category}
								variant={
									selectedCategory === category
										? "default"
										: "outline"
								}
								size="sm"
								onClick={() => setSelectedCategory(category)}
							>
								{category}
							</Button>
						))}
					</div>

					<Dialog
						open={isCreateDialogOpen}
						onOpenChange={setIsCreateDialogOpen}
					>
						<DialogTrigger asChild>
							<Button className="flex items-center gap-2">
								<Plus className="h-4 w-4" />
								Nuevo Preset
							</Button>
						</DialogTrigger>
						<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
							<DialogHeader>
								<DialogTitle>Crear Nuevo Preset</DialogTitle>
								<DialogDescription>
									Configura una nueva combinación de modelos
									con parámetros específicos
								</DialogDescription>
							</DialogHeader>
							<PresetForm onSubmit={handleCreatePreset} />
						</DialogContent>
					</Dialog>
				</div>

				{/* Presets Grid */}
				{filteredPresets.length === 0 ? (
					<div className="text-center py-12">
						<div className="text-gray-400 mb-4">
							<Zap className="h-16 w-16 mx-auto" />
						</div>
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							{searchTerm || selectedCategory !== "Todos"
								? "No se encontraron presets"
								: "No hay presets configurados"}
						</h3>
						<p className="text-gray-600 mb-4">
							{searchTerm || selectedCategory !== "Todos"
								? "Intenta con otros términos de búsqueda o categorías"
								: "Comienza creando tu primer preset"}
						</p>
						{!searchTerm && selectedCategory === "Todos" && (
							<Button onClick={() => setIsCreateDialogOpen(true)}>
								<Plus className="h-4 w-4 mr-2" />
								Crear Primer Preset
							</Button>
						)}
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
						{filteredPresets.map((preset) => (
							<Card
								key={preset.id}
								className="hover:shadow-lg transition-shadow"
							>
								<CardHeader className="pb-3">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1">
												<CardTitle className="text-lg">
													{preset.name}
												</CardTitle>
												{!preset.isActive && (
													<Badge variant="secondary">
														Inactivo
													</Badge>
												)}
											</div>
											<CardDescription className="text-sm">
												{preset.category}
											</CardDescription>
										</div>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="sm"
													className="h-8 w-8 p-0"
												>
													<Settings className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem
													onClick={() => {
														setSelectedPreset(
															preset,
														)
														setIsDetailsDialogOpen(
															true,
														)
													}}
												>
													<Eye className="h-4 w-4 mr-2" />
													Ver Detalles
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => {
														setSelectedPreset(
															preset,
														)
														setIsEditDialogOpen(
															true,
														)
													}}
												>
													<Edit className="h-4 w-4 mr-2" />
													Editar
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() =>
														handleDuplicatePreset(
															preset,
														)
													}
												>
													<Copy className="h-4 w-4 mr-2" />
													Duplicar
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => {
														setPresetToDelete(
															preset,
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
									<div className="space-y-3">
										{preset.description && (
											<p className="text-sm text-gray-600 line-clamp-2">
												{preset.description}
											</p>
										)}

										<div className="space-y-2">
											<div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
												Modelos
											</div>
											{preset.models.map(
												(model, index) => (
													<div
														key={index}
														className="flex items-center justify-between text-sm"
													>
														<span className="font-medium truncate">
															{model.modelName}
														</span>
														<Badge
															variant="outline"
															className={getRoleColor(
																model.role,
															)}
														>
															{getRoleText(
																model.role,
															)}
														</Badge>
													</div>
												),
											)}
										</div>

										<div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
											<div>
												<span className="font-medium">
													Usos:
												</span>{" "}
												{preset.usageCount}
											</div>
											{preset.lastUsed && (
												<div>
													<span className="font-medium">
														Último uso:
													</span>{" "}
													{new Date(
														preset.lastUsed,
													).toLocaleDateString()}
												</div>
											)}
										</div>
									</div>
								</CardContent>

								<CardFooter className="pt-3 border-t">
									<div className="w-full text-xs text-gray-500">
										<div className="flex justify-between items-center">
											<span>
												Creado:{" "}
												{new Date(
													preset.createdAt,
												).toLocaleDateString()}
											</span>
											<div className="flex items-center gap-1">
												<div className="w-2 h-2 rounded-full bg-green-500" />
												<span>
													{preset.models.length}{" "}
													modelo
													{preset.models.length !== 1
														? "s"
														: ""}
												</span>
											</div>
										</div>
									</div>
								</CardFooter>
							</Card>
						))}
					</div>
				)}

				{/* Edit Dialog */}
				<Dialog
					open={isEditDialogOpen}
					onOpenChange={setIsEditDialogOpen}
				>
					<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle>Editar Preset</DialogTitle>
							<DialogDescription>
								Modifica la configuración del preset
								seleccionado
							</DialogDescription>
						</DialogHeader>
						{selectedPreset && (
							<PresetForm
								initialData={selectedPreset}
								onSubmit={handleEditPreset}
								isEditing
							/>
						)}
					</DialogContent>
				</Dialog>

				{/* Details Dialog */}
				<Dialog
					open={isDetailsDialogOpen}
					onOpenChange={setIsDetailsDialogOpen}
				>
					<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle>Detalles del Preset</DialogTitle>
							<DialogDescription>
								Información completa del preset seleccionado
							</DialogDescription>
						</DialogHeader>
						{selectedPreset && (
							<PresetDetails preset={selectedPreset} />
						)}
					</DialogContent>
				</Dialog>

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
								permanentemente el preset
								<strong className="font-medium">
									{" "}
									{presetToDelete?.name}
								</strong>{" "}
								y toda su configuración.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancelar</AlertDialogCancel>
							<AlertDialogAction
								onClick={handleDeletePreset}
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
