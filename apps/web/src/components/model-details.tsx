"use client"

import { Badge } from "@/components/ui/badge"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Calendar, Key, Link, Server, Tag, User } from "lucide-react"

interface Model {
	id: string
	name: string
	provider: string
	model: string
	apiKey: string
	endpoint?: string
	status: "active" | "inactive" | "error"
	createdAt: string
	lastUsed?: string
	description?: string
}

interface ModelDetailsProps {
	model: Model
}

export default function ModelDetails({ model }: ModelDetailsProps) {
	const getStatusColor = (status: Model["status"]) => {
		switch (status) {
			case "active":
				return "bg-green-100 text-green-800"
			case "inactive":
				return "bg-gray-100 text-gray-800"
			case "error":
				return "bg-red-100 text-red-800"
			default:
				return "bg-gray-100 text-gray-800"
		}
	}

	const getStatusText = (status: Model["status"]) => {
		switch (status) {
			case "active":
				return "Activo"
			case "inactive":
				return "Inactivo"
			case "error":
				return "Error"
			default:
				return "Desconocido"
		}
	}

	const maskApiKey = (apiKey: string) => {
		if (!apiKey) return "No configurada"
		if (apiKey.length <= 8) return "*".repeat(apiKey.length)
		return (
			apiKey.substring(0, 4) +
			"*".repeat(apiKey.length - 8) +
			apiKey.substring(apiKey.length - 4)
		)
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div>
					<h3 className="text-2xl font-semibold text-gray-900">
						{model.name}
					</h3>
					<p className="text-gray-600 mt-1">
						{model.provider} • {model.model}
					</p>
				</div>
				<Badge className={getStatusColor(model.status)}>
					{getStatusText(model.status)}
				</Badge>
			</div>

			{/* Description */}
			{model.description && (
				<Card>
					<CardHeader>
						<CardTitle className="text-lg flex items-center gap-2">
							<Tag className="h-5 w-5" />
							Descripción
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-gray-700">{model.description}</p>
					</CardContent>
				</Card>
			)}

			{/* Configuration Details */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<Server className="h-5 w-5" />
						Configuración
					</CardTitle>
					<CardDescription>
						Detalles técnicos de la conexión al modelo
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm font-medium text-gray-700">
								<User className="h-4 w-4" />
								Proveedor
							</div>
							<p className="text-gray-900 font-mono">
								{model.provider}
							</p>
						</div>

						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm font-medium text-gray-700">
								<Tag className="h-4 w-4" />
								Modelo
							</div>
							<p className="text-gray-900 font-mono">
								{model.model}
							</p>
						</div>

						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm font-medium text-gray-700">
								<Key className="h-4 w-4" />
								Clave API
							</div>
							<p className="text-gray-900 font-mono">
								{maskApiKey(model.apiKey)}
							</p>
						</div>

						{model.endpoint && (
							<div className="space-y-2">
								<div className="flex items-center gap-2 text-sm font-medium text-gray-700">
									<Link className="h-4 w-4" />
									Endpoint
								</div>
								<p className="text-gray-900 font-mono break-all">
									{model.endpoint}
								</p>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Usage Information */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						Información de Uso
					</CardTitle>
					<CardDescription>
						Fechas importantes y estadísticas de uso
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<div className="text-sm font-medium text-gray-700">
								Fecha de Creación
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

						{model.lastUsed && (
							<div className="space-y-2">
								<div className="text-sm font-medium text-gray-700">
									Último Uso
								</div>
								<p className="text-gray-900">
									{new Date(
										model.lastUsed,
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
							<p className="text-gray-900 font-mono">
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
					<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
						<div className="flex items-center gap-3">
							<div
								className={`w-3 h-3 rounded-full ${
									model.status === "active"
										? "bg-green-500"
										: model.status === "error"
											? "bg-red-500"
											: "bg-gray-400"
								}`}
							/>
							<span className="text-sm font-medium">
								{model.status === "active"
									? "Conexión exitosa"
									: model.status === "error"
										? "Error de conexión"
										: "Sin probar"}
							</span>
						</div>
						<button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
							Probar Conexión
						</button>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
