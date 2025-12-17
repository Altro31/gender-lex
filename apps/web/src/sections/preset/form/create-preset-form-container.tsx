'use client'

import { Form } from '@/components/ui/form'
import { PresetSchema } from '@/sections/preset/form/preset-schema'
import { createPreset } from '@/services/preset'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useQueryClient } from '@tanstack/react-query'
import { useAction } from 'next-safe-action/hooks'
import { type PropsWithChildren } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface Props extends PropsWithChildren {
	onSuccess?: () => void
}

export default function CreatePresetFormContainer({
	onSuccess,
	children,
}: Props) {
	const queryClient = useQueryClient()
	const form = useForm({
		resolver: standardSchemaResolver(PresetSchema),
		defaultValues: { name: '', description: '', Models: [] },
		mode: 'onChange',
	})
	const doSthAction = useAction(createPreset, {
		onSuccess: () => {
			toast.success('Ok')
			onSuccess?.()
			console.log('Hola')

			queryClient.invalidateQueries({ queryKey: ['selectedPreset'] })
		},
		onError: ({ error }) => {
			console.log('error', error)
			toast.success('Error')
		},
	})

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(doSthAction.executeAsync)}>
				{children}
			</form>
		</Form>
	)
}
