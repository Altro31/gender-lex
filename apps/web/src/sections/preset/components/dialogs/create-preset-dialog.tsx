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

export default function CreatePresetDialog({ children }: Props) {
	return (
		<BaseDialog trigger={children}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Crear Nuevo Preset</DialogTitle>
					<DialogDescription>
						Configura una nueva combinación de modelos con
						parámetros específicos
					</DialogDescription>
				</DialogHeader>
				<CreateModelFormContainer />
			</DialogContent>
		</BaseDialog>
	)
}
