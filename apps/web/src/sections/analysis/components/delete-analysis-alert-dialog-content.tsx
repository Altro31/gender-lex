'use client'

import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { deleteAnalysis } from '@/services/analysis'
import type { AnalysesResponseItem } from '@/types/analyses'
import { Trans, useLingui } from '@lingui/react/macro'
import { Loader2 } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import type { MouseEvent } from 'react'

interface Props {
    analysis: AnalysesResponseItem
}

export default function DeleteAnalysisAlertDialogContent({ analysis }: Props) {
    const { t } = useLingui()

    const { executeAsync, status: deleteStatus } = useAction(deleteAnalysis)
    const isDeleting = deleteStatus === 'executing'

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
                <AlertDialogTitle>{t`Are you shure?`}</AlertDialogTitle>
                <AlertDialogDescription>
                    <Trans>
                        This action cannot be undone. \nWill be permanently
                        eliminated the analysis
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
                    onClick={handleDeleteAnalysis}
                    className="bg-red-600 hover:bg-red-700"
                >
                    {isDeleting && <Loader2 className="animate-spin" />}
                    {isDeleting ? t`Deleting...` : t`Delete`}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    )
}
