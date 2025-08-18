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
import { type PropsWithChildren } from "react"

interface Props extends PropsWithChildren {}

export default function CreateModelDialog({ children }: Props) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Crear Nuevo Modelo</DialogTitle>
					<DialogDescription>
						Configura una nueva conexión a un modelo de lenguaje
					</DialogDescription>
				</DialogHeader>
				<CreateModelFormContainer />
			</DialogContent>
		</Dialog>
	)
}
