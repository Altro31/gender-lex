import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import type { SafeActionFn } from "next-safe-action"
import { useAction } from "next-safe-action/hooks"
import {
	Fragment,
	type MouseEvent,
	type PropsWithChildren,
	type ReactNode,
} from "react"
import type z from "zod"

interface Args {
	actionFn: SafeActionFn<any, z.ZodString, any, any, any>
}

export interface DeleteAlertDialogProps extends PropsWithChildren {
	analysis: { id: string }
	description: ReactNode
	omitRoot?: boolean
}

export function deleteAlertDialogFactory({ actionFn }: Args) {
	return ({
		analysis: item,
		children,
		description,
		omitRoot = false,
	}: DeleteAlertDialogProps) => {
		const t = useTranslations()
		const { executeAsync, status: deleteStatus } = useAction(actionFn)
		const isDeleting = deleteStatus === "executing"

		const handleDeleteAnalysis = async (
			e: MouseEvent<HTMLButtonElement>,
		) => {
			if (!isDeleting) {
				e.preventDefault()
				await executeAsync(item.id)
				e.currentTarget.click()
			}
		}

		const Root = omitRoot ? Fragment : AlertDialog

		return (
			<Root>
				<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{t("Commons.are-you-shure")}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{description}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>
							{t("Commons.cancel")}
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteAnalysis}
							className="bg-red-600 hover:bg-red-700"
						>
							{isDeleting && <Loader2 className="animate-spin" />}
							{isDeleting
								? t("Actions.deleting")
								: t("Actions.delete")}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</Root>
		)
	}
}
