"use client"

import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import {
	useState,
	type MouseEvent,
	type PropsWithChildren,
	type ReactNode,
} from "react"

interface Props extends PropsWithChildren {
	trigger: ReactNode
}

export default function BaseAlertDialog({ children, trigger }: Props) {
	const [open, setOpen] = useState(false)

	const handleOpen = (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation()
		setOpen(true)
	}
	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild onClickCapture={handleOpen}>
				{trigger}
			</AlertDialogTrigger>
			{children}
		</AlertDialog>
	)
}
