'use client'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import CreateModelFormContainer from '@/sections/model/form/create-model-form-container'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { t } from '@lingui/core/macro'

const createModelDialog = DialogPrimitive.createHandle()

export function CreateModelDialog() {
	const handleSucceed = () => createModelDialog.close()
	return (
		<Dialog handle={createModelDialog}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>{t`Create New Model`}</DialogTitle>
					<DialogDescription>
						{t`Set up a new connection to a language model`}
					</DialogDescription>
				</DialogHeader>
				<CreateModelFormContainer onSuccess={handleSucceed} />
			</DialogContent>
		</Dialog>
	)
}

export function CreateModelDialogTrigger(
	props: Omit<React.ComponentProps<typeof DialogTrigger>, 'handle'>,
) {
	return <DialogTrigger handle={createModelDialog} {...props} />
}
