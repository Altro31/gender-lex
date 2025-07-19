import { Badge } from '@/components/ui/badge'
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

interface Props {
    data: Request['Analysis']['biasedTerms']
}

export default function BiasedTermsSection({ data }: Props) {
    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">
                        Análisis de Términos Sesgados
                    </CardTitle>
                    <CardDescription>
                        Términos identificados como contenedores de sesgo de
                        género
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {data.map((term, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-medium">
                                            "{term.content}"
                                        </span>
                                        <Badge variant={'secondary'}>
                                            {term.category}
                                        </Badge>
                                    </div>
                                    <span className="text-muted-foreground text-sm">
                                        {Math.round(
                                            term.influencePercentage * 100,
                                        )}
                                        % de influencia
                                    </span>
                                </div>
                                <Progress
                                    value={term.influencePercentage * 100}
                                    className="h-2"
                                />
                                <p className="text-muted-foreground text-sm">
                                    {term.explanation}
                                </p>
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
