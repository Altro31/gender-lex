import BiasedMetaphorsSection from '@/sections/analysis/components/data/biased-metaphors-section'
import BiasedTermsSection from '@/sections/analysis/components/data/biased-terms-section'
import ConclusionSection from '@/sections/analysis/components/data/conclusion-section'
import ContextEvaluationSection from '@/sections/analysis/components/data/context-evaluation-section'
import ImpactAnalysisSection from '@/sections/analysis/components/data/impact-analysis-section'
import ModifiedTextSection from '@/sections/analysis/components/data/modified-text-section'
import type { Request } from '@zenstackhq/runtime/models'
import { useRef, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '~ui/card'
import { ScrollArea } from '~ui/scroll-area'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~ui/tabs'

interface Props {
    data: Request
}

export default function ResultData({ data }: Props) {
    const [activeTab, setActiveTab] = useState('biased-terms')
    const tabsElementRef = useRef<HTMLDivElement>(null)

    const handleTabChange = (value: string) => {
        setActiveTab(value)
    }

    const handleSelectChange = (value: string) => {
        setActiveTab(value)

        const tabsElement = tabsElementRef.current
        if (tabsElement) {
            const button = tabsElement.querySelector(
                `[data-value="${value}"]`,
            ) as HTMLButtonElement
            if (button) {
                button.click()
            }
        }
    }

    const tabOptions = [
        { value: 'biased-terms', label: 'Términos' },
        { value: 'biased-metaphors', label: 'Metáforas' },
        { value: 'context-evaluation', label: 'Contexto' },
        { value: 'impact-analysis', label: 'Impacto' },
        { value: 'modified-text', label: 'Alternativas' },
        { value: 'conclusion', label: 'Conclusión' },
    ]

    return (
        <div className="flex flex-col space-y-4 sm:space-y-6">
            <Card>
                <CardHeader className="pb-2 sm:pb-4">
                    <CardTitle className="text-xl sm:text-2xl">
                        Texto Original
                    </CardTitle>
                    <CardDescription>
                        El texto que se está analizando por sesgo de género
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[150px] w-full rounded-md border p-3 sm:h-[200px] sm:p-4">
                        <p className="text-xs sm:text-sm">
                            {data.originalText}
                        </p>
                    </ScrollArea>
                </CardContent>
            </Card>

            <div className="w-full" ref={tabsElementRef}>
                <Tabs
                    value={activeTab}
                    onValueChange={handleTabChange}
                    className="w-full"
                    id="analysis-tabs"
                >
                    <div className="mb-4 block md:hidden">
                        <Select
                            value={activeTab}
                            onValueChange={handleSelectChange}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccionar sección de análisis" />
                            </SelectTrigger>
                            <SelectContent>
                                {tabOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="mb-4 hidden md:block">
                        <TabsList className="grid w-full grid-cols-6">
                            {tabOptions.map((option) => (
                                <TabsTrigger
                                    key={option.value}
                                    value={option.value}
                                    data-value={option.value}
                                >
                                    {option.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    <div className="mt-2">
                        <TabsContent value="biased-terms">
                            <BiasedTermsSection
                                data={data.Analysis.biasedTerms}
                            />
                        </TabsContent>

                        <TabsContent value="biased-metaphors">
                            <BiasedMetaphorsSection
                                data={data.Analysis.biasedMetaphors}
                            />
                        </TabsContent>

                        <TabsContent value="context-evaluation">
                            <ContextEvaluationSection
                                data={data.Analysis.additionalContextEvaluation}
                            />
                        </TabsContent>

                        <TabsContent value="impact-analysis">
                            <ImpactAnalysisSection
                                data={data.Analysis.impactAnalysis}
                            />
                        </TabsContent>

                        <TabsContent value="modified-text">
                            <ModifiedTextSection
                                data={data.modifiedTextAlternatives}
                            />
                        </TabsContent>

                        <TabsContent value="conclusion">
                            <ConclusionSection data={data.conclusion} />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    )
}
