"use client"

import BaseDialog from "@/components/dialog/base-dialog"
import DialogScrollArea from "@/components/dialog/dialog-scroll-area"
import RHFSubmitButton from "@/components/rhf/rhf-submit-button"
import { Button } from "@/components/ui/button"
import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import CreatePresetFormContainer from "@/sections/preset/form/create-preset-form-container"
import { PresetForm } from "@/sections/preset/form/preset-form"
import { useTranslations } from "next-intl"
import { type PropsWithChildren, useRef } from "react"

interface Props extends PropsWithChildren {}

export default function CreatePresetDialog({ children }: Props) {
	const t = useTranslations()
	const ref = useRef<HTMLButtonElement>(null)
	const handleSucceed = () => ref.current?.click()

	return (
		<BaseDialog trigger={children}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>{t("Preset.create.title")}</DialogTitle>
					<DialogDescription>
						{t("Preset.create.description")}
					</DialogDescription>
				</DialogHeader>

				<CreatePresetFormContainer onSuccess={handleSucceed}>
					<DialogScrollArea>
						<PresetForm />
					</DialogScrollArea>
					<DialogFooter>
						<DialogClose asChild ref={ref}>
							<Button variant="secondary">
								{t("Commons.cancel")}
							</Button>
						</DialogClose>
						<RHFSubmitButton>{t("Actions.create")}</RHFSubmitButton>
					</DialogFooter>
				</CreatePresetFormContainer>
			</DialogContent>
		</BaseDialog>
	)
}
