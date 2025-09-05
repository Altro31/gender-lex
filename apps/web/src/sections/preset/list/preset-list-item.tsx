import type { PresetsResponseItem } from "@/types/preset"
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
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"

interface Props {
	preset: PresetsResponseItem
}

export default function PresetListItem({ preset }: Props) {
	return (
		<Card key={preset.id} className="transition-shadow hover:shadow-lg">
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<CardTitle className="flex-1 text-lg">
						{preset.attributes.name}
					</CardTitle>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon">
								<Settings />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() => {
									setSelectedPreset(preset)
									setIsDetailsDialogOpen(true)
								}}
							>
								<Eye className="mr-2 h-4 w-4" />
								Ver Detalles
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									setSelectedPreset(preset)
									setIsEditDialogOpen(true)
								}}
							>
								<Edit className="mr-2 h-4 w-4" />
								Editar
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => handleDuplicatePreset(preset)}
							>
								<Copy className="mr-2 h-4 w-4" />
								Duplicar
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									setPresetToDelete(preset)
									setIsDeleteDialogOpen(true)
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
						{preset.models.map((model, index) => (
							<div
								key={index}
								className="flex items-center justify-between text-sm"
							>
								<span className="truncate font-medium">
									{model.modelName}
								</span>
								<Badge
									variant="outline"
									className={getRoleColor(model.role)}
								>
									{getRoleText(model.role)}
								</Badge>
							</div>
						))}
					</div>

					<div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
						<div>
							<span className="font-medium">Usos:</span>{" "}
							{preset.usageCount}
						</div>
						{preset.lastUsed && (
							<div>
								<span className="font-medium">Último uso:</span>{" "}
								{new Date(preset.lastUsed).toLocaleDateString()}
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
							{new Date(preset.createdAt).toLocaleDateString()}
						</span>
						<div className="flex items-center gap-1">
							<div className="h-2 w-2 rounded-full bg-green-500" />
							<span>
								{preset.models.length} modelo
								{preset.models.length !== 1 ? "s" : ""}
							</span>
						</div>
					</div>
				</div>
			</CardFooter>
		</Card>
	)
}
