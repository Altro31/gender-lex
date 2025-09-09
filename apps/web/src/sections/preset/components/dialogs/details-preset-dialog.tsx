import BaseDialog from "@/components/dialog/base-dialog"
import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import PresetDetails from "@/sections/preset/details/preset-details"
import type { PresetsResponse } from "@/types/preset"
import { useTranslations } from "next-intl"
import { type PropsWithChildren } from "react"

interface Props extends PropsWithChildren {
	preset: PresetsResponse[number]
}

export default function DetailsPresetDialog({ children, preset }: Props) {
	const t = useTranslations()
	return (
		<BaseDialog trigger={children}>
			<DialogContent className="max-w-none">
				<DialogHeader>
					<DialogTitle>{t("Preset.details.title")}</DialogTitle>
					<DialogDescription>
						{t("Preset.details.description-details")}
					</DialogDescription>
				</DialogHeader>
				<ScrollArea className="max-h-[80vh] py-4 pr-4">
					<PresetDetails preset={preset} />
				</ScrollArea>
			</DialogContent>
		</BaseDialog>
	)
}
