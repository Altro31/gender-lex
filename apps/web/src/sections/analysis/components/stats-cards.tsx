import { cn } from '@/lib/utils'
import { getStatusCount } from '@/services/analysis'
import type { StatusCountResponse } from '@/types/analyses'
import { t } from '@lingui/core/macro'
import { Suspense } from 'react'

export default function StatsCards() {
	return (
		<ul className="grid grid-cols-2 gap-2 md:grid-cols-5">
			<Suspense fallback={<Fallback />}>
				<Container />
			</Suspense>
		</ul>
	)
}

async function Container() {
	const statusCountResponse = await getStatusCount()
	if (statusCountResponse.error)
		throw new Error('No se pudieron contar los análisis')
	return <View statusCount={statusCountResponse} />
}

interface ViewProps {
	statusCount: StatusCountResponse
}
function View({ statusCount }: ViewProps) {
	const statusMapper = {
		all: { label: t`All`, color: 'text-gray-900' },
		analyzing: { label: t`Analizing`, color: 'text-blue-600' },
		done: { label: t`Done`, color: 'text-green-600' },
		error: { label: t`Error`, color: 'text-red-600' },
		pending: { label: t`Pending`, color: 'text-gray-600' },
	} as const satisfies Record<
		keyof StatusCountResponse,
		{ label: string; color: `text-${string}-${number}00` }
	>

	return Object.entries(statusMapper).map(([key, { label, color }]) => (
		<li
			key={key}
			className="flex justify-center gap-2 rounded-lg border p-2 text-sm"
		>
			<div className="text-gray-600">{label}:</div>
			<div className={cn('font-bold', color)}>
				{statusCount[key as keyof StatusCountResponse]}
			</div>
		</li>
	))
}

function Fallback() {
	return null
}
