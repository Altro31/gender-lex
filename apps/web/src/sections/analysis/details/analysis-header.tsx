import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { startAnalysis } from "@/services/analysis"
import { t } from "@lingui/core/macro"
import { Select } from "@lingui/react/macro"
import {
	AlertTriangle,
	ArrowLeft,
	Calendar,
	CheckCircle,
	Clock,
	Download,
	Share2,
	User,
} from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

interface Props {
	params: PageProps<"/[locale]/analysis/[id]">["params"]
}

export default function AnalysisHeader({ params }: Props) {
	return (
		<div className="mb-8">
			<div className="mb-4 flex items-center gap-4">
				<Link href="/analysis">
					<Button variant="ghost" size="sm" className="gap-2">
						<ArrowLeft className="h-4 w-4" />
						{t`Return to Analysis`}
					</Button>
				</Link>
			</div>
			<Suspense>
				<Container params={params} />
			</Suspense>
		</div>
	)
}

async function Container({ params }: Props) {
	const { id } = await params
	const analysis = await startAnalysis(id)
	const getStatusConfig = (status: string) => {
		switch (status) {
			case "analyzing":
				return {
					label: t`Analizing`,
					color: "bg-blue-100 text-blue-800",
					icon: Clock,
				}
			case "done":
				return {
					label: t`Done`,
					color: "bg-green-100 text-green-800",
					icon: CheckCircle,
				}
			default:
				return {
					label: t`Pending`,
					color: "bg-yellow-100 text-yellow-800",
					icon: AlertTriangle,
				}
		}
	}

	const statusConfig = getStatusConfig(analysis.status)
	const StatusIcon = statusConfig.icon
	return (
		<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
			<div>
				<h1 className="mb-2 text-3xl font-bold text-gray-900">
					{t`Analysis Details`}
				</h1>
				<div className="flex items-center gap-4 text-sm text-gray-600">
					<div className="flex items-center gap-2">
						<Calendar className="h-4 w-4" />
						{new Date(analysis.createdAt).toLocaleDateString(
							"es-ES",
							{
								year: "numeric",
								month: "long",
								day: "numeric",
								hour: "2-digit",
								minute: "2-digit",
							},
						)}
					</div>
					<div className="flex items-center gap-2">
						<User className="h-4 w-4" />
						ID: {analysis.id}
					</div>
				</div>
			</div>

			<div className="flex items-center gap-3">
				<Badge className={statusConfig.color}>
					<StatusIcon className="mr-1 h-3 w-3" />
					{statusConfig.label}
				</Badge>
				<Badge
					variant={
						analysis.visibility === "public"
							? "default"
							: "secondary"
					}
				>
					{" "}
					<Select
						value={analysis.visibility}
						_public="Public"
						_private="Private"
						other="Other"
					/>
				</Badge>
				<Button
					variant="outline"
					size="sm"
					className="gap-2 bg-transparent"
				>
					<Download className="h-4 w-4" />
					{t`Export`}
				</Button>
				<Button
					variant="outline"
					size="sm"
					className="gap-2 bg-transparent"
				>
					<Share2 className="h-4 w-4" />
					{t`Share`}
				</Button>
			</div>
		</div>
	)
}
