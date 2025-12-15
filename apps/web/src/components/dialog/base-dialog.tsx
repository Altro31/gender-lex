'use client'

import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { DialogTriggerState, UseRenderRenderProp } from '@base-ui/react'
import {
	useState,
	type MouseEvent,
	type PropsWithChildren,
	type ReactNode,
} from 'react'

interface Props extends PropsWithChildren {
	renderTrigger: UseRenderRenderProp<DialogTriggerState>
}

export default function BaseDialog({ children, renderTrigger }: Props) {
	const [open, setOpen] = useState(false)

	const handleOpen = (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation()
		setOpen(true)
	}
	return (
		<Dialog modal open={open} onOpenChange={setOpen}>
			<DialogTrigger render={renderTrigger} onClickCapture={handleOpen} />
			{children}
		</Dialog>
	)
}
