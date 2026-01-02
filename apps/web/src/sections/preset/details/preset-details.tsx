'use client'

import { Badge } from '@/components/ui/badge'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import type { PresetsResponse } from '@/types/preset'
import { t } from '@lingui/core/macro'
import { Calendar, Tag, Zap } from 'lucide-react'

interface Props {
	preset: PresetsResponse[number]
}

export default function PresetDetails({ preset }: Props) {
	const getRoleColor = (role: string) => {
		switch (role) {
			case 'primary':
				return 'border-blue-200 bg-blue-50 dark:bg-blue-950'
			case 'secondary':
				return 'border-green-200 bg-green-50 dark:bg-green-950'
			default:
				return 'border-muted-foreground bg-muted'
		}
	}

	const getRoleText = (role: string) => {
		switch (role) {
			case 'primary':
				return 'Principal'
			case 'secondary':
				return 'Secundario'
			case 'tertiary':
				return 'Terciario'
			default:
				return role
		}
	}

	return (
		<div className="space-y-3">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div>
					<h3 className="text-lg font-semibold">{preset.name}</h3>
				</div>
			</div>

			{/* Description */}
			{preset.description && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Tag className="size-5" />
							{t`Description`}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground">
							{preset.description}
						</p>
					</CardContent>
				</Card>
			)}

			{/* Models Configuration */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Zap className="size-5" />
						{t`Model Configuration`}
					</CardTitle>
					<CardDescription>
						{t`Models configured in this preset`}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					{preset.Models.map(model => (
						<div
							key={model.modelId + '_' + model.presetId}
							className="space-y-4 rounded-lg border p-4"
						>
							{/* Model Header */}
							<div className="flex items-center justify-between">
								<div>
									<h4 className="font-semibold">
										{model.Model.name}
									</h4>
									<p className="text-sm text-muted-foreground">
										ID: {model.modelId}
									</p>
								</div>
								<Badge className={getRoleColor(model.role)}>
									{getRoleText(model.role)}
								</Badge>
							</div>
						</div>
					))}
				</CardContent>
			</Card>

			{/* Usage Information */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calendar className="size-5" />
						{t`Usage Information`}
					</CardTitle>
					<CardDescription>
						{t`Important dates and usage statistics`}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-2">
					<div>
						<div className="text-sm font-medium ">
							{t`Creation date`}
						</div>
						<p className="text-muted-foreground">
							{new Date(preset.createdAt).toLocaleDateString(
								'es-ES',
								{
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								},
							)}
						</p>
					</div>

					{preset.usedAt && (
						<div>
							<div className="text-sm font-medium ">
								{t`Last use`}
							</div>
							<p className="text-muted-foreground">
								{new Date(preset.usedAt).toLocaleDateString(
									'es-ES',
									{
										year: 'numeric',
										month: 'long',
										day: 'numeric',
									},
								)}
							</p>
						</div>
					)}

					<div>
						<div className="text-sm font-medium ">
							{t`Preset ID`}
						</div>
						<p className="font-mono text-sm text-muted-foreground">
							{preset.id}
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
