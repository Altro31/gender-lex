"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { t } from "@lingui/core/macro"
import { $Enums, type AnalysisStatus } from "@prisma/client"
import { debounce, parseAsStringEnum, useQueryState } from "nuqs"
import type { PropsWithChildren } from "react"

export default function AnalysesTabs({ children }: PropsWithChildren) {
	const [statusFilter, setStatusFilter] = useQueryState(
		"status",
		parseAsStringEnum([...Object.values($Enums.AnalysisStatus), ""])
			.withDefault("")
			.withOptions({ shallow: false, limitUrlUpdates: debounce(500) }),
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
				<TabsTrigger value="">{t`All`}</TabsTrigger>
				<TabsTrigger value="pending">{t`Pending`}</TabsTrigger>
				<TabsTrigger value="analyzing">{t`Analizing`}</TabsTrigger>
				<TabsTrigger value="done">{t`Done`}</TabsTrigger>
				<TabsTrigger value="error">{t`Error`}</TabsTrigger>
			</TabsList>
			{children}
		</Tabs>
	)
}
