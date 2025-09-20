"use client"

import BaseDialog from "@/components/dialog/base-dialog"
import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import CreateModelFormContainer from "@/sections/model/form/create-model-form-container"
import { useTranslations } from "next-intl"
import { type PropsWithChildren } from "react"

interface Props extends PropsWithChildren {}

export default function CreateModelDialog({ children }: Props) {
	const t = useTranslations()
	return (
		<BaseDialog trigger={children}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>{t("Model.create.title")}</DialogTitle>
					<DialogDescription>
						{t("Model.create.description")}
					</DialogDescription>
				</DialogHeader>
				<CreateModelFormContainer />
			</DialogContent>
		</BaseDialog>
	)
}
