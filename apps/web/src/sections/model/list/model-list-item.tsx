"use client"

import type { ModelsResponseItem } from "@/types/model"
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
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
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DeleteModelAlertDialog from "@/sections/model/components/dialogs/delete-model-alert-dialog-content"
import type { Model } from "@repo/db/models"
import { Edit, Eye, Loader2, Settings, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useAction } from "next-safe-action/hooks"
import { testConnection } from "@/services/model"
import { useState } from "react"
import { useSse } from "@/lib/sse"
import EditModelDialog from "@/sections/model/components/dialogs/edit-model-dialog"
import { DialogTrigger } from "@/components/ui/dialog"

interface Props {
	model: ModelsResponseItem
}

export default function ModelListItem({ model }: Props) {
	const [status, setStatus] = useState(model.attributes.status)
	const t = useTranslations()

	const { execute, isPending } = useAction(testConnection, {
		onSuccess() {
			setStatus("active")
		},
		onError() {
			setStatus("error")
		},
		onExecute() {
			setStatus("connecting")
		},
	})

	return (
		<Card key={model.id} className="transition-shadow hover:shadow-lg">
			<CardHeader>
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<CardTitle className="mb-1 text-lg">
							{model.attributes.name}
						</CardTitle>
						<CardDescription className="text-sm">
							{model.attributes.provider} •{" "}
							{model.attributes.connection.identifier}
						</CardDescription>
					</div>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="size-8 p-0"
							>
								<Settings className="size-4" />
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
								<Eye />
								Ver Detalles
							</DropdownMenuItem>
							<EditModelDialog model={model}>
								<DropdownMenuItem>
									<Edit />
									Editar
								</DropdownMenuItem>
							</EditModelDialog>
							<DeleteModelAlertDialog model={model}>
								<DropdownMenuItem variant="destructive">
									<Trash2 />
									Eliminar
								</DropdownMenuItem>
							</DeleteModelAlertDialog>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardHeader>

			<CardContent>
				<div className="space-y-2">
					<div className="flex flex-wrap items-center gap-2">
						<span className="text-sm text-gray-600">Estado:</span>
						<Badge className={getStatusColor(status)}>
							{status === "connecting" && (
								<Loader2 className="animate-spin" />
							)}
							{t("Model.status." + status)}
						</Badge>
						<Button
							onClick={() => execute(model.id)}
							variant="outline"
							size="sm"
							disabled={isPending}
							className="text-sm"
						>
							Test Connection
						</Button>
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
	)
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
