"use client"

import { AlertTriangle } from "lucide-react"
import { useTranslations } from "next-intl"
import { useQueryState } from "nuqs"

export default function AnalysesListEmptyState() {
	const t = useTranslations()
	const [searchTerm] = useQueryState("q")

	return (
		<div className="py-12 text-center">
			<div className="mb-4 text-gray-400">
				<AlertTriangle className="mx-auto h-16 w-16" />
			</div>
			<h3 className="mb-2 text-lg font-medium text-gray-900">
				{searchTerm
					? t("Commons.no-search-result")
					: t("Analysis.list.empty-title")}
			</h3>
			<p className="mb-4 text-gray-600">
				{searchTerm
					? t("Commons.retry-search-result")
					: t("Analysis.list.empty-description")}
			</p>
		</div>
	)
}
