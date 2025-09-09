import { Button } from "@/components/ui/button"
import { useSse } from "@/lib/sse"
import { cn } from "@/lib/utils"
import { testConnection } from "@/services/model"
import { useAction } from "next-safe-action/hooks"
import { type ComponentProps, type MouseEvent } from "react"
import { toast } from "sonner"

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
	children = "Test Connection",
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

	useSse("model.status.change", (event) => {
		if (event.id === id && event.status === "error") {
			toast.error(event.message)
		}
	})

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
