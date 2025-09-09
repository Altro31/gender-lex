"use client"

import Loader from "@/components/loader"
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
import ClonePresetAlertDialog from "@/sections/preset/components/dialogs/clone-preset-alert-dialog-content"
import DeletePresetAlertDialog from "@/sections/preset/components/dialogs/delete-preset-alert-dialog-content"
import DetailsPresetDialog from "@/sections/preset/components/dialogs/details-preset-dialog"
import EditPresetDialog from "@/sections/preset/components/dialogs/edit-model-dialog"
import type { PresetsResponse } from "@/types/preset"
import type { $Enums } from "@repo/db/models"
import { Copy, Edit, Eye, Settings, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

interface Props {
	preset: PresetsResponse[number]
}

type ExtendedPreset = PresetsResponse[number] & {
	itemStatus?: "clonning" | "deleting" | "clone"
}

export default function PresetListItem({ preset: initialPreset }: Props) {
	const t = useTranslations()
	const [preset, setPreset] = useState<ExtendedPreset>(initialPreset)

	useEffect(() => {
		setPreset(initialPreset)
	}, [setPreset, initialPreset])

	const handleItemStatus = (status: ExtendedPreset["itemStatus"]) => () => {
		setPreset((preset) => ({ ...preset, itemStatus: status }))
	}

	const isClone = preset.itemStatus === "clone"
	const isClonning = preset.itemStatus === "clonning"
	const isDeleting = preset.itemStatus === "deleting"
	const isDisabled = isClone || isDeleting

	return (
		<>
			{isClonning && (
				<PresetListItem
					preset={
						{
							...initialPreset,
							itemStatus: "clone",
						} as PresetsResponse[number]
					}
				/>
			)}
			<Card
				key={preset.id}
				data-disabled={isDeleting || isClone || undefined}
				className="after:bg-muted/80 relative overflow-clip transition-shadow after:absolute after:top-0 after:size-full not-data-disabled:after:hidden hover:shadow-lg"
			>
				<CardHeader>
					<div className="flex items-start justify-between">
						<CardTitle className="flex-1 text-lg">
							{preset.name}
						</CardTitle>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon">
									<Settings />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DetailsPresetDialog preset={preset}>
									<DropdownMenuItem disabled={isDeleting}>
										<Eye />
										{t("Commons.details")}
									</DropdownMenuItem>
								</DetailsPresetDialog>
								<EditPresetDialog preset={preset}>
									<DropdownMenuItem disabled={isDeleting}>
										<Edit />
										{t("Actions.edit")}
									</DropdownMenuItem>
								</EditPresetDialog>
								<ClonePresetAlertDialog
									preset={preset}
									onClone={handleItemStatus("clonning")}
								>
									<DropdownMenuItem
										disabled={isClonning || isDeleting}
									>
										{isClonning ? <Loader /> : <Copy />}
										{t("Commons.clone")}
									</DropdownMenuItem>
								</ClonePresetAlertDialog>

								<DeletePresetAlertDialog
									preset={preset}
									onDelete={handleItemStatus("deleting")}
								>
									<DropdownMenuItem
										variant="destructive"
										disabled={isDeleting}
									>
										{isDeleting ? <Loader /> : <Trash2 />}
										{t("Actions.delete")}
									</DropdownMenuItem>
								</DeletePresetAlertDialog>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					{preset.description && (
						<CardDescription className="line-clamp-2">
							{preset.description}
						</CardDescription>
					)}
				</CardHeader>

				<CardContent className="flex-1">
					<div className="space-y-2">
						<div className="space-y-2">
							<div className="text-xs font-medium tracking-wide text-gray-500 uppercase">
								{t("Model.root")}
							</div>
							{preset.Models.map((presetModel, index) => (
								<div
									key={presetModel.id}
									className="flex items-center justify-between text-sm"
								>
									<span className="truncate font-medium">
										{presetModel.Model.name}
									</span>
									<Badge
										variant="outline"
										className={getRoleColor(
											presetModel.role,
										)}
									>
										{getRoleText(presetModel.role)}
									</Badge>
								</div>
							))}
						</div>

						<div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
							{preset.usedAt && (
								<div>
									<span className="font-medium">
										{t("Commons.last-use")}:
									</span>{" "}
									{new Date(
										preset.usedAt,
									).toLocaleDateString()}
								</div>
							)}
						</div>
					</div>
				</CardContent>

				<CardFooter className="border-t">
					<div className="w-full text-xs text-gray-500">
						<div className="flex items-center justify-between">
							<span>
								{t("Commons.created-at")}:{" "}
								{new Date(
									preset.createdAt,
								).toLocaleDateString()}
							</span>
							<div className="flex items-center gap-1">
								<div className="h-2 w-2 rounded-full bg-green-500" />
								<span>
									{preset.Models.length}{" "}
									{t("Model.item").toLowerCase()}
									{preset.Models.length !== 1 ? "s" : ""}
								</span>
							</div>
						</div>
					</div>
				</CardFooter>

				{isDisabled && (
					<div className="text-muted-foreground absolute top-0 z-10 size-full">
						<div className="flex size-full items-center justify-center gap-2">
							<Loader />
							{isDeleting && <span>{t("Actions.deleting")}</span>}
							{isClone && <span>{t("Actions.clonning")}</span>}
						</div>
					</div>
				)}
			</Card>
		</>
	)
}

const getRoleColor = (role: $Enums.ModelRole) => {
	switch (role) {
		case "primary":
			return "bg-blue-100 text-blue-800"
		case "secondary":
			return "bg-green-100 text-green-800"
		default:
			return "bg-gray-100 text-gray-800"
	}
}

const getRoleText = (role: $Enums.ModelRole) => {
	switch (role) {
		case "primary":
			return "Principal"
		case "secondary":
			return "Secundario"
		default:
			return role
	}
}
