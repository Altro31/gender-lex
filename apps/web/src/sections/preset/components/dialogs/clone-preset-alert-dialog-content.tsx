"use client"

import BaseAlertDialog from "@/components/dialog/base-alert-dialog"
import {
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { clonePreset } from "@/services/preset"
import type { PresetsResponse } from "@/types/preset"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useAction } from "next-safe-action/hooks"
import { useRef, type MouseEvent, type PropsWithChildren } from "react"

interface Props extends PropsWithChildren {
	preset: PresetsResponse[number]
	onClone?: () => void
}

export default function ClonePresetAlertDialog({
	preset,
	children,
	onClone,
}: Props) {
	const closeRef = useRef<HTMLButtonElement>(null)
	const t = useTranslations()

	const { execute } = useAction(clonePreset, {
		onError(args) {
			console.log(args)
		},
	})

	const handleClonePreset = async (e: MouseEvent<HTMLButtonElement>) => {
		onClone?.()
		execute(preset.id)
	}

	return (
		<BaseAlertDialog trigger={children}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{t("Commons.are-you-shure")}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{t("Preset.clone.description.1")}
						<strong className="font-medium">
							{" "}
							{preset.name}
						</strong>{" "}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel ref={closeRef}>
						{t("Commons.cancel")}
					</AlertDialogCancel>
					<AlertDialogAction onClick={handleClonePreset}>
						{t("Actions.clone")}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</BaseAlertDialog>
	)
}
