'use client'

import type React from 'react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'

interface Tab {
    value: string
    label: string
    content: React.ReactNode
}

interface ResponsiveTabsProps {
    tabs: Tab[]
    defaultValue: string
}

export function ResponsiveTabs({ tabs, defaultValue }: ResponsiveTabsProps) {
    const [activeTab, setActiveTab] = useState(defaultValue)

    // Handle tab change
    const handleTabChange = (value: string) => {
        setActiveTab(value)
    }

    return (
        <Tabs
            defaultValue={defaultValue}
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
        >
            {/* Mobile Select (visible on small screens) */}
            <div className="mb-4 block md:hidden">
                <Select value={activeTab} onValueChange={handleTabChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar sección" />
                    </SelectTrigger>
                    <SelectContent>
                        {tabs.map((tab) => (
                            <SelectItem key={tab.value} value={tab.value}>
                                {tab.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Desktop Tabs (hidden on small screens) */}
            <div className="mb-4 hidden md:block">
                <TabsList
                    className="grid"
                    style={{
                        gridTemplateColumns: `repeat(${tabs.length}, 1fr)`,
                    }}
                >
                    {tabs.map((tab) => (
                        <TabsTrigger key={tab.value} value={tab.value}>
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>

            {/* Tab Content */}
            <div className="mt-2">
                {tabs.map((tab) => (
                    <TabsContent key={tab.value} value={tab.value}>
                        {tab.content}
                    </TabsContent>
                ))}
            </div>
        </Tabs>
    )
}
