"use client"

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
import { Calendar, Key, Link, Loader2, Server, Tag, User } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

interface ModelDetailsProps {
	model: ModelsResponseItem
}

export default function ModelDetails({ model }: ModelDetailsProps) {
	const [status, setStatus] = useState(model.attributes.status)
	const t = useTranslations()

	useSse("model.status.change", ({ id, status }) => {
		if (id === model.id) {
			setStatus(status)
		}
	})
	return (
		<div className="space-y-2 text-wrap! wrap-break-word!">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div>
					<h3 className="text-2xl font-semibold text-gray-900">
						{model.attributes.name}
					</h3>
					<p className="mt-1 text-gray-600">
						{model.attributes.connection.identifier}
					</p>
				</div>
				<Badge className={getStatusColor(model.attributes.status)}>
					{t("Model.status." + model.attributes.status)}
				</Badge>
			</div>

			{/* Configuration Details */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg">
						<Server className="h-5 w-5" />
						Configuración
					</CardTitle>
					<CardDescription>
						Detalles técnicos de la conexión al modelo
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm font-medium text-gray-700">
								<Tag className="h-4 w-4" />
								Modelo
							</div>
							<p className="font-mono text-gray-900">
								{model.attributes.connection.identifier}
							</p>
						</div>

						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm font-medium text-gray-700">
								<Key className="h-4 w-4" />
								Clave API
							</div>
							<p className="font-mono text-gray-900">
								{model.attributes.apiKey}
							</p>
						</div>

						{model.attributes.connection.url && (
							<div className="space-y-2">
								<div className="flex items-center gap-2 text-sm font-medium text-gray-700">
									<Link className="h-4 w-4" />
									Endpoint
								</div>
								<p className="font-mono break-all text-gray-900">
									{model.attributes.connection.url}
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
						Información de Uso
					</CardTitle>
					<CardDescription>
						Fechas importantes y estadísticas de uso
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<div className="text-sm font-medium text-gray-700">
								Fecha de Creación
							</div>
							<p className="text-gray-900">
								{new Date(
									model.attributes.createdAt,
								).toLocaleDateString("es-ES", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</p>
						</div>

						{model.attributes.usedAt && (
							<div className="space-y-2">
								<div className="text-sm font-medium text-gray-700">
									Último Uso
								</div>
								<p className="text-gray-900">
									{new Date(
										model.attributes.usedAt,
									).toLocaleDateString("es-ES", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</p>
							</div>
						)}

						<div className="space-y-2">
							<div className="text-sm font-medium text-gray-700">
								ID del Modelo
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
						Prueba de Conexión
					</CardTitle>
					<CardDescription>
						Verifica que la configuración del modelo sea correcta
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap items-center gap-2">
						<span className="text-sm text-gray-600">Estado:</span>
						<Badge className={getStatusColor(status)}>
							{status === "connecting" && (
								<Loader2 className="animate-spin" />
							)}
							{t("Model.status." + status)}
						</Badge>
						<TestConnectionButton
							id={model.id}
							className="ml-auto"
							onExecute={() => setStatus("connecting")}
							onSuccess={() => setStatus("active")}
							onError={() => setStatus("error")}
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
