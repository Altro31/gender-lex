'use client'

import DialogScrollArea from '@/components/dialog/dialog-scroll-area'
import RHFSubmitButton from '@/components/rhf/rhf-submit-button'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import CreatePresetFormContainer from '@/sections/preset/form/create-preset-form-container'
import { PresetForm } from '@/sections/preset/form/preset-form'
import { DialogTriggerState, UseRenderRenderProp } from '@base-ui/react'
import { t } from '@lingui/core/macro'
import { useRef } from 'react'

interface Props {
	renderTrigger: UseRenderRenderProp<DialogTriggerState>
}

const createPresetDialog = DialogPrimitive.createHandle()

export default function CreatePresetDialog({ renderTrigger }: Props) {
	const ref = useRef<HTMLButtonElement>(null)
	const handleSucceed = () => ref.current?.click()

	return (
		<Dialog>
			<DialogTrigger render={renderTrigger} />
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>{t`Create New Preset`}</DialogTitle>
					<DialogDescription>
						{t`Set up a new combination of models with specific parameters`}
					</DialogDescription>
				</DialogHeader>

				<CreatePresetFormContainer onSuccess={handleSucceed}>
					<DialogScrollArea>
						<PresetForm />
					</DialogScrollArea>
					<DialogFooter>
						<DialogClose render={<Button variant="secondary" />}>
							{t`Cancel`}
						</DialogClose>
						<RHFSubmitButton>{t`Create`}</RHFSubmitButton>
					</DialogFooter>
				</CreatePresetFormContainer>
			</DialogContent>
		</Dialog>
	)
}
