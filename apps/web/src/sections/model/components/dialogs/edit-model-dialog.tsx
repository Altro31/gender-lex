'use client'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import EditModelFormContainer from '@/sections/model/form/edit-model-form-container'
import type { ModelsResponseItem } from '@/types/model'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { t } from '@lingui/core/macro'

interface EditModelPayload {
	model: ModelsResponseItem
}

const editModelDialog = DialogPrimitive.createHandle<EditModelPayload>()

export function EditModelDialog() {
	const handleSucceed = () => editModelDialog.close()
	return (
		<Dialog handle={editModelDialog}>
			{({ payload }) => {
				if (!payload) return null
				const { model } = payload
				return (
					<DialogContent className="max-w-2xl">
						<DialogHeader>
							<DialogTitle>{t`Edit Model: ${model.name}`}</DialogTitle>
							<DialogDescription>
								{t`Edit the connection of model: ${model.name}`}
							</DialogDescription>
						</DialogHeader>
						<EditModelFormContainer
							model={model}
							onSuccess={handleSucceed}
						/>
					</DialogContent>
				)
			}}
		</Dialog>
	)
}

export function EditModelDialogTrigger(
	props: Omit<
		React.ComponentProps<typeof DialogTrigger>,
		'handle' | ('payload' & { payload: EditModelPayload })
	>,
) {
	return <DialogTrigger handle={editModelDialog} {...props} />
}
