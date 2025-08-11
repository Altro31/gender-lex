"use client"

import { useState } from "react"
import { Plus, Search, Settings, Trash2, Eye, Edit } from "lucide-react"
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
import ModelForm from "@/components/model-form"
import ModelDetails from "@/components/model-details"

interface Model {
	id: string
	name: string
	provider: string
	model: string
	apiKey: string
	endpoint?: string
	status: "active" | "inactive" | "error"
	createdAt: string
	lastUsed?: string
	description?: string
}

const initialModels: Model[] = [
	{
		id: "1",
		name: "GPT-4 Principal",
		provider: "OpenAI",
		model: "gpt-4",
		apiKey: "sk-*********************",
		status: "active",
		createdAt: "2024-01-15",
		lastUsed: "2024-01-30",
		description: "Modelo principal para tareas de conversación y análisis",
	},
	{
		id: "2",
		name: "Claude Sonnet",
		provider: "Anthropic",
		model: "claude-3-sonnet",
		apiKey: "sk-ant-*********************",
		status: "active",
		createdAt: "2024-01-10",
		lastUsed: "2024-01-29",
		description: "Modelo especializado en escritura creativa",
	},
	{
		id: "3",
		name: "Llama Local",
		provider: "Meta",
		model: "llama-2-70b",
		apiKey: "",
		endpoint: "http://localhost:8080",
		status: "inactive",
		createdAt: "2024-01-05",
		description: "Modelo local para desarrollo y pruebas",
	},
]

