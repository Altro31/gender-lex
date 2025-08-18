"use client"

import ModelForm from "@/components/model-form"
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
import { Input } from "@/components/ui/input"
import CreateModelDialog from "@/sections/model/components/dialogs/create-model-dialog"
import type { ModelsResponse } from "@/types/models"
import type { Model } from "@repo/db/models"
import { Edit, Eye, Plus, Search, Settings, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useQueryState } from "nuqs"

interface Props {
	modelsResponse: ModelsResponse
}

export default function ModelListsContainer({ modelsResponse }: Props) {
	const { data: models } = modelsResponse
	const t = useTranslations()
	const [searchTerm, setSearchTerm] = useQueryState("q", { defaultValue: "" })

	const getStatusColor = (status: Model["connection"]["status"]) => {
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
							value={searchTerm}
							placeholder="Buscar modelos..."
							onInput={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>

					<CreateModelDialog>
						<Button className="flex items-center gap-2">
							<Plus className="h-4 w-4" />
							Nuevo Modelo
						</Button>
					</CreateModelDialog>
				</div>

				{/* Models Grid */}
				{models.length === 0 ? (
					<div className="py-12 text-center">
						<div className="mb-4 text-gray-400">
							<Settings className="mx-auto h-16 w-16" />
						</div>
						<h3 className="mb-2 text-lg font-medium text-gray-900">
							No se encontraron modelos
						</h3>
						<p className="mb-4 text-gray-600">
							{searchTerm
								? "Intenta con otros términos de búsqueda"
								: "Comienza creando tu primer modelo"}
						</p>
						{!searchTerm && (
							<CreateModelDialog>
								<Button>
									<Plus className="mr-2 h-4 w-4" />
									Crear Primer Modelo
								</Button>
							</CreateModelDialog>
						)}
					</div>
				) : (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{models.map((model) => (
							<Card
								key={model.id}
								className="transition-shadow hover:shadow-lg"
							>
								<CardHeader className="pb-3">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<CardTitle className="mb-1 text-lg">
												{model.attributes.name}
											</CardTitle>
											<CardDescription className="text-sm">
												{model.attributes.provider} •{" "}
												{
													model.attributes.connection
														.identifier
												}
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
														// setSelectedModel(model)
														// setIsDetailsDialogOpen(
														// 	true,
														// )
													}}
												>
													<Eye className="mr-2 h-4 w-4" />
													Ver Detalles
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => {
														// setSelectedModel(model)
														// setIsEditDialogOpen(
														// 	true,
														// )
													}}
												>
													<Edit className="mr-2 h-4 w-4" />
													Editar
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => {
														// setModelToDelete(model)
														// setIsDeleteDialogOpen(
														// 	true,
														// )
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
													model.attributes.connection
														.status ?? "inactive",
												)}
											>
												{t(
													"Model.status." +
														model.attributes
															.connection.status,
												)}
											</Badge>
										</div>
									</div>
								</CardContent>
								<CardFooter className="border-t">
									<div className="w-full text-xs text-gray-500">
										<div className="flex justify-between">
											<span>
												Creado:{" "}
												{new Date(
													model.attributes.createdAt,
												).toLocaleDateString()}
											</span>
											{model.attributes.usedAt && (
												<span>
													Último uso:{" "}
													{new Date(
														model.attributes.usedAt,
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
				{/* <Dialog
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
				</Dialog> */}

				{/* Details Dialog */}
				{/* <Dialog
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
				</Dialog> */}

				{/* Delete Confirmation Dialog */}
				{/* <AlertDialog
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
				</AlertDialog> */}
			</div>
		</div>
	)
}
