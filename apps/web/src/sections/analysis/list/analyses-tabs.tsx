"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { $Enums, type AnalysisStatus } from "@prisma/client"
import { useTranslations } from "next-intl"
import { useQueryState, parseAsStringEnum, debounce } from "nuqs"
import type { PropsWithChildren } from "react"

export default function AnalysesTabs({ children }: PropsWithChildren) {
	const t = useTranslations()
	const [statusFilter, setStatusFilter] = useQueryState(
		"status",
		parseAsStringEnum([...Object.values($Enums.AnalysisStatus), ""])
			.withDefault("")
			.withOptions({
				shallow: false,
				limitUrlUpdates: debounce(500),
			}),
	)

	const handleTab = (value: AnalysisStatus | "") => {
		setStatusFilter(value || null)
	}
	return (
		<Tabs
			value={statusFilter}
			onValueChange={handleTab as any}
			className="w-full"
		>
			<TabsList className="grid w-full grid-cols-5 lg:w-auto">
				<TabsTrigger value="">{t("Commons.all")}</TabsTrigger>
				<TabsTrigger value="pending">
					{t("Analysis.list.status-tabs.pending")}
				</TabsTrigger>
				<TabsTrigger value="analyzing">
					{t("Analysis.list.status-tabs.analyzing")}
				</TabsTrigger>
				<TabsTrigger value="done">
					{t("Analysis.list.status-tabs.done")}
				</TabsTrigger>
				<TabsTrigger value="error">
					{t("Analysis.list.status-tabs.error")}
				</TabsTrigger>
			</TabsList>
			{children}
		</Tabs>
	)
}
