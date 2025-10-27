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
import { t } from "@lingui/core/macro"
import { type PropsWithChildren, useRef } from "react"

interface Props extends PropsWithChildren {
	preset: PresetsResponse[number]
}

export default function EditPresetDialog({ children, preset }: Props) {
	const ref = useRef<HTMLButtonElement>(null)
	const handleSucceed = () => ref.current?.click()
	return (
		<BaseDialog trigger={children}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>{t`Edit preset: ${preset.name}`}</DialogTitle>
					<DialogDescription>
						{t`Edit the information of preset: ${preset.name}`}
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
							<Button variant="secondary">{t`Cancel`}</Button>
						</DialogClose>
						<RHFSubmitButton>{t`Update`}</RHFSubmitButton>
					</DialogFooter>
				</EditPresetFormContainer>
			</DialogContent>
		</BaseDialog>
	)
}
