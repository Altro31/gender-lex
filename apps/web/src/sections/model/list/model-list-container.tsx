"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import CreateModelDialog from "@/sections/model/components/dialogs/create-model-dialog"
import ModelListItem from "@/sections/model/list/model-list-item"
import type { ModelsResponse } from "@/types/model"
import { Plus, Search, Settings } from "lucide-react"
import { useTranslations } from "next-intl"
import { useQueryState } from "nuqs"

interface Props {
	modelsResponse: ModelsResponse
}

export default function ModelListsContainer({ modelsResponse }: Props) {
	const { data: models } = modelsResponse
	const t = useTranslations()
	const [searchTerm, setSearchTerm] = useQueryState("q", { defaultValue: "" })

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
							onInput={(e) =>
								setSearchTerm((e.target as any).value)
							}
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
					<div className="py-6 text-center">
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
					<div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
						{models.map((model) => (
							<ModelListItem model={model} key={model.id} />
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
