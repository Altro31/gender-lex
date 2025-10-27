'use client'

import BaseAlertDialog from '@/components/dialog/base-alert-dialog'
import {
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { deletePreset } from '@/services/preset'
import type { PresetsResponse } from '@/types/preset'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { useAction } from 'next-safe-action/hooks'
import { type PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {
	preset: PresetsResponse[number]
	onDelete?: () => void
}

export default function DeletePresetAlertDialog({
	preset,
	children,
	onDelete,
}: Props) {
	const { execute } = useAction(deletePreset)

	const handleDeletePreset = () => {
		onDelete?.()
		execute(preset.id)
	}

	return (
		<BaseAlertDialog trigger={children}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{t`Are you sure?`}</AlertDialogTitle>
					<AlertDialogDescription>
						<Trans>
							This action cannot be undone. <br />
							The preset will be permanently deleted
							<strong className="font-medium">
								{' '}
								{preset.name}
							</strong>
						</Trans>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>{t`Cancel`}</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDeletePreset}
						className="bg-red-600 hover:bg-red-700"
					>
						{t`Delete`}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</BaseAlertDialog>
	)
}
