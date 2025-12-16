'use client'

import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { DialogTriggerState, UseRenderRenderProp } from '@base-ui/react'
import { Dialog } from '../ui/dialog'

interface Props extends React.ComponentProps<typeof Dialog> {
	renderTrigger: UseRenderRenderProp<DialogTriggerState>
}

export default function BaseAlertDialog({
	children,
	renderTrigger,
	...props
}: Props) {
	return (
		<AlertDialog {...props}>
			<AlertDialogTrigger nativeButton={false} render={renderTrigger} />
			{children as any}
		</AlertDialog>
	)
}
