import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { testConnection } from '@/services/model'
import { ButtonProps } from '@base-ui/react'
import { t } from '@lingui/core/macro'
import { useAction } from 'next-safe-action/hooks'

type Props = ButtonProps & {
	id: string
	onSuccess?: () => any
	onError?: () => any
	onExecute?: () => any
}

export default function TestConnectionButton({
	id,
	onError,
	onExecute,
	onSuccess,
	onClick,
	className,
	children = t`Test Connection`,
	...props
}: Props) {
	const { execute, isPending } = useAction(testConnection, {
		onSuccess,
		onError,
		onExecute,
	})

	const handleTest = (e: any) => {
		execute(id)
		onClick?.(e)
	}

	return (
		<Button
			variant="outline"
			size="sm"
			disabled={isPending}
			onClick={handleTest}
			className={cn('text-sm', className)}
			{...props}
		>
			{children}
		</Button>
	)
}
