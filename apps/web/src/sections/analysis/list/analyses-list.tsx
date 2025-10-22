"use client"

import AnalysesListEmptyState from "@/sections/analysis/list/analyses-list-empty-state"
import AnalysesListItem from "@/sections/analysis/list/analyses-list-item"
import type { AnalysesResponse } from "@/types/analyses"

interface Props {
	analyses: AnalysesResponse
}

export default function AnalysesList({ analyses }: Props) {
	return analyses.length === 0 ? (
		<AnalysesListEmptyState />
	) : (
		<div className="space-y-4">
			{analyses.map((analysis) => {
				return (
					<AnalysesListItem key={analysis.id} analysis={analysis} />
				)
			})}
		</div>
	)
}
