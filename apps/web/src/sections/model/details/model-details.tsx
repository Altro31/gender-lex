"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { useSse } from "@/lib/sse"
import TestConnectionButton from "@/sections/model/components/test-connection-button"
import { getStatusColor } from "@/sections/model/utils/status"
import type { ModelsResponseItem } from "@/types/model"
import type { $Enums } from "@repo/db/models"
import {
	AlertTriangleIcon,
	Calendar,
	Key,
	Link,
	Loader2,
	Server,
	Tag,
	User,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

interface ModelDetailsProps {
	model: ModelsResponseItem
}

export default function ModelDetails({
	model: initialModel,
}: ModelDetailsProps) {
	const [model, setModel] = useState(initialModel)
	const t = useTranslations()

	useSse("model.status.change", (e) => {
		if (e.id === model.id) {
			setModel((model) => ({
				...model,
				status: e.status,
				error: e.message!,
			}))
		}
	})

	const handleStatus = (status: $Enums.ModelStatus) => () => {
		setModel((model) => ({ ...model, status }))
	}

	return (
		<div className="space-y-2 text-wrap! wrap-break-word!">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div>
					<h3 className="text-2xl font-semibold text-gray-900">
						{model.name}
					</h3>
					<p className="mt-1 text-gray-600">
						{model.connection.identifier}
					</p>
				</div>
				<Badge className={getStatusColor(model.status)}>
					{t("Model.status." + model.status)}
				</Badge>
			</div>

			{/* Configuration Details */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg">
						<Server className="h-5 w-5" />
						{t("Commons.settings")}
					</CardTitle>
					<CardDescription>
						{t("Model.details.settings.description")}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm font-medium text-gray-700">
								<Tag className="h-4 w-4" />
								{t("Model.item")}
							</div>
							<p className="font-mono text-gray-900">
								{model.connection.identifier}
							</p>
						</div>

						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm font-medium text-gray-700">
								<Key className="h-4 w-4" />
								{t("Commons.api-key")}
							</div>
							<p className="font-mono text-gray-900">
								{model.apiKey}
							</p>
						</div>

						{model.connection.url && (
							<div className="space-y-2">
								<div className="flex items-center gap-2 text-sm font-medium text-gray-700">
									<Link className="h-4 w-4" />
									{t("Commons.endpoint")}
								</div>
								<p className="font-mono break-all text-gray-900">
									{model.connection.url}
								</p>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Usage Information */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg">
						<Calendar className="h-5 w-5" />
						{t("Model.details.usage-info.title")}
					</CardTitle>
					<CardDescription>
						{t("Model.details.usage-info.description")}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<div className="text-sm font-medium text-gray-700">
								{t("Commons.creation-date")}
							</div>
							<p className="text-gray-900">
								{new Date(model.createdAt).toLocaleDateString(
									"es-ES",
									{
										year: "numeric",
										month: "long",
										day: "numeric",
									},
								)}
							</p>
						</div>

						{model.usedAt && (
							<div className="space-y-2">
								<div className="text-sm font-medium text-gray-700">
									{t("Commons.last-use")}
								</div>
								<p className="text-gray-900">
									{new Date(model.usedAt).toLocaleDateString(
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

						<div className="space-y-2">
							<div className="text-sm font-medium text-gray-700">
								{t("Model.id")}
							</div>
							<p className="font-mono text-gray-900">
								{model.id}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Connection Test */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">
						{t("Model.test-connection.title")}
					</CardTitle>
					<CardDescription>
						{t("Model.test-connection.description")}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap items-center gap-2">
						<span className="text-sm text-gray-600">
							{t("Commons.status")}:
						</span>
						<Badge className={getStatusColor(model.status)}>
							{model.status === "connecting" && (
								<Loader2 className="animate-spin" />
							)}
							{t("Model.status." + model.status)}
						</Badge>
						<TestConnectionButton
							id={model.id}
							className="ml-auto"
							onExecute={handleStatus("connecting")}
							onSuccess={handleStatus("active")}
							onError={handleStatus("error")}
						/>
						{model.error && (
							<Alert variant="destructive">
								<AlertTriangleIcon />
								<AlertTitle>
									{t(
										"Model.status.message." +
											model.error +
											".title",
									)}
								</AlertTitle>
								<AlertDescription>
									{t(
										"Model.status.message." +
											model.error +
											".description",
									)}
								</AlertDescription>
							</Alert>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
