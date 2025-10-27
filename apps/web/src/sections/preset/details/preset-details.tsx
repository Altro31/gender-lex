"use client"

import { Badge } from "@/components/ui/badge"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import type { PresetsResponse } from "@/types/preset"
import { t } from "@lingui/core/macro"
import { Calendar, Tag, Zap } from "lucide-react"

interface Props {
	preset: PresetsResponse[number]
}

export default function PresetDetails({ preset }: Props) {
	const getRoleColor = (role: string) => {
		switch (role) {
			case "primary":
				return "bg-blue-100 text-blue-800"
			case "secondary":
				return "bg-green-100 text-green-800"
			case "tertiary":
				return "bg-purple-100 text-purple-800"
			default:
				return "bg-gray-100 text-gray-800"
		}
	}

	const getRoleText = (role: string) => {
		switch (role) {
			case "primary":
				return "Principal"
			case "secondary":
				return "Secundario"
			case "tertiary":
				return "Terciario"
			default:
				return role
		}
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div>
					<h3 className="text-2xl font-semibold text-gray-900">
						{preset.name}
					</h3>
				</div>
			</div>

			{/* Description */}
			{preset.description && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<Tag className="h-5 w-5" />
							{t`Description`}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-gray-700">{preset.description}</p>
					</CardContent>
				</Card>
			)}

			{/* Models Configuration */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg">
						<Zap className="h-5 w-5" />
						{t`Model Configuration`}
					</CardTitle>
					<CardDescription>
						{t`Models configured in this preset`}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{preset.Models.map((model) => (
						<div
							key={model.modelId + "_" + model.presetId}
							className="space-y-4 rounded-lg border p-4"
						>
							{/* Model Header */}
							<div className="flex items-center justify-between">
								<div>
									<h4 className="text-lg font-semibold">
										{model.Model.name}
									</h4>
									<p className="text-sm text-gray-600">
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
					<CardTitle className="flex items-center gap-2 text-lg">
						<Calendar className="h-5 w-5" />
						{t`Usage Information`}
					</CardTitle>
					<CardDescription>
						{t`Important dates and usage statistics`}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						<div className="space-y-2">
							<div className="text-sm font-medium text-gray-700">
								{t`Creation date`}
							</div>
							<p className="text-gray-900">
								{new Date(preset.createdAt).toLocaleDateString(
									"es-ES",
									{
										year: "numeric",
										month: "long",
										day: "numeric",
									},
								)}
							</p>
						</div>

						{preset.usedAt && (
							<div className="space-y-2">
								<div className="text-sm font-medium text-gray-700">
									{t`Last use`}
								</div>
								<p className="text-gray-900">
									{new Date(preset.usedAt).toLocaleDateString(
										"es-ES",
										{
											year: "numeric",
											month: "long",
											day: "numeric",
										},
									)}
								</p>
							</div>
						)}
					</div>

					<div className="space-y-2">
						<div className="text-sm font-medium text-gray-700">
							{t`Preset ID`}
						</div>
						<p className="font-mono text-sm text-gray-900">
							{preset.id}
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
