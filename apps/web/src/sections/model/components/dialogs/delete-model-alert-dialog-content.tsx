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
import { Button } from "@/components/ui/button"
import { deleteModel } from "@/services/model"
import type { ModelsResponseItem } from "@/types/model"
import { useTranslations } from "next-intl"
import { useAction } from "next-safe-action/hooks"
import { type PropsWithChildren } from "react"

interface Props extends PropsWithChildren {
	model: ModelsResponseItem
	onDelete?: () => void
}

export default function DeleteModelAlertDialog({
	model,
	children,
	onDelete,
}: Props) {
	const t = useTranslations()

	const { execute } = useAction(deleteModel)

	const handleDeleteModel = async () => {
		execute(model.id)
		onDelete?.()
	}

	return (
		<BaseAlertDialog trigger={children}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{t("Commons.are-you-shure")}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{t("Model.delete.description.1")}
						<strong className="font-medium"> {model.name}</strong> .
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>{t("Commons.cancel")}</AlertDialogCancel>
					<Button variant="destructive" asChild>
						<AlertDialogAction onClick={handleDeleteModel}>
							{t("Actions.delete")}
						</AlertDialogAction>
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</BaseAlertDialog>
	)
}
