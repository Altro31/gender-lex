'use client'

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
} from '@/components/ui/alert-dialog'
import { deleteAnalysis } from '@/services/analysis'
import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { Analysis } from '@repo/db/models'
import { Loader2 } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'

interface DeleteAnalysisPayload {
	analysis: Analysis
}

const deleteAnalysisAlertDialog =
	AlertDialogPrimitive.createHandle<DeleteAnalysisPayload>()

export function DeleteAnalysisAlertDialog() {
	const { executeAsync, status: deleteStatus } = useAction(deleteAnalysis)
	const isDeleting = deleteStatus === 'executing'

	const handleDeleteAnalysis = (id: string) => async () => {
		if (!isDeleting) {
			await executeAsync(id)
			deleteAnalysisAlertDialog.close()
		}
	}

	return (
		<AlertDialog handle={deleteAnalysisAlertDialog}>
			{({ payload }) => {
				if (!payload) return null
				const { analysis } = payload
				return (
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>{t`Are you sure?`}</AlertDialogTitle>
							<AlertDialogDescription>
								<Trans>
									This action cannot be undone. <br />
									Will be permanently eliminated the analysis
									<strong className="font-medium">
										{' '}
										{analysis.name}
									</strong>{' '}
									and all its results.
								</Trans>
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>{t`Cancel`}</AlertDialogCancel>
							<AlertDialogAction
								disabled={isDeleting}
								variant="destructive"
								onClick={handleDeleteAnalysis(analysis.id)}
							>
								{isDeleting && (
									<Loader2 className="animate-spin" />
								)}
								{isDeleting ? t`Deleting...` : t`Delete`}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				)
			}}
		</AlertDialog>
	)
}

export function DeleteAnalysisAlertDialogTrigger(
	props: Omit<
		React.ComponentProps<typeof AlertDialogTrigger>,
		'handle' | 'payload'
	> & { payload: DeleteAnalysisPayload },
) {
	return <AlertDialogTrigger handle={deleteAnalysisAlertDialog} {...props} />
}
