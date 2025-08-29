"use client"

import BaseDialog from "@/components/dialog/base-dialog"
import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import EditModelFormContainer from "@/sections/model/form/edit-model-form-container"
import type { ModelsResponseItem } from "@/types/model"
import { type PropsWithChildren } from "react"

interface Props extends PropsWithChildren {
	model: ModelsResponseItem
}

export default function EditModelDialog({ children, model }: Props) {
	return (
		<BaseDialog trigger={children}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Editar Modelo</DialogTitle>
					<DialogDescription>
						Edita la conexión de un modelo de lenguaje
					</DialogDescription>
				</DialogHeader>
				<EditModelFormContainer model={model} />
			</DialogContent>
		</BaseDialog>
	)
}
