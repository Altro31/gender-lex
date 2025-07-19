import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import type { Request } from '@zenstackhq/runtime/models'

export default function BiasedMetaphorsSection({ data }: Props) {
    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">
                        Análisis de Metáforas Sesgadas
                    </CardTitle>
                    <CardDescription>
                        Metáforas y expresiones figurativas que refuerzan el
                        sesgo de género
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {data.map((metaphor, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                                    <span className="font-medium">
                                        "{metaphor.content}"
                                    </span>
                                    <span className="text-muted-foreground text-sm">
                                        {Math.round(
                                            metaphor.influencePercentage * 100,
                                        )}
                                        % de influencia
                                    </span>
                                </div>
                                <Progress
                                    value={metaphor.influencePercentage * 100}
                                    className="h-2"
                                />
                                <p className="text-muted-foreground text-sm">
                                    {metaphor.explanation}
                                </p>
                                <div className="bg-muted mt-2 rounded-md p-3">
                                    <p className="text-sm font-medium">
                                        Contexto Histórico:
                                    </p>
                                    <p className="text-sm">
                                        {metaphor.historicalContext}
                                    </p>
                                </div>
                                {index < data.length - 1 && (
                                    <Separator className="my-2" />
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
