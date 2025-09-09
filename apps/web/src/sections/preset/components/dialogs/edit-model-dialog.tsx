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
import EditPresetFormContainer from "@/sections/preset/form/edit-preset-form-container"
import { PresetForm } from "@/sections/preset/form/preset-form"
import type { PresetsResponse } from "@/types/preset"
import { useTranslations } from "next-intl"
import { type PropsWithChildren, useRef } from "react"

interface Props extends PropsWithChildren {
	preset: PresetsResponse[number]
}

export default function EditpresetDialog({ children, preset }: Props) {
	const t = useTranslations()
	const ref = useRef<HTMLButtonElement>(null)
	const handleSucceed = () => ref.current?.click()
	return (
		<BaseDialog trigger={children}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>{t("Preset.edit.title")}</DialogTitle>
					<DialogDescription>
						{t("Preset.edit.description")}
					</DialogDescription>
				</DialogHeader>
				<EditPresetFormContainer
					preset={preset}
					onSuccess={handleSucceed}
				>
					<DialogScrollArea>
						<PresetForm />
					</DialogScrollArea>
					<DialogFooter>
						<DialogClose asChild ref={ref}>
							<Button variant="secondary">
								{t("Commons.cancel")}
							</Button>
						</DialogClose>
						<RHFSubmitButton>{t("Actions.update")}</RHFSubmitButton>
					</DialogFooter>
				</EditPresetFormContainer>
			</DialogContent>
		</BaseDialog>
	)
}
