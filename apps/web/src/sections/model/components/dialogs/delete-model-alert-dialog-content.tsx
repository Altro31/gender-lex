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
import { t } from "@lingui/core/macro"
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
	const { execute } = useAction(deleteModel)

	const handleDeleteModel = async () => {
		execute(model.id)
		onDelete?.()
	}

	return (
		<BaseAlertDialog trigger={children}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{t`Are you sure?`}</AlertDialogTitle>
					<AlertDialogDescription>
						{t`This action cannot be undone. \nThe model will be permanently eliminated`}
						<strong className="font-medium"> {model.name}</strong> .
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>{t`Cancel`}</AlertDialogCancel>
					<Button variant="destructive" asChild>
						<AlertDialogAction onClick={handleDeleteModel}>
							{t`Delete`}
						</AlertDialogAction>
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</BaseAlertDialog>
	)
}
