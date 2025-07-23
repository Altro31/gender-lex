import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import type { Request } from "@zenstackhq/runtime/models"
import { AlertTriangle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "~ui/alert"

interface Props {
	data: Request["Analysis"]["impactAnalysis"]
}

export default function ImpactAnalysisSection({ data }: Props) {
	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle className="text-xl sm:text-2xl">
						Análisis de Impacto
					</CardTitle>
					<CardDescription>
						Posibles consecuencias reales de los sesgos
						identificados
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<h3 className="mb-2 text-lg font-medium">
							Acceso a la Atención
						</h3>
						<Alert
							variant={
								data.accessToCare.affected
									? "destructive"
									: "default"
							}
						>
							<div className="flex items-start gap-2">
								{data.accessToCare.affected ? (
									<AlertTriangle className="mt-0.5 h-5 w-5" />
								) : (
									<CheckCircle className="mt-0.5 h-5 w-5" />
								)}
								<AlertDescription>
									{data.accessToCare.description}
								</AlertDescription>
							</div>
						</Alert>
					</div>

					<div>
						<h3 className="mb-2 text-lg font-medium">
							Estigmatización
						</h3>
						<Alert
							variant={
								data.stigmatization.affected
									? "destructive"
									: "default"
							}
						>
							<div className="flex items-start gap-2">
								{data.stigmatization.affected ? (
									<AlertTriangle className="mt-0.5 h-5 w-5" />
								) : (
									<CheckCircle className="mt-0.5 h-5 w-5" />
								)}
								<AlertDescription>
									{data.stigmatization.description}
								</AlertDescription>
							</div>
						</Alert>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
