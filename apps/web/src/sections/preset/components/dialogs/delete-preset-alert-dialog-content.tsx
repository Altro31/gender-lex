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
import { DialogTriggerState, UseRenderRenderProp } from '@base-ui/react'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { useAction } from 'next-safe-action/hooks'
import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Loader, Trash2 } from 'lucide-react'
import { tryCatch } from '@/lib/utils'
import { toast } from 'sonner'

interface Props {
	preset: PresetsResponse[number]
	onDelete?: () => void
}

const deletePresetAlertDialog = AlertDialogPrimitive.createHandle()

export function DeletePresetAlertDialog({ preset, onDelete }: Props) {
	const { executeAsync } = useAction(deletePreset)

	const handleDeletePreset = async () => {
		onDelete?.()
		const promise = executeAsync(preset.id)
		toast.promise(promise, {
			success: res => 'Éxito',
			error: (error: Error) => 'Error',
		})
		deletePresetAlertDialog.close()
	}

	return (
		<AlertDialog handle={deletePresetAlertDialog}>
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
						onClick={handleDeletePreset}
						className="bg-red-600 hover:bg-red-700"
					>
						{t`Delete`}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export function DeletePresetAlertDialogTrigger(
	props: Omit<React.ComponentProps<typeof AlertDialogTrigger>, 'handle'>,
) {
	return <AlertDialogTrigger handle={deletePresetAlertDialog} {...props} />
}
