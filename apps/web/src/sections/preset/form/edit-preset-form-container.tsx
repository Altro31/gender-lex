'use client'

import { Form } from '@/components/ui/form'
import { PresetSchema } from '@/sections/preset/form/preset-schema'
import { editPreset } from '@/services/preset'
import type { PresetsResponse } from '@/types/preset'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useAction } from 'next-safe-action/hooks'
import { type PropsWithChildren } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface Props extends PropsWithChildren {
	preset: PresetsResponse[number]
	onSuccess?: () => void
}

export default function EditPresetFormContainer({
	preset,
	children,
	onSuccess,
}: Props) {
	const form = useForm({
		resolver: standardSchemaResolver(PresetSchema),
		defaultValues: {
			name: preset.name ?? '',
			description: preset.description ?? '',
			Models: preset.Models ?? [],
		},
		mode: 'onChange',
	})
	const doSthAction = useAction(editPreset, {
		onSuccess: () => {
			toast.success('Ok')
			onSuccess?.()
		},
		onError: ({ error }) => {
			console.log('error', error)
			toast.success('Error')
		},
	})
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(data =>
					doSthAction.executeAsync([preset.id, data]),
				)}
			>
				{children}
			</form>
		</Form>
	)
}
