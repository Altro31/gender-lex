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
import { t } from "@lingui/core/macro"
import { type PropsWithChildren } from "react"

interface Props extends PropsWithChildren {
	model: ModelsResponseItem
}

export default function DetailsModelDialog({ children, model }: Props) {
	return (
		<BaseDialog trigger={children}>
			<DialogContent className="max-w-none">
				<DialogHeader>
					<DialogTitle>
						{t`Details of model: ${model.name}`}
					</DialogTitle>
					<DialogDescription>
						{t`Complete information of the model: ${model.name}`}
					</DialogDescription>
				</DialogHeader>
				<ScrollArea className="max-h-[80vh] py-4 pr-4">
					<ModelDetails model={model} />
				</ScrollArea>
			</DialogContent>
		</BaseDialog>
	)
}
