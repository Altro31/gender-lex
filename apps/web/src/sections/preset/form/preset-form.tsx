'use client'
import RHFInput from '@/components/rhf/rhf-input'
import RHFTextarea from '@/components/rhf/rhf-textarea'
import RHFModelSelectContainer from '@/sections/preset/components/model-select/rhf-model-select-container'
import { t } from '@lingui/core/macro'

export function PresetForm() {
	return (
		<div className="space-y-2 p-2">
			<RHFInput
				name="name"
				label={t`Preset Name`}
				required
				placeholder={t`e.g.: Creative Analysis`}
			/>

			<RHFTextarea
				name="description"
				label={t`Description`}
				placeholder={t`Describe the purpose and use of this preset...`}
				rows={3}
			/>
			<RHFModelSelectContainer />
		</div>
	)
}
