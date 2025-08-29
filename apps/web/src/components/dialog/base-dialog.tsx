"use client"

import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
	useState,
	type MouseEvent,
	type PropsWithChildren,
	type ReactNode,
} from "react"

interface Props extends PropsWithChildren {
	trigger: ReactNode
}

export default function BaseDialog({ children, trigger }: Props) {
	const [open, setOpen] = useState(false)

	const handleOpen = (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation()
		setOpen(true)
	}
	return (
		<Dialog modal open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild onClickCapture={handleOpen}>
				{trigger}
			</DialogTrigger>
			{children}
		</Dialog>
	)
}
