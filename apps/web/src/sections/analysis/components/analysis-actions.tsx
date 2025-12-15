'use client'

import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import DeleteAnalysisAlertDialogContent from '@/sections/analysis/components/delete-analysis-alert-dialog-content'
import { redoAnalysis } from '@/services/analysis'
import type { AnalysesResponseItem } from '@/types/analyses'
import { UseRenderRenderProp } from '@base-ui/react'
import { useRouter } from '@bprogress/next/app'
import { t } from '@lingui/core/macro'
import { Eye, RotateCcw, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { type PropsWithChildren } from 'react'
import { toast } from 'sonner'

interface Props extends PropsWithChildren {
	analysis: AnalysesResponseItem
	renderTrigger: UseRenderRenderProp
}

export default function AnalysisActions({ analysis, renderTrigger }: Props) {
	const router = useRouter()
	const handleRedoAnalysis = (analysis: AnalysesResponseItem) => async () => {
		const { error, data } = await redoAnalysis(analysis.id)
		if (error) {
			toast.error(error.value.message)
			return
		}
		router.push(`/analysis/${data.id}`)
	}

	return (
		<AlertDialog>
			<DropdownMenu>
				<DropdownMenuTrigger render={renderTrigger} />
				<DropdownMenuContent align="end">
					<DropdownMenuItem
						render={<Link href={`/analysis/${analysis.id}`} />}
					>
						<Eye className="mr-2 h-4 w-4" />
						{t`Details`}
					</DropdownMenuItem>
					<DropdownMenuItem onClick={handleRedoAnalysis(analysis)}>
						<RotateCcw className="mr-2 h-4 w-4" />
						{t`Redo Analysis`}
					</DropdownMenuItem>
					<DropdownMenuSeparator />

					<AlertDialogTrigger
						render={<DropdownMenuItem variant="destructive" />}
					>
						<Trash2 className="mr-2 h-4 w-4" />
						{t`Delete`}
					</AlertDialogTrigger>
				</DropdownMenuContent>
			</DropdownMenu>
			<DeleteAnalysisAlertDialogContent analysis={analysis} />
		</AlertDialog>
	)
}
