import type { AnalysesResponse, AnalysesResponseItem } from "@/types/analyses"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AnalysisActions from "@/sections/analysis/components/analysis-actions"
import { Button } from "@/components/ui/button"
import {
	CheckCircle,
	Clock,
	Filter,
	Play,
	Settings,
	XCircle,
} from "lucide-react"
import { useTranslations } from "next-intl"

interface Props {
	analysis: AnalysesResponseItem
}

export default function AnalysisListItem({ analysis }: Props) {
	const t = useTranslations()
	const statusConfig = {
		pending: {
			label: t("Analysis.status.pending"),
			color: "bg-gray-100 text-gray-800",
			icon: Clock,
		},
		analyzing: {
			label: t("Analysis.status.analyzing"),
			color: "bg-blue-100 text-blue-800",
			icon: Play,
		},
		done: {
			label: t("Analysis.status.done"),
			color: "bg-green-100 text-green-800",
			icon: CheckCircle,
		},
		error: {
			label: t("Analysis.status.error"),
			color: "bg-red-100 text-red-800",
			icon: XCircle,
		},
	}
	const StatusIcon = statusConfig[analysis.status].icon
	return (
		<Card className="transition-shadow hover:shadow-md">
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<div className="mb-2 flex items-center gap-3">
							<CardTitle className="text-lg">
								{analysis.name}
							</CardTitle>
							<Badge
								className={statusConfig[analysis.status].color}
							>
								<StatusIcon className="mr-1 h-3 w-3" />
								{statusConfig[analysis.status].label}
							</Badge>
						</div>
						<CardDescription className="flex items-center gap-4 text-sm">
							<span>
								{t("Preset.item")}: {analysis.Preset.name}
							</span>
							<span>•</span>
							<span>
								{new Date(
									analysis.createdAt,
								).toLocaleDateString()}
							</span>
						</CardDescription>
					</div>

					<AnalysisActions analysis={analysis}>
						<Button variant="ghost" size="icon">
							<Settings />
						</Button>
					</AnalysisActions>
				</div>
			</CardHeader>
			<CardContent className="pb-3">
				<div className="space-y-4">
					{/* Input Preview */}
					<div className="space-y-2">
						<div className="text-muted-foreground text-sm font-medium">
							{t("Analysis.details.analiced-text")}:
						</div>
						<div className="bg-muted rounded p-2">
							<p className="text-muted-foreground line-clamp-3 text-sm">
								{analysis.originalText}
							</p>
						</div>
					</div>
				</div>
			</CardContent>

			<CardFooter className="border-t pt-3">
				<div className="flex w-full items-center justify-between text-xs text-gray-500">
					<span>ID: {analysis.id}</span>

					{analysis.updatedAt && (
						<span>
							{t("Commons.completed")}:{" "}
							{new Date(analysis.updatedAt).toLocaleString()}
						</span>
					)}
				</div>
			</CardFooter>
		</Card>
	)
}
