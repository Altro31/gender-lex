"use client"

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteModel } from "@/services/model"
import type { ModelsResponseItem } from "@/types/model"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useAction } from "next-safe-action/hooks"
import { useState, type MouseEvent, type PropsWithChildren } from "react"

interface Props extends PropsWithChildren {
	model: ModelsResponseItem
}

export default function DeleteModelAlertDialog({ model, children }: Props) {
	const t = useTranslations()
	const [open, setOpen] = useState(false)
	const { executeAsync, status: deleteStatus } = useAction(deleteModel)
	const isDeleting =
		deleteStatus === "executing" || deleteStatus === "transitioning"

	const handleOpen = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		setOpen(true)
	}

	const handleDeleteModel = async (e: MouseEvent<HTMLButtonElement>) => {
		if (!isDeleting) {
			e.stopPropagation()
			await executeAsync(model.id)
			e.currentTarget?.click()
		}
	}

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger onClickCapture={handleOpen} asChild>
				{children}
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{t("Commons.are-you-shure")}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{t("Model.delete.description.1")}
						<strong className="font-medium">
							{" "}
							{model.attributes.name}
						</strong>{" "}
						.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>{t("Commons.cancel")}</AlertDialogCancel>
					<AlertDialogAction
						disabled={isDeleting}
						onClick={handleDeleteModel}
						className="bg-red-600 hover:bg-red-700"
					>
						{isDeleting && <Loader2 className="animate-spin" />}
						{isDeleting
							? t("Actions.deleting")
							: t("Actions.delete")}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
