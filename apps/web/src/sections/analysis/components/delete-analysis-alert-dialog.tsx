"use client"

import {
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	AlertDialogPortal,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { deleteAnalysis } from "@/services/analysis"
import { useTranslations } from "next-intl"

interface Props {
	model: any
}

export default function DeleteAnalysisAlertDialog({ model }: Props) {
	const t = useTranslations()

	return (
		<AlertDialogPortal>
			<AlertDialogOverlay />
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{t("Analysis.delete.title")}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{t("Analysis.delete.quest")}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>{t("Commons.cancel")}</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button
							variant="destructive"
							onClick={() => deleteAnalysis("")}
						>
							{t("Actions.delete")}
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialogPortal>
	)
}
