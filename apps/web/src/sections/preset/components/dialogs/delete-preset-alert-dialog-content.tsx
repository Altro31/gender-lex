"use client"

import BaseAlertDialog from "@/components/dialog/base-alert-dialog"
import {
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deletePreset } from "@/services/preset"
import type { PresetsResponse } from "@/types/preset"
import { useTranslations } from "next-intl"
import { useAction } from "next-safe-action/hooks"
import { type PropsWithChildren } from "react"

interface Props extends PropsWithChildren {
	preset: PresetsResponse[number]
	onDelete?: () => void
}

export default function DeletePresetAlertDialog({
	preset,
	children,
	onDelete,
}: Props) {
	const t = useTranslations()

	const { execute } = useAction(deletePreset)

	const handleDeletePreset = () => {
		onDelete?.()
		execute(preset.id)
	}

	return (
		<BaseAlertDialog trigger={children}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{t("Commons.are-you-shure")}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{t("Preset.delete.description.1")}
						<strong className="font-medium">
							{" "}
							{preset.name}
						</strong>{" "}
						.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>{t("Commons.cancel")}</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDeletePreset}
						className="bg-red-600 hover:bg-red-700"
					>
						{t("Actions.delete")}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</BaseAlertDialog>
	)
}
