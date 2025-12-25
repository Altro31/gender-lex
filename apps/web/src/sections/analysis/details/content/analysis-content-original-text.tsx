'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { t } from '@lingui/core/macro'
import { Eye, EyeOff, Settings } from 'lucide-react'
import { useState } from 'react'

interface Props {
	text: string
}

export default function AnalysisContentOriginalText({ text }: Props) {
	const [showSensitiveContent, setShowSensitiveContent] = useState(true)

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<Settings className="h-5 w-5" />
						{t`Original text`}
					</CardTitle>
					<Button
						variant="ghost"
						size="sm"
						onClick={() =>
							setShowSensitiveContent(!showSensitiveContent)
						}
						className="gap-2"
					>
						{showSensitiveContent ? <EyeOff /> : <Eye />}
						{showSensitiveContent ? t`Hide` : t`Show`}
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				{showSensitiveContent ? (
					<div className="rounded-lg bg-gray-50 p-4">
						<p className="leading-relaxed text-gray-900">{text}</p>
					</div>
				) : (
					<div className="rounded-lg bg-gray-100 p-4 text-center">
						<p className="text-gray-500">
							{t`Content hidden for privacy`}
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
