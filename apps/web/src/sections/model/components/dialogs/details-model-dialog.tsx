"use client"

import BaseDialog from "@/components/dialog/base-dialog"
import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import ModelDetails from "@/sections/model/details/model-details"
import type { ModelsResponseItem } from "@/types/model"
import { type PropsWithChildren } from "react"

interface Props extends PropsWithChildren {
	model: ModelsResponseItem
}

export default function DetailsModelDialog({ children, model }: Props) {
	return (
		<BaseDialog trigger={children}>
			<DialogContent className="max-w-none">
				<DialogHeader>
					<DialogTitle>Detalles del Modelo</DialogTitle>
					<DialogDescription>
						Información completa del modelo seleccionado
					</DialogDescription>
				</DialogHeader>
				<ScrollArea className="max-h-[80vh] pr-4 py-4">
					<ModelDetails model={model} />
				</ScrollArea>
			</DialogContent>
		</BaseDialog>
	)
}
