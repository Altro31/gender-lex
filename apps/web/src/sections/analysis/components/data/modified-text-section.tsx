import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Request } from '@zenstackhq/runtime/models'

interface Props {
    data: Request['modifiedTextAlternatives']
}

export default function ModifiedTextSection({ data }: Props) {
    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">
                        Alternativas de Texto Modificado
                    </CardTitle>
                    <CardDescription>
                        Versiones alternativas del texto con sesgo de género
                        reducido
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="1" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="1">Alternativa 1</TabsTrigger>
                            <TabsTrigger value="2">Alternativa 2</TabsTrigger>
                        </TabsList>

                        {data.map((alternative) => (
                            <TabsContent
                                key={alternative.alternativeNumber}
                                value={alternative.alternativeNumber.toString()}
                            >
                                <div className="space-y-4">
                                    <ScrollArea className="h-[150px] w-full rounded-md border p-4">
                                        <p className="text-sm">
                                            {alternative.alternativeText}
                                        </p>
                                    </ScrollArea>

                                    <div className="space-y-2">
                                        <h3 className="text-lg font-medium">
                                            Modificaciones Explicadas
                                        </h3>
                                        <div className="space-y-4">
                                            {alternative.modificationsExplanation.map(
                                                (mod, index) => (
                                                    <div
                                                        key={index}
                                                        className="space-y-2"
                                                    >
                                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                            <div className="bg-muted/50 border-muted rounded-lg border p-4 shadow-sm transition-all hover:shadow-md">
                                                                <div className="mb-2 flex items-center gap-2">
                                                                    <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
                                                                    <p className="text-muted-foreground text-sm font-medium">
                                                                        Original
                                                                    </p>
                                                                </div>
                                                                <p className="text-foreground/90 border-l-2 border-red-200 pl-3 text-sm italic">
                                                                    "
                                                                    {
                                                                        mod.originalFragment
                                                                    }
                                                                    "
                                                                </p>
                                                            </div>
                                                            <div className="rounded-lg border border-green-100 bg-green-50/50 p-4 shadow-sm transition-all hover:shadow-md dark:border-green-900 dark:bg-green-950/30">
                                                                <div className="mb-2 flex items-center gap-2">
                                                                    <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                                                                    <p className="text-muted-foreground text-sm font-medium">
                                                                        Modificado
                                                                    </p>
                                                                </div>
                                                                <p className="text-foreground/90 border-l-2 border-green-200 pl-3 text-sm italic dark:border-green-800">
                                                                    "
                                                                    {
                                                                        mod.modifiedFragment
                                                                    }
                                                                    "
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <p className="text-muted-foreground text-sm">
                                                            {mod.reason}
                                                        </p>
                                                        {index <
                                                            alternative
                                                                .modificationsExplanation
                                                                .length -
                                                                1 && (
                                                            <Separator className="my-2" />
                                                        )}
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
