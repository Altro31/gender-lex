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
import CreatePresetFormContainer from '@/sections/preset/form/create-preset-form-container'
import { PresetForm } from '@/sections/preset/form/preset-form'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { t } from '@lingui/core/macro'

const createPresetDialog = DialogPrimitive.createHandle()

export function CreatePresetDialog() {
	const handleSucceed = () => createPresetDialog.close()

	return (
		<Dialog handle={createPresetDialog}>
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

export function CreatePresetDialogTrigger(
	props: Omit<React.ComponentProps<typeof DialogTrigger>, 'handle'>,
) {
	return <DialogTrigger handle={createPresetDialog} {...props} />
}
