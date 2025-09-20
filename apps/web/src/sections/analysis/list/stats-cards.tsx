import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { StatusCountResponse } from "@/types/analyses"
import { useTranslations } from "next-intl"

interface Props {
	statusCount: StatusCountResponse
}

export default function StatsCards({ statusCount }: Props) {
	const t = useTranslations()
	const statusMapper = {
		all: { label: t("Commons.all"), color: "text-gray-900" },
		analyzing: {
			label: t("Analysis.status.analyzing"),
			color: "text-blue-600",
		},
		done: { label: t("Analysis.status.done"), color: "text-green-600" },
		error: { label: t("Analysis.status.error"), color: "text-red-600" },
		pending: {
			label: t("Analysis.status.pending"),
			color: "text-gray-600",
		},
	} as const satisfies Record<
		keyof StatusCountResponse,
		{ label: string; color: `text-${string}-${number}00` }
	>

	return (
		<div className="grid grid-cols-2 gap-2 md:grid-cols-5">
			{Object.entries(statusMapper).map(([key, { label, color }]) => (
				<div
					key={key}
					className="flex justify-center gap-2 rounded-lg border p-2 text-sm"
				>
					<div className="text-gray-600">{label}:</div>
					<div className={cn("font-bold", color)}>
						{statusCount[key as keyof StatusCountResponse]}
					</div>
				</div>
			))}
		</div>
	)
}
