'use client'

import { Button } from '@/components/ui/button'
import CreatePresetDialog from '@/sections/preset/components/dialogs/create-preset-dialog'
import PresetListItem from '@/sections/preset/list/preset-list-item'
import type { PresetsResponse } from '@/types/preset'
import { t } from '@lingui/core/macro'
import { Plus, Zap } from 'lucide-react'
import { useQueryState } from 'nuqs'

interface Props {
	presets: PresetsResponse
}

export default function PresetsList({ presets }: Props) {
	const [q] = useQueryState('q')
	return presets.length === 0 ? (
		<div className="py-12 text-center">
			<div className="mb-4 text-gray-400">
				<Zap className="mx-auto h-16 w-16" />
			</div>
			<h3 className="mb-2 text-lg font-medium text-gray-900">
				{q ? t`No results found` : t`There are no presets configured`}
			</h3>
			<p className="mb-4 text-gray-600">
				{q
					? t`Try other search terms`
					: t`Start by creating your first preset`}
			</p>
			{!q && (
				<CreatePresetDialog>
					<Button>
						<Plus />
						{t`Create First Preset`}
					</Button>
				</CreatePresetDialog>
			)}
		</div>
	) : (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
			{presets.map(preset => (
				<PresetListItem key={preset.id} preset={preset} />
			))}
		</div>
	)
}
