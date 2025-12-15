'use client'

import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { UseRenderRenderProp, DialogTriggerState } from '@base-ui/react'
import {
	useState,
	type MouseEvent,
	type PropsWithChildren,
	type ReactNode,
} from 'react'

interface Props extends PropsWithChildren {
	renderTrigger: UseRenderRenderProp<DialogTriggerState>
}

export default function BaseAlertDialog({ children, renderTrigger }: Props) {
	const [open, setOpen] = useState(false)

	const handleOpen = (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation()
		setOpen(true)
	}

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger
				render={renderTrigger}
				onClickCapture={handleOpen}
			/>
			{children}
		</AlertDialog>
	)
}
