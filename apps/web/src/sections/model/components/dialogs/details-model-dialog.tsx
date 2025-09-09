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
import { useTranslations } from "next-intl"
import { type PropsWithChildren } from "react"

interface Props extends PropsWithChildren {
	model: ModelsResponseItem
}

export default function DetailsModelDialog({ children, model }: Props) {
	const t = useTranslations()
	return (
		<BaseDialog trigger={children}>
			<DialogContent className="max-w-none">
				<DialogHeader>
					<DialogTitle>{t("Model.details.title")}</DialogTitle>
					<DialogDescription>
						{t("Model.details.description")}
					</DialogDescription>
				</DialogHeader>
				<ScrollArea className="max-h-[80vh] py-4 pr-4">
					<ModelDetails model={model} />
				</ScrollArea>
			</DialogContent>
		</BaseDialog>
	)
}
