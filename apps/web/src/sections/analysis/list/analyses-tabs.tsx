'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatusCountResponse } from '@/types/analyses'
import { t } from '@lingui/core/macro'
import { debounce, parseAsStringEnum, useQueryState } from 'nuqs'
import { AnalysisStatus } from '@repo/db/models'

interface Props {
	statusCount: StatusCountResponse
}

export default function AnalysesTabs({ statusCount }: Props) {
	const [statusFilter, setStatusFilter] = useQueryState(
		'status',
		parseAsStringEnum([...Object.values(AnalysisStatus), ''])
			.withDefault('')
			.withOptions({ shallow: false, limitUrlUpdates: debounce(500) }),
	)

	const handleTab = (value: AnalysisStatus | '') => {
		setStatusFilter(value || null)
	}
	return (
		<Tabs
			value={statusFilter}
			onValueChange={handleTab as any}
			className="w-full"
		>
			<TabsList className="grid w-full grid-cols-5 lg:w-auto">
				<TabsTrigger value="">
					{t`All`} ({statusCount.all})
				</TabsTrigger>
				<TabsTrigger value="pending">
					{t`Pending`} ({statusCount.pending})
				</TabsTrigger>
				<TabsTrigger value="analyzing">
					{t`Analizing`} ({statusCount.analyzing})
				</TabsTrigger>
				<TabsTrigger value="done">
					{t`Done`} ({statusCount.done})
				</TabsTrigger>
				<TabsTrigger value="error">
					{t`Error`} ({statusCount.error})
				</TabsTrigger>
			</TabsList>
		</Tabs>
	)
}
