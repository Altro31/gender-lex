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
import type { PresetsResponseItem } from "@/types/preset"
import { type PropsWithChildren } from "react"

interface Props extends PropsWithChildren {
	preset: PresetsResponseItem
}

export default function DetailsPresetDialog({ children, preset }: Props) {
	return (
		<BaseDialog trigger={children}>
			<DialogContent className="max-w-none">
				<DialogHeader>
					<DialogTitle>Detalles del Preset</DialogTitle>
					<DialogDescription>
						Información completa del preset seleccionado
					</DialogDescription>
				</DialogHeader>
				<ScrollArea className="max-h-[80vh] py-4 pr-4">
					<ModelDetails model={preset} />
				</ScrollArea>
			</DialogContent>
		</BaseDialog>
	)
}
