import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { testConnection } from "@/services/model"
import { Button as ButtonPrimitive } from "@base-ui/react"

import { useAction } from "next-safe-action/hooks"
import { type MouseEvent, type MouseEventHandler } from "react"

type Props = {
	id: string
	onSuccess?: () => any
	onError?: () => any
	onExecute?: () => any
} & ButtonPrimitive.Props


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

	const handleTest: Props['onClick'] = (e) => {
		execute(id)
		onClick?.(e)
	}

	return (
		<Button
			variant="outline"
			size="sm"
			disabled={isPending}
			onClick={(e)=>{}}
			className={cn("text-sm", className)}
			{...props}
		>
			{children}
		</Button>
	)
}
