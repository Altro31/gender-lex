"use client"

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import CreateModelFormContainer from "@/sections/model/form/create-model-form-container"
import EditModelFormContainer from "@/sections/model/form/edit-model-form-container"
import type { ModelsResponseItem } from "@/types/model"
import { useState, type MouseEvent, type PropsWithChildren } from "react"

interface Props extends PropsWithChildren {
	model: ModelsResponseItem
}

export default function EditModelDialog({ children, model }: Props) {
	const [open, setOpen] = useState(false)

	const handleOpen = (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation()
		setOpen(true)
	}
	return (
		<Dialog modal open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild onClickCapture={handleOpen}>
				{children}
			</DialogTrigger>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Crear Nuevo Modelo</DialogTitle>
					<DialogDescription>
						Configura una nueva conexión a un modelo de lenguaje
					</DialogDescription>
				</DialogHeader>
				<EditModelFormContainer model={model} />
			</DialogContent>
		</Dialog>
	)
}
