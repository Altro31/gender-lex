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
import { t } from "@lingui/core/macro"
import { Trans } from "@lingui/react/macro"
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
					<AlertDialogTitle>{t`Are you sure?`}</AlertDialogTitle>
					<AlertDialogDescription>
						<Trans>
							A new preset will be created with the same name,
							description and model settings as:{" "}
							<strong className="font-medium">
								{preset.name}
							</strong>
						</Trans>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel ref={closeRef}>
						{t`Cancel`}
					</AlertDialogCancel>
					<AlertDialogAction onClick={handleClonePreset}>
						{t`Clone`}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</BaseAlertDialog>
	)
}
