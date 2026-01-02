'use client'

import { t } from '@lingui/core/macro'
import { AlertTriangle } from 'lucide-react'
import { useQueryState } from 'nuqs'

export default function AnalysesListEmptyState() {
	const [searchTerm] = useQueryState('q')

	return (
		<div className="py-12 text-center">
			<div className="mb-4 text-muted">
				<AlertTriangle className="mx-auto h-16 w-16" />
			</div>
			<h3 className="mb-2 text-lg font-medium ">
				{searchTerm ? t`No results found` : t`No analyses available`}
			</h3>
			<p className="mb-4 text-muted-foreground">
				{searchTerm
					? t`Try other search terms`
					: t`The analyzes will appear here once they are run`}
			</p>
		</div>
	)
}
