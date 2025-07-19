import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { Request } from '@zenstackhq/runtime/models'

interface Props {
    data: Request['Analysis']['additionalContextEvaluation']
}

export default function ContextEvaluationSection({ data }: Props) {
    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">
                        Evaluación Contextual
                    </CardTitle>
                    <CardDescription>
                        Análisis de sesgos contextuales más amplios en el texto
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="stereotype">
                            <AccordionTrigger>
                                <div className="flex w-full flex-col justify-between gap-2 pr-4 sm:flex-row sm:items-center">
                                    <span>Estereotipos</span>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant={
                                                data.stereotype.presence
                                                    ? 'destructive'
                                                    : 'outline'
                                            }
                                        >
                                            {data.stereotype.presence
                                                ? 'Presente'
                                                : 'Ausente'}
                                        </Badge>
                                        <span className="text-muted-foreground text-sm">
                                            {Math.round(
                                                data.stereotype
                                                    .influencePercentage * 100,
                                            )}
                                            %
                                        </span>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-2 p-2">
                                    <Progress
                                        value={
                                            data.stereotype
                                                .influencePercentage * 100
                                        }
                                        className="h-2"
                                    />
                                    <p className="text-sm">
                                        {data.stereotype.explanation}
                                    </p>
                                    <div className="mt-2">
                                        <p className="text-sm font-medium">
                                            Ejemplos:
                                        </p>
                                        <ul className="list-disc pl-5 text-sm">
                                            {data.stereotype.examples.map(
                                                (example, i) => (
                                                    <li key={i}>{example}</li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="powerAsymmetry">
                            <AccordionTrigger>
                                <div className="flex w-full flex-col justify-between gap-2 pr-4 sm:flex-row sm:items-center">
                                    <span>Asimetría de Poder</span>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant={
                                                data.powerAsymmetry.presence
                                                    ? 'destructive'
                                                    : 'outline'
                                            }
                                        >
                                            {data.powerAsymmetry.presence
                                                ? 'Presente'
                                                : 'Ausente'}
                                        </Badge>
                                        <span className="text-muted-foreground text-sm">
                                            {Math.round(
                                                data.powerAsymmetry
                                                    .influencePercentage * 100,
                                            )}
                                            %
                                        </span>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-2 p-2">
                                    <Progress
                                        value={
                                            data.powerAsymmetry
                                                .influencePercentage * 100
                                        }
                                        className="h-2"
                                    />
                                    <p className="text-sm">
                                        {data.powerAsymmetry.explanation}
                                    </p>
                                    <div className="mt-2">
                                        <p className="text-sm font-medium">
                                            Ejemplos:
                                        </p>
                                        <ul className="list-disc pl-5 text-sm">
                                            {data.powerAsymmetry.examples.map(
                                                (example, i) => (
                                                    <li key={i}>{example}</li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="genderRepresentation">
                            <AccordionTrigger>
                                <div className="flex w-full flex-col justify-between gap-2 pr-4 sm:flex-row sm:items-center">
                                    <span>
                                        Ausencia de Representación de Género
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant={
                                                data.genderRepresentationAbsence
                                                    .presence
                                                    ? 'destructive'
                                                    : 'outline'
                                            }
                                        >
                                            {data.genderRepresentationAbsence
                                                .presence
                                                ? 'Presente'
                                                : 'Ausente'}
                                        </Badge>
                                        <span className="text-muted-foreground text-sm">
                                            {Math.round(
                                                data.genderRepresentationAbsence
                                                    .influencePercentage * 100,
                                            )}
                                            %
                                        </span>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-2 p-2">
                                    <Progress
                                        value={
                                            data.genderRepresentationAbsence
                                                .influencePercentage * 100
                                        }
                                        className="h-2"
                                    />
                                    <p className="text-sm">
                                        {
                                            data.genderRepresentationAbsence
                                                .explanation
                                        }
                                    </p>
                                    <div className="mt-2">
                                        <p className="text-sm font-medium">
                                            Grupos Afectados:
                                        </p>
                                        <ul className="list-disc pl-5 text-sm">
                                            {data.genderRepresentationAbsence.affectedGroups.map(
                                                (group, i) => (
                                                    <li key={i}>{group}</li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="intersectionality">
                            <AccordionTrigger>
                                <div className="flex w-full flex-col justify-between gap-2 pr-4 sm:flex-row sm:items-center">
                                    <span>Interseccionalidad</span>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant={
                                                data.intersectionality.presence
                                                    ? 'destructive'
                                                    : 'outline'
                                            }
                                        >
                                            {data.intersectionality.presence
                                                ? 'Presente'
                                                : 'Ausente'}
                                        </Badge>
                                        <span className="text-muted-foreground text-sm">
                                            {Math.round(
                                                data.intersectionality
                                                    .influencePercentage * 100,
                                            )}
                                            %
                                        </span>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-2 p-2">
                                    <Progress
                                        value={
                                            data.intersectionality
                                                .influencePercentage * 100
                                        }
                                        className="h-2"
                                    />
                                    <p className="text-sm">
                                        {data.intersectionality.explanation}
                                    </p>
                                    <div className="mt-2">
                                        <p className="text-sm font-medium">
                                            Grupos Excluidos:
                                        </p>
                                        <ul className="list-disc pl-5 text-sm">
                                            {data.intersectionality.excludedGroups.map(
                                                (group, i) => (
                                                    <li key={i}>{group}</li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="systemicBiases">
                            <AccordionTrigger>
                                <div className="flex w-full flex-col justify-between gap-2 pr-4 sm:flex-row sm:items-center">
                                    <span>Sesgos Sistémicos</span>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant={
                                                data.systemicBiases.presence
                                                    ? 'destructive'
                                                    : 'outline'
                                            }
                                        >
                                            {data.systemicBiases.presence
                                                ? 'Presente'
                                                : 'Ausente'}
                                        </Badge>
                                        <span className="text-muted-foreground text-sm">
                                            {Math.round(
                                                data.systemicBiases
                                                    .influencePercentage * 100,
                                            )}
                                            %
                                        </span>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-2 p-2">
                                    <Progress
                                        value={
                                            data.systemicBiases
                                                .influencePercentage * 100
                                        }
                                        className="h-2"
                                    />
                                    <p className="text-sm">
                                        {data.systemicBiases.explanation}
                                    </p>
                                    <div className="mt-2">
                                        <p className="text-sm font-medium">
                                            Ejemplos:
                                        </p>
                                        <ul className="list-disc pl-5 text-sm">
                                            {data.systemicBiases.examples.map(
                                                (example, i) => (
                                                    <li key={i}>{example}</li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    )
}
