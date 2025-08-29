"use client"

import BaseDialog from "@/components/dialog/base-dialog"
import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import CreateModelFormContainer from "@/sections/model/form/create-model-form-container"
import { type PropsWithChildren } from "react"

interface Props extends PropsWithChildren {}

export default function CreateModelDialog({ children }: Props) {
	return (
		<BaseDialog trigger={children}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Crear Nuevo Modelo</DialogTitle>
					<DialogDescription>
						Configura una nueva conexión a un modelo de lenguaje
					</DialogDescription>
				</DialogHeader>
				<CreateModelFormContainer />
			</DialogContent>
		</BaseDialog>
	)
}
