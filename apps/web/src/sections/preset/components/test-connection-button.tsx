import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { testConnection } from "@/services/model"
import { useAction } from "next-safe-action/hooks"
import { type ComponentProps, type MouseEvent } from "react"

interface Props extends ComponentProps<typeof Button> {
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
	children,
	...props
}: Props) {

	const { execute, isPending } = useAction(testConnection, {
		onSuccess,
		onError,
		onExecute,
	})

	const handleTest = (e: MouseEvent<HTMLButtonElement>) => {
		execute(id)
		onClick?.(e)
	}

	return (
		<Button
			variant="outline"
			size="sm"
			disabled={isPending}
			onClick={handleTest}
			className={cn("text-sm", className)}
			{...props}
		>
			{children}
		</Button>
	)
}
