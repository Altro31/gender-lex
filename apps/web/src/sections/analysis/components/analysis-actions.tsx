import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DeleteAnalysisAlertDialogContent from "@/sections/analysis/components/delete-analysis-alert-dialog-content"
import { redoAnalysis } from "@/services/analysis"
import type { AnalysesResponseItem } from "@/types/analyses"
import { Eye, RotateCcw, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { type PropsWithChildren } from "react"

interface Props extends PropsWithChildren {
	analysis: AnalysesResponseItem
}

export default function AnalysisActions({ analysis, children }: Props) {
	const t = useTranslations()
	const handleRedoAnalysis = (analysis: AnalysesResponseItem) => async () => {
		await redoAnalysis(analysis.id)
	}
	return (
		<AlertDialog>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<Link href={`/analysis/${analysis.id}`}>
							<Eye className="mr-2 h-4 w-4" />
							{t("Commons.details")}
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={handleRedoAnalysis(analysis)}>
						<RotateCcw className="mr-2 h-4 w-4" />
						{t("Analysis.redo.title")}
					</DropdownMenuItem>
					<DropdownMenuSeparator />

					<AlertDialogTrigger asChild>
						<DropdownMenuItem variant="destructive">
							<Trash2 className="mr-2 h-4 w-4" />
							{t("Actions.delete")}
						</DropdownMenuItem>
					</AlertDialogTrigger>
				</DropdownMenuContent>
			</DropdownMenu>
			<DeleteAnalysisAlertDialogContent analysis={analysis} />
		</AlertDialog>
	)
}
