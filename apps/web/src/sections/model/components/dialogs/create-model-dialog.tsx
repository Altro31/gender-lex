'use client'

import BaseDialog from '@/components/dialog/base-dialog'
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import CreateModelFormContainer from '@/sections/model/form/create-model-form-container'
import { t } from '@lingui/core/macro'
import { type PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {}

export default function CreateModelDialog({ children }: Props) {
	return (
		<BaseDialog trigger={children}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>{t`Create New Model`}</DialogTitle>
					<DialogDescription>
						{t`Set up a new connection to a language model`}
					</DialogDescription>
				</DialogHeader>
				<CreateModelFormContainer />
			</DialogContent>
		</BaseDialog>
	)
}
