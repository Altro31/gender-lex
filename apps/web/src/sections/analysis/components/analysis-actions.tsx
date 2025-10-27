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
import { t } from "@lingui/core/macro"
import { Eye, RotateCcw, Trash2 } from "lucide-react"
import Link from "next/link"
import { type PropsWithChildren } from "react"

interface Props extends PropsWithChildren {
	analysis: AnalysesResponseItem
}

export default function AnalysisActions({ analysis, children }: Props) {
	const handleRedoAnalysis = (analysis: AnalysesResponseItem) => async () => {
		await redoAnalysis(analysis.id)
	}
	return (
		<AlertDialog>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem asChild>
						<Link href={`/analysis/${analysis.id}`}>
							<Eye className="mr-2 h-4 w-4" />
							{t`Details`}
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={handleRedoAnalysis(analysis)}>
						<RotateCcw className="mr-2 h-4 w-4" />
						{t`Redo Analysis`}
					</DropdownMenuItem>
					<DropdownMenuSeparator />

					<AlertDialogTrigger asChild>
						<DropdownMenuItem variant="destructive">
							<Trash2 className="mr-2 h-4 w-4" />
							{t`Delete`}
						</DropdownMenuItem>
					</AlertDialogTrigger>
				</DropdownMenuContent>
			</DropdownMenu>
			<DeleteAnalysisAlertDialogContent analysis={analysis} />
		</AlertDialog>
	)
}
