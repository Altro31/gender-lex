import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import PresetDetails from '@/sections/preset/details/preset-details'
import type { PresetsResponse } from '@/types/preset'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { t } from '@lingui/core/macro'

const detailsPresetDialog = DialogPrimitive.createHandle<DetailsPresetPayload>()

interface DetailsPresetPayload {
	preset: PresetsResponse[number]
}

export function DetailsPresetDialog() {
	return (
		<Dialog handle={detailsPresetDialog}>
			{({ payload }) => {
				if (!payload) return null
				const { preset } = payload
				return (
					<DialogContent className="max-w-none">
						<DialogHeader>
							<DialogTitle>{t`Preset Details`}</DialogTitle>
							<DialogDescription>
								{t`Complete information of the selected preset`}
							</DialogDescription>
						</DialogHeader>
						<ScrollArea className="max-h-[80vh] py-4 pr-4">
							<PresetDetails preset={preset} />
						</ScrollArea>
					</DialogContent>
				)
			}}
		</Dialog>
	)
}

export function DetailsPresetDialogTrigger(
	props: Omit<
		React.ComponentProps<typeof DialogTrigger>,
		'handle' | 'payload'
	> & { payload: DetailsPresetPayload },
) {
	return <DialogTrigger handle={detailsPresetDialog} {...props} />
}