export default function ModelsPage() {
	const [models, setModels] = useState<Model[]>(initialModels)
	const [searchTerm, setSearchTerm] = useState("")
	const [selectedModel, setSelectedModel] = useState<Model | null>(null)
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
	const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [modelToDelete, setModelToDelete] = useState<Model | null>(null)

	const filteredModels = models.filter(
		(model) =>
			model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			model.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
			model.model.toLowerCase().includes(searchTerm.toLowerCase()),
	)

	const handleCreateModel = (modelData: Omit<Model, "id" | "createdAt">) => {
		const newModel: Model = {
			...modelData,
			id: Date.now().toString(),
			createdAt: new Date().toISOString().split("T")[0] ?? "",
		}
		setModels([...models, newModel])
		setIsCreateDialogOpen(false)
	}

	const handleEditModel = (modelData: Omit<Model, "id" | "createdAt">) => {
		if (!selectedModel) return

		const updatedModel: Model = {
			...modelData,
			id: selectedModel.id,
			createdAt: selectedModel.createdAt,
		}

		setModels(
			models.map((model) =>
				model.id === selectedModel.id ? updatedModel : model,
			),
		)
		setIsEditDialogOpen(false)
		setSelectedModel(null)
	}

	const handleDeleteModel = () => {
		if (!modelToDelete) return

		setModels(models.filter((model) => model.id !== modelToDelete.id))
		setIsDeleteDialogOpen(false)
		setModelToDelete(null)
	}

	const getStatusColor = (status: Model["status"]) => {
		switch (status) {
			case "active":
				return "bg-green-100 text-green-800 hover:bg-green-200"
			case "inactive":
				return "bg-gray-100 text-gray-800 hover:bg-gray-200"
			case "error":
				return "bg-red-100 text-red-800 hover:bg-red-200"
			default:
				return "bg-gray-100 text-gray-800 hover:bg-gray-200"
		}
	}

	const getStatusText = (status: Model["status"]) => {
		switch (status) {
			case "active":
				return "Activo"
			case "inactive":
				return "Inactivo"
			case "error":
				return "Error"
			default:
				return "Desconocido"
		}
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="mb-2 text-3xl font-bold text-gray-900">
						Gestión de Modelos
					</h1>
					<p className="text-gray-600">
						Administra tus conexiones a modelos de lenguaje de gran
						tamaño
					</p>
				</div>

				{/* Actions Bar */}
				<div className="mb-6 flex flex-col gap-4 sm:flex-row">
					<div className="relative flex-1">
						<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
						<Input
							placeholder="Buscar modelos..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>

					<Dialog
						open={isCreateDialogOpen}
						onOpenChange={setIsCreateDialogOpen}
					>
						<DialogTrigger asChild>
							<Button className="flex items-center gap-2">
								<Plus className="h-4 w-4" />
								Nuevo Modelo
							</Button>
						</DialogTrigger>
						<DialogContent className="max-w-2xl">
							<DialogHeader>
								<DialogTitle>Crear Nuevo Modelo</DialogTitle>
								<DialogDescription>
									Configura una nueva conexión a un modelo de
									lenguaje
								</DialogDescription>
							</DialogHeader>
							<ModelForm onSubmit={handleCreateModel} />
						</DialogContent>
					</Dialog>
				</div>

				{/* Models Grid */}
				{filteredModels.length === 0 ? (
					<div className="py-12 text-center">
						<div className="mb-4 text-gray-400">
							<Settings className="mx-auto h-16 w-16" />
						</div>
						<h3 className="mb-2 text-lg font-medium text-gray-900">
							{searchTerm
								? "No se encontraron modelos"
								: "No hay modelos configurados"}
						</h3>
						<p className="mb-4 text-gray-600">
							{searchTerm
								? "Intenta con otros términos de búsqueda"
								: "Comienza creando tu primer modelo"}
						</p>
						{!searchTerm && (
							<Button onClick={() => setIsCreateDialogOpen(true)}>
								<Plus className="mr-2 h-4 w-4" />
								Crear Primer Modelo
							</Button>
						)}
					</div>
				) : (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{filteredModels.map((model) => (
							<Card
								key={model.id}
								className="transition-shadow hover:shadow-lg"
							>
								<CardHeader className="pb-3">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<CardTitle className="mb-1 text-lg">
												{model.name}
											</CardTitle>
											<CardDescription className="text-sm">
												{model.provider} • {model.model}
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
														setSelectedModel(model)
														setIsDetailsDialogOpen(
															true,
														)
													}}
												>
													<Eye className="mr-2 h-4 w-4" />
													Ver Detalles
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => {
														setSelectedModel(model)
														setIsEditDialogOpen(
															true,
														)
													}}
												>
													<Edit className="mr-2 h-4 w-4" />
													Editar
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => {
														setModelToDelete(model)
														setIsDeleteDialogOpen(
															true,
														)
													}}
													className="text-red-600"
												>
													<Trash2 className="mr-2 h-4 w-4" />
													Eliminar
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</CardHeader>

								<CardContent className="pb-3">
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<span className="text-sm text-gray-600">
												Estado:
											</span>
											<Badge
												className={getStatusColor(
													model.status,
												)}
											>
												{getStatusText(model.status)}
											</Badge>
										</div>

										{model.description && (
											<p className="line-clamp-2 text-sm text-gray-600">
												{model.description}
											</p>
										)}
									</div>
								</CardContent>

								<CardFooter className="border-t pt-3">
									<div className="w-full text-xs text-gray-500">
										<div className="flex justify-between">
											<span>
												Creado:{" "}
												{new Date(
													model.createdAt,
												).toLocaleDateString()}
											</span>
											{model.lastUsed && (
												<span>
													Último uso:{" "}
													{new Date(
														model.lastUsed,
													).toLocaleDateString()}
												</span>
											)}
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
					<DialogContent className="max-w-2xl">
						<DialogHeader>
							<DialogTitle>Editar Modelo</DialogTitle>
							<DialogDescription>
								Modifica la configuración del modelo
								seleccionado
							</DialogDescription>
						</DialogHeader>
						{selectedModel && (
							<ModelForm
								initialData={selectedModel}
								onSubmit={handleEditModel}
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
					<DialogContent className="max-w-2xl">
						<DialogHeader>
							<DialogTitle>Detalles del Modelo</DialogTitle>
							<DialogDescription>
								Información completa del modelo seleccionado
							</DialogDescription>
						</DialogHeader>
						{selectedModel && (
							<ModelDetails model={selectedModel} />
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
								permanentemente el modelo
								<strong className="font-medium">
									{" "}
									{modelToDelete?.name}
								</strong>{" "}
								y toda su configuración.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancelar</AlertDialogCancel>
							<AlertDialogAction
								onClick={handleDeleteModel}
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
