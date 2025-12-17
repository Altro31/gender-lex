'use client'

import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { type ComponentProps } from 'react'
import { useFormState } from 'react-hook-form'

export default function RHFSubmitButton({
	children,
	disabled,
	...props
}: ComponentProps<typeof Button>) {
	const { isSubmitting, isValid } = useFormState()
	return (
		<Button
			{...{ type: 'submit' }}
			disabled={isSubmitting || !isValid || disabled}
			{...props}
		>
			{isSubmitting && <Loader2 className="animate-spin" />}
			{children}
		</Button>
	)
}
