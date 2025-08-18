import type { AnalysesResponseItem } from "@/types/analyses"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { type PropsWithChildren } from "react"
import Link from "next/link"
import { Eye, RotateCcw, Trash2 } from "lucide-react"
import DeleteAnalysisAlertDialogContent from "@/sections/analysis/components/delete-analysis-alert-dialog-content"
import { redoAnalysis } from "@/services/analysis"
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"

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
					<DropdownMenuLabel>Acciones</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<Link href={`/analysis/${analysis.id}`}>
							<Eye className="mr-2 h-4 w-4" />
							Ver Detalles
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={handleRedoAnalysis(analysis)}>
						<RotateCcw className="mr-2 h-4 w-4" />
						Rehacer Análisis
					</DropdownMenuItem>
					<DropdownMenuSeparator />

					<AlertDialogTrigger asChild>
						<DropdownMenuItem variant="destructive">
							<Trash2 className="mr-2 h-4 w-4" />
							Eliminar
						</DropdownMenuItem>
					</AlertDialogTrigger>
				</DropdownMenuContent>
			</DropdownMenu>
			<DeleteAnalysisAlertDialogContent analysis={analysis} />
		</AlertDialog>
	)
}
