import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import type { Request } from "@zenstackhq/runtime/models"

interface Props {
	data: Request["conclusion"]
}

export default function ConclusionSection({ data }: Props) {
	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle className="text-xl sm:text-2xl">
						Conclusión
					</CardTitle>
					<CardDescription>
						Resumen de la reducción de sesgo y mejoras
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-sm sm:text-base">{data}</p>
				</CardContent>
			</Card>
		</div>
	)
}
