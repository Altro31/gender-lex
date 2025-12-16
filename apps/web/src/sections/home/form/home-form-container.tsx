'use client'

import RHFSelectAutofetcher from '@/components/rhf/rhf-select-autofetcher'
import RHFTextarea from '@/components/rhf/rhf-textarea'
import { Button } from '@/components/ui/button'
import UploadButton from '@/sections/home/components/upload/upload-button'
import HomeFiles from '@/sections/home/form/home-files'
import FormSendButton from '@/sections/home/form/home-form-send-button'
import CreatePresetDialog from '@/sections/preset/components/dialogs/create-preset-dialog'
import { getPresetsSelect } from '@/services/preset'
import { t } from '@lingui/core/macro'
import { Plus } from 'lucide-react'

export default function HomeFormContainer() {
	return (
		<>
			<HomeFiles />
			<div className="bg-input/30 space-y-2 rounded-lg border">
				<RHFTextarea
					name="text"
					placeholder={t`Analyze a text...`}
					className="max-h-48 min-h-0 rounded-none border-none shadow-none focus-visible:ring-0 dark:bg-transparent"
					rows={1}
				/>
				<div className="bg-background flex justify-between rounded-lg p-2">
					<div className="flex gap-1">
						<UploadButton />
						<RHFSelectAutofetcher
							name="selectedPreset"
							fetcherFunc={getPresetsSelect}
							getKey={i => i.id}
							getLabel={i => i.name}
						>
							<CreatePresetDialog
								renderTrigger={
									<Button
										size="sm"
										variant="outline"
										className="mt-1 w-full"
									>
										<Plus />
										{t`New Preset`}
									</Button>
								}
							/>
						</RHFSelectAutofetcher>
					</div>
					<FormSendButton />
				</div>
			</div>
		</>
	)
}
