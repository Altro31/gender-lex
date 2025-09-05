"use client"

import PresetDetails from "@/components/preset-details"
import PresetForm from "@/components/preset-form"
import SearchInput from "@/components/search-input"
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import CreatePresetDialog from "@/sections/preset/components/dialogs/create-preset-dialog"
import type { PresetsResponse } from "@/types/preset"
import {
    Copy,
    Edit,
    Eye,
    Plus,
    Settings,
    Trash2,
    Zap
} from "lucide-react"
import { useQueryState } from "nuqs"

interface Props {
	presetResponse: PresetsResponse
}

export default function PresetsListContainer({ presetResponse }: Props) {
	const { data: presets } = presetResponse

	const [searchTerm] = useQueryState("q")

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="mb-2 text-3xl font-bold text-gray-900">
						Gestión de Presets
					</h1>
					<p className="text-gray-600">
						Administra combinaciones de modelos con configuraciones
						específicas
					</p>
				</div>

				{/* Actions Bar */}
				<div className="mb-6 flex flex-col gap-4 lg:flex-row">
					<SearchInput name="q" className="flex-1" />
					<CreatePresetDialog>
						<Button>
							<Plus />
							Nuevo Preset
						</Button>
					</CreatePresetDialog>
				</div>

				{/* Presets Grid */}
				{presets.length === 0 ? (
					<div className="py-12 text-center">
						<div className="mb-4 text-gray-400">
							<Zap className="mx-auto h-16 w-16" />
						</div>
						<h3 className="mb-2 text-lg font-medium text-gray-900">
							{searchTerm
								? "No se encontraron presets"
								: "No hay presets configurados"}
						</h3>
						<p className="mb-4 text-gray-600">
							{searchTerm
								? "Intenta con otros términos de búsqueda o categorías"
								: "Comienza creando tu primer preset"}
						</p>
						{!searchTerm && (
							<CreatePresetDialog>
								<Button>
									<Plus />
									Crear Primer Preset
								</Button>
							</CreatePresetDialog>
						)}
					</div>
				) : (
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
						{presets.map((preset) => (
							<Card
								key={preset.id}
								className="transition-shadow hover:shadow-lg"
							>
								<CardHeader className="pb-3">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<div className="mb-1 flex items-center gap-2">
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
													<Eye className="mr-2 h-4 w-4" />
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
													<Edit className="mr-2 h-4 w-4" />
													Editar
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() =>
														handleDuplicatePreset(
															preset,
														)
													}
												>
													<Copy className="mr-2 h-4 w-4" />
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
													<Trash2 className="mr-2 h-4 w-4" />
													Eliminar
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</CardHeader>

								<CardContent className="pb-3">
									<div className="space-y-3">
										{preset.description && (
											<p className="line-clamp-2 text-sm text-gray-600">
												{preset.description}
											</p>
										)}

										<div className="space-y-2">
											<div className="text-xs font-medium tracking-wide text-gray-500 uppercase">
												Modelos
											</div>
											{preset.models.map(
												(model, index) => (
													<div
														key={index}
														className="flex items-center justify-between text-sm"
													>
														<span className="truncate font-medium">
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

								<CardFooter className="border-t pt-3">
									<div className="w-full text-xs text-gray-500">
										<div className="flex items-center justify-between">
											<span>
												Creado:{" "}
												{new Date(
													preset.createdAt,
												).toLocaleDateString()}
											</span>
											<div className="flex items-center gap-1">
												<div className="h-2 w-2 rounded-full bg-green-500" />
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
					<DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
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
					<DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
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
