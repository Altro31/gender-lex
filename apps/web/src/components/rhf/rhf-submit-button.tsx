"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { type ComponentProps, type PropsWithChildren } from "react"
import { useFormState } from "react-hook-form"

export default function RHFSubmitButton({
	children,
	disabled,
	...props
}: ComponentProps<typeof Button>) {
	const { isSubmitting, isValid } = useFormState()
	return (
		<Button {...props} disabled={isSubmitting || !isValid || disabled}>
			{isSubmitting && <Loader2 className="animate-spin" />}
			{children}
		</Button>
	)
}
