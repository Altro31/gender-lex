'use client'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { deletePreset } from '@/services/preset'
import type { PresetsResponse } from '@/types/preset'
import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'

interface DeletePresetPayload {
	preset: PresetsResponse[number]
	onDelete?: () => void
}

const deletePresetAlertDialog =
	AlertDialogPrimitive.createHandle<DeletePresetPayload>()

export function DeletePresetAlertDialog() {
	const { executeAsync } = useAction(deletePreset)

	const handleDeletePreset = (payload: DeletePresetPayload) => async () => {
		payload.onDelete?.()
		const promise = executeAsync(payload.preset.id)
		toast.promise(promise, {
			success: res => 'Éxito',
			error: (error: Error) => 'Error',
		})
		deletePresetAlertDialog.close()
	}

	return (
		<AlertDialog handle={deletePresetAlertDialog}>
			{({ payload }) => {
				if (!payload) return null
				const { preset } = payload
				return (
					<>
						<AlertDialogOverlay />
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
									onClick={handleDeletePreset(payload)}
									className="bg-red-600 hover:bg-red-700"
								>
									{t`Delete`}
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</>
				)
			}}
		</AlertDialog>
	)
}

export function DeletePresetAlertDialogTrigger(
	props: Omit<
		React.ComponentProps<typeof AlertDialogTrigger>,
		'handle' | 'payload'
	> & { payload: DeletePresetPayload },
) {
	return <AlertDialogTrigger handle={deletePresetAlertDialog} {...props} />
}
