"use client"

import {
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteAnalysis } from "@/services/analysis"
import type { AnalysesResponseItem } from "@/types/analyses"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useAction } from "next-safe-action/hooks"
import type { MouseEvent } from "react"

interface Props {
	analysis: AnalysesResponseItem
}

export default function DeleteAnalysisAlertDialogContent({ analysis }: Props) {
	const t = useTranslations()
	const { executeAsync, status: deleteStatus } = useAction(deleteAnalysis)
	const isDeleting = deleteStatus === "executing"

	const handleDeleteAnalysis = async (e: MouseEvent<HTMLButtonElement>) => {
		if (!isDeleting) {
			e.preventDefault()
			await executeAsync(analysis.id)
			e.currentTarget?.click()
		}
	}

	return (
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>
					{t("Commons.are-you-shure")}
				</AlertDialogTitle>
				<AlertDialogDescription>
					{t("Analysis.delete.description.1")}
					<strong className="font-medium">
						{" "}
						{analysis.name}
					</strong>{" "}
					{t("Analysis.delete.description.2")}
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel>{t("Commons.cancel")}</AlertDialogCancel>
				<AlertDialogAction
					disabled={isDeleting}
					onClick={handleDeleteAnalysis}
					className="bg-red-600 hover:bg-red-700"
				>
					{isDeleting && <Loader2 className="animate-spin" />}
					{isDeleting ? t("Actions.deleting") : t("Actions.delete")}
				</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	)
}
